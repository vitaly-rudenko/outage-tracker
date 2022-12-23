import got from 'got'
import yaml from 'js-yaml'

export function exportCommand({ bot, statusStorage }) {
  return async (context) => {
    const { localize } = context.state

    const message = await context.reply(localize('export.loading'), {
      parse_mode: 'MarkdownV2',
    })

    const statuses = await statusStorage.findStatusesBetween({
      startDateIncluding: new Date(Date.now() - 31 * 24 * 60 * 60_000),
      endDateExcluding: new Date(),
    })

    const exportedData = { statuses }

    await context.replyWithDocument({
      source: Buffer.from(yaml.dump(exportedData)),
      filename: `outage-tracker-${Date.now()}.yml`,
    })

    await bot.telegram.deleteMessage(message.chat.id, message.message_id)
  }
}

export function importMessage({ bot, statusStorage }) {
  return async (context, next) => {
    if (!('document' in context.message)) return next()
    if (!context.message.document.file_name.endsWith('.yml')) return next()

    const { localize } = context.state

    const message = await context.reply(localize('import.loading'), {
      parse_mode: 'MarkdownV2',
    })

    const fileUrl = await bot.telegram.getFileLink(
      context.message.document.file_id
    )
    const file = await got(fileUrl)
    const exportedData = yaml.load(file.body)

    const { statuses } = exportedData

    await statusStorage.deleteAllStatuses()

    for (const status of statuses) {
      await statusStorage.createStatus(status)
    }

    await bot.telegram.editMessageText(
      message.chat.id,
      message.message_id,
      undefined,
      localize('import.done', { count: statuses.length }),
      { parse_mode: 'MarkdownV2' }
    )
  }
}
