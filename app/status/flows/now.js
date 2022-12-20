import { RateLimitError } from '../../errors/RateLimitError.js'
import { formatDuration } from '../../utils/date.js'
import { escapeMd } from '../../utils/escapeMd.js'

/**
 * @param {{
 *   bot: import('telegraf').Telegraf,
 *   statusChecker: import('../TpLinkStatusChecker').TpLinkStatusChecker,
 *   statusStorage: import('../StatusPostgresStorage').StatusPostgresStorage,
 * }} dependencies 
 */
export function nowCommand({ bot, statusChecker, statusStorage }) {
  return async (context) => {
    const { localize } = context.state

    const message = await context.reply(localize('fetchingStatus'), {
      parse_mode: 'MarkdownV2',
    })

    try {
      const status = await statusChecker.check()
      const latestStatusFirstChange = await statusStorage.findLatestStatusFirstChange()
  
      let replyText
      if (
        !latestStatusFirstChange ||
        latestStatusFirstChange.isOnline !== status.isOnline
      ) {
        replyText = status.isOnline
          ? localize('becameOnline')
          : localize('becameOffline')
      } else {
        const durationMs =
          status.createdAt.getTime() -
          latestStatusFirstChange.createdAt.getTime()
  
        replyText = status.isOnline
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
    } catch (error) {
      if (error instanceof RateLimitError) {
        await bot.telegram.editMessageText(
          message.chat.id,
          message.message_id,
          undefined,
          localize('rateLimitError'),
          { parse_mode: 'MarkdownV2' }
        )
      } else {
        bot.telegram.editMessageText(
          message.chat.id,
          message.message_id,
          undefined,
          localize('unknownError'),
          { parse_mode: 'MarkdownV2' }
        ).catch(() => {})

        throw error
      }
    }
  }
}
