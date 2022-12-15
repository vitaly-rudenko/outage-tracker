import { formatDuration } from '../../utils/date.js'
import { escapeMd } from '../../utils/escapeMd.js'

/**
 * @param {{
 *   bot: import('telegraf').Telegraf,
 *   statusChecker: import('../MiHomeStatusChecker').MiHomeStatusChecker,
 *   statusStorage: import('../StatusPostgresStorage').StatusPostgresStorage,
 * }} dependencies 
 */
export function nowCommand({ bot, statusChecker, statusStorage }) {
  return async (context) => {
    const { localize } = context.state

    const message = await context.reply(localize('fetchingStatus'), {
      parse_mode: 'MarkdownV2',
    })

    const latestStatusFirstChange = await statusStorage.findLatestStatusFirstChange()
    const currentStatus = await statusChecker.check()

    let replyText
    if (
      !latestStatusFirstChange ||
      latestStatusFirstChange.isOnline !== currentStatus.isOnline
    ) {
      await statusStorage.createStatus(currentStatus)

      replyText = currentStatus.isOnline
        ? localize('becameOnline')
        : localize('becameOffline')
    } else {
      const durationMs =
        currentStatus.createdAt.getTime() -
        latestStatusFirstChange.createdAt.getTime()

      replyText = currentStatus.isOnline
        ? localize('stillOnline', { duration: escapeMd(formatDuration({ ms: durationMs, localize })) })
        : localize('stillOffline', { duration: escapeMd(formatDuration({ ms: durationMs, localize })) })
    }

    await bot.telegram.editMessageText(
      message.chat.id,
      message.message_id,
      undefined,
      replyText,
      { parse_mode: 'MarkdownV2' }
    )
  }
}
