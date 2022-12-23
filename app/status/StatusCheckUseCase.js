import { logger } from '../../logger.js'
import { formatDuration } from '../utils/date.js'
import { escapeMd } from '../utils/escapeMd.js'
import { Status } from './Status.js'

export class StatusCheckUseCase {
  /**
   * @param {{
   *   statusChecker: any,
   *   statusStorage: any,
   *   retryMs: number,
   *   retryAttempts: number,
   *   notificationSoundDelayMs: number,
   *   localize: any,
   *   bot: import('telegraf').Telegraf,
   *   reportChatId: string,
   * }} deps
   */
  constructor({
    statusChecker,
    statusStorage,
    retryMs,
    retryAttempts,
    notificationSoundDelayMs,
    localize,
    bot,
    reportChatId,
  }) {
    this._statusChecker = statusChecker
    this._statusStorage = statusStorage
    this._retryMs = retryMs
    this._retryAttempts = retryAttempts
    this._notificationSoundDelayMs = notificationSoundDelayMs
    this._localize = localize
    this._bot = bot
    this._reportChatId = reportChatId
  }

  async run() {
    const status = await this._fetchCurrentStatus()

    logger.debug({}, 'Fetching the latest status first change')
    const latestStatusFirstChange =
      await this._statusStorage.findLatestStatusFirstChange()

    logger.debug({}, 'Storing the current status')
    await this._statusStorage.createStatus(status)

    try {
      await this._notifyIfNecessary({ status, latestStatusFirstChange })
    } catch (error) {
      logger.error(error, 'Could not notify about status change')
    }

    return { status, latestStatusFirstChange }
  }

  /** @returns {Promise<import('./Status').Status>} */
  async _fetchCurrentStatus() {
    logger.debug({}, 'Fetching current status')
    const firstStatus = await this._statusChecker.check()
    if (firstStatus.isOnline) return firstStatus

    for (
      let retryAttempt = 1;
      retryAttempt <= this._retryAttempts;
      retryAttempt++
    ) {
      logger.debug(
        { retryAttempt, retryMs: this._retryMs },
        'Current status is offline, retrying in a moment'
      )
      await new Promise((resolve) => setTimeout(resolve, this._retryMs))

      logger.debug({}, 'Fetching current status again')
      const currentStatus = await this._statusChecker.check()

      if (currentStatus.isOnline) {
        return currentStatus
      }
    }

    return firstStatus
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

        logger.debug(
          { status, latestStatusFirstChange, latestStatusDurationMs },
          'Status has been changed since the last time'
        )

        await this._bot.telegram.sendMessage(
          this._reportChatId,
          status.isOnline
            ? this._localize('becameOnlineAfter', { duration })
            : this._localize('becameOfflineAfter', { duration }),
          {
            parse_mode: 'MarkdownV2',
            disable_notification:
              latestStatusDurationMs < this._notificationSoundDelayMs,
          }
        )
      } else {
        logger.debug({}, 'Status has not been changed since the last time')
      }
    } else {
      logger.debug({ status }, 'New status has been retrieved')
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
