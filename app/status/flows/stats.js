import { getStartOfTheDay, getTomorrowDate, getOffsetDate } from '../../utils/date.js'

const maxDurationMs = 10 * 60_000
const aggregateHours = 2
const weeklyDays = 7

/**
 * @param {{
 *   bot: import('telegraf').Telegraf,
 *   statusChecker: import('../../status/MiHomeStatusChecker').MiHomeStatusChecker,
 *   statusStorage: import('../../status/StatusPostgresStorage').StatusPostgresStorage,
 * }} dependencies 
 */
export function todayCommand({ bot, statusChecker, statusStorage }) {
  return async (context) => {
    const { localize } = context.state

    const message = await context.reply(localize('fetchingStatus'), {
      parse_mode: 'MarkdownV2',
    })

    await statusStorage.createStatus(await statusChecker.check())

    const today = getStartOfTheDay(new Date())
    const tomorrow = getTomorrowDate(today)
    const latestStatusBefore = await statusStorage.findLatestStatusBefore(today)
    const statuses = await statusStorage.findStatusesBetween({
      startDateIncluding: today,
      endDateExcluding: tomorrow,
    })

    const dailyStats = gatherDailyStats({
      date: today,
      until: true,
      statuses,
      latestStatusBefore,
      maxDurationMs,
    })

    await bot.telegram.editMessageText(
      message.chat.id,
      message.message_id,
      undefined,
      formatDailyStats({ date: today, dailyStats, aggregateHours, localize }),
      { parse_mode: 'MarkdownV2' }
    )
  }
}

/**
 * @param {{
 *   bot: import('telegraf').Telegraf,
 *   statusChecker: import('../MiHomeStatusChecker').MiHomeStatusChecker,
 *   statusStorage: import('../StatusPostgresStorage').StatusPostgresStorage,
 * }} dependencies 
 */
export function weekCommand({ bot, statusChecker, statusStorage }) {
  return async (context) => {
    const { localize } = context.state

    const message = await context.reply(localize('fetchingStatus'), {
      parse_mode: 'MarkdownV2',
    })

    await statusStorage.createStatus(await statusChecker.check())

    const today = getStartOfTheDay(new Date())
    const tomorrow = getTomorrowDate(today)
    const startOfTheWeek = getOffsetDate(today, -weeklyDays)

    const statuses = await statusStorage.findStatusesBetween({
      startDateIncluding: startOfTheWeek,
      endDateExcluding: tomorrow,
    })

    const latestStatusBefore = await statusStorage.findLatestStatusBefore(
      startOfTheWeek
    )

    const weeklyStats = gatherWeeklyStats({
      date: today,
      days: weeklyDays,
      until: true,
      statuses,
      latestStatusBefore,
      maxDurationMs,
    })

    await bot.telegram.editMessageText(
      message.chat.id,
      message.message_id,
      undefined,
      formatWeeklyStats({ weeklyStats, aggregateHours, localize }),
      { parse_mode: 'MarkdownV2' }
    )
  }
}
