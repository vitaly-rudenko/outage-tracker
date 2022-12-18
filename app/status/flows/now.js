import { formatDuration } from '../../utils/date.js'
import { escapeMd } from '../../utils/escapeMd.js'

/**
 * @param {{
 *   bot: import('telegraf').Telegraf,
 *   statusCheckUseCase: import('../StatusCheckUseCase').StatusCheckUseCase,
 * }} dependencies 
 */
export function nowCommand({ bot, statusCheckUseCase }) {
  return async (context) => {
    const { localize } = context.state

    const message = await context.reply(localize('fetchingStatus'), {
      parse_mode: 'MarkdownV2',
    })

    const { status, latestStatusFirstChange } = await statusCheckUseCase.run({ retryIfOffline: false })

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
  }
}
