import got from 'got'
import yaml from 'js-yaml'

const BATCH_IMPORT_COUNT = 200

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

    for (let start = 0; start < statuses.length; start += BATCH_IMPORT_COUNT) {
      const end = Math.min(statuses.length, start + BATCH_IMPORT_COUNT)
      const batch = statuses.slice(start, end)

      await bot.telegram
        .editMessageText(
          message.chat.id,
          message.message_id,
          undefined,
          localize('import.progress', {
            count: start,
            total: statuses.length,
          }),
          { parse_mode: 'MarkdownV2' }
        )
        .catch(() => {})

      await statusStorage.batchCreate(batch)
    }

    await bot.telegram.editMessageText(
      message.chat.id,
      message.message_id,
      undefined,
      localize('import.done', { total: statuses.length }),
      { parse_mode: 'MarkdownV2' }
    )
  }
}
