import { logger } from '../../logger.js'
import { formatDuration } from '../utils/date.js'
import { escapeMd } from '../utils/escapeMd.js'
import { Status } from './Status.js'

export class StatusCheckUseCase {
  constructor({ statusChecker, statusStorage, retryMs, retryAttempts, localize, bot, reportChatId }) {
    this._statusChecker = statusChecker
    this._statusStorage = statusStorage
    this._retryMs = retryMs
    this._retryAttempts = retryAttempts
    this._localize = localize
    this._bot = bot
    this._reportChatId = reportChatId
  }

  /**
   * 
   * @param {{ retryIfOffline: boolean }} input
   * @returns {Promise<{ status: Status, latestStatusFirstChange: Status }>}
   */
  async run({ retryIfOffline }) {
    const status = await this._fetchCurrentStatus({ retryIfOffline })

    logger.info({}, 'Fetching the latest status first change')
    const latestStatusFirstChange =
      await this._statusStorage.findLatestStatusFirstChange()

    logger.info({}, 'Storing the current status')
    await this._statusStorage.createStatus(status)
  
    try {
      await this._notifyIfNecessary({ status, latestStatusFirstChange })
    } catch (error) {
      logger.error(error, 'Could not notify about status change')
    }

    return { status, latestStatusFirstChange }
  }

  /** @returns {Promise<import('./Status').Status>} */
  async _fetchCurrentStatus({ retryIfOffline }) {
    logger.info({}, 'Fetching current status')
    let status = await this._statusChecker.check()

    if (!status.isOnline && retryIfOffline) {
      for (let retryAttempt = 1; retryAttempt <= this._retryAttempts; retryAttempt++) {
        logger.info({ retryAttempt, retryMs: this._retryMs }, 'Current status is offline, retrying in a moment')
        await new Promise((resolve) => setTimeout(resolve, this._retryMs))
  
        logger.info({}, 'Fetching current status again')
        status = await this._statusChecker.check()

        if (status.isOnline) {
          return status
        }
      }
    }

    return status
  }

  async _notifyIfNecessary({ status, latestStatusFirstChange }) {
    // TODO: perhaps only use latestStatusFirstChange if it was recent enough
    if (latestStatusFirstChange) {
      if (latestStatusFirstChange.isOnline !== status.isOnline) {
        const latestStatusDurationMs =
          status.createdAt.getTime() -
          latestStatusFirstChange.createdAt.getTime()
        const duration = escapeMd(
          formatDuration({
            ms: latestStatusDurationMs,
            localize: this._localize,
          })
        )

        logger.info(
          { status, latestStatusFirstChange, latestStatusDurationMs },
          'Status has been changed since the last time'
        )

        await this._bot.telegram.sendMessage(
          this._reportChatId,
          status.isOnline
            ? this._localize('becameOnlineAfter', { duration })
            : this._localize('becameOfflineAfter', { duration }),
          { parse_mode: 'MarkdownV2' }
        )
      } else {
        logger.info({}, 'Status has not been changed since the last time')
      }
    } else {
      logger.info({ status }, 'New status has been retrieved')
      await this._bot.telegram.sendMessage(
        this._reportChatId,
        status.isOnline
          ? this._localize('becameOnline')
          : this._localize('becameOffline'),
        { parse_mode: 'MarkdownV2' }
      )
    }
  }
}
