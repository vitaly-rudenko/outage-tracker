import { getStartOfTheDay, getTomorrowDate, getOffsetDate } from '../../utils/date.js'
import { formatDailyStats } from '../../formatDailyStats.js'
import { formatWeeklyStats } from '../../formatWeeklyStats.js'
import { gatherDailyStats } from '../../gatherDailyStats.js'
import { gatherWeeklyStats } from '../../gatherWeeklyStats.js'
import { logger } from '../../../logger.js'

const maxDurationMs = 10 * 60_000
const aggregateHours = 2
const weeklyDays = 7

/**
 * @param {{
 *   bot: import('telegraf').Telegraf,
 *   statusCheckUseCase: import('../StatusCheckUseCase').StatusCheckUseCase,
 *   statusStorage: import('../StatusPostgresStorage').StatusPostgresStorage,
* }} dependencies 
 */
export function todayCommand({ bot, statusCheckUseCase, statusStorage }) {
  return async (context) => {
    const { localize } = context.state

    const message = await context.reply(localize('fetchingStatus'), {
      parse_mode: 'MarkdownV2',
    })

    try {
      await statusCheckUseCase.run({ retryIfOffline: false })
    } catch (error) {
      logger.error(error, 'Could not run status check use case')
    }

    const now = new Date()
    const today = getStartOfTheDay(now)
    const tomorrow = getTomorrowDate(today)
    const latestStatusBefore = await statusStorage.findLatestStatusBefore(today)
    const statuses = await statusStorage.findStatusesBetween({
      startDateIncluding: today,
      endDateExcluding: tomorrow,
    })

    const dailyStats = gatherDailyStats({
      date: now,
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
 *   statusCheckUseCase: import('../StatusCheckUseCase').StatusCheckUseCase,
 *   statusStorage: import('../StatusPostgresStorage').StatusPostgresStorage,
 * }} dependencies 
 */
export function weekCommand({ bot, statusCheckUseCase, statusStorage }) {
  return async (context) => {
    const { localize } = context.state

    const message = await context.reply(localize('fetchingStatus'), {
      parse_mode: 'MarkdownV2',
    })

    try {
      await statusCheckUseCase.run({ retryIfOffline: false })
    } catch (error) {
      logger.error(error, 'Could not run status check use case')
    }

    const now = new Date()
    const today = getStartOfTheDay(now)
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
      date: now,
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
