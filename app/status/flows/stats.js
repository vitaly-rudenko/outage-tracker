import {
  getStartOfTheDay,
  getTomorrowDate,
  getOffsetDate,
} from '../../utils/date.js'
import { formatDailyStats } from '../../formatDailyStats.js'
import { formatWeeklyStats } from '../../formatWeeklyStats.js'
import { gatherDailyStats } from '../../gatherDailyStats.js'
import { gatherWeeklyStats } from '../../gatherWeeklyStats.js'
import { logger } from '../../../logger.js'
import { timezoneOffsetMinutes } from '../../../env.js'

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
    const todayStart = getStartOfTheDay(now, timezoneOffsetMinutes)
    const tomorrowStart = getTomorrowDate(todayStart)

    const latestStatusBefore = await statusStorage.findLatestStatusBefore(todayStart)
    const statuses = await statusStorage.findStatusesBetween({
      startDateIncluding: todayStart,
      endDateExcluding: tomorrowStart,
    })

    const dailyStats = gatherDailyStats({
      dateStart: todayStart,
      dateUntil: now,
      statuses,
      latestStatusBefore,
      maxDurationMs,
    })

    await bot.telegram.editMessageText(
      message.chat.id,
      message.message_id,
      undefined,
      formatDailyStats({
        now,
        timezoneOffsetMinutes,
        dailyStats,
        aggregateHours,
        localize,
      }),
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
    const todayStart = getStartOfTheDay(now, timezoneOffsetMinutes)
    const tomorrowStart = getTomorrowDate(todayStart)
    const startOfTheWeek = getOffsetDate(todayStart, -weeklyDays)

    const statuses = await statusStorage.findStatusesBetween({
      startDateIncluding: startOfTheWeek,
      endDateExcluding: tomorrowStart,
    })

    const latestStatusBefore = await statusStorage.findLatestStatusBefore(
      startOfTheWeek
    )

    const weeklyStats = gatherWeeklyStats({
      dateStart: todayStart,
      dateUntil: now,
      days: weeklyDays,
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
