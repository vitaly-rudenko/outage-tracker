import {
  getStartOfTheDay,
  getTomorrowDate,
  getOffsetDate,
} from '../../utils/date.js'
import { formatDailyStats } from '../../formatDailyStats.js'
import { formatWeeklyStats } from '../../formatWeeklyStats.js'
import { gatherDailyStats } from '../../gatherDailyStats.js'
import { gatherWeeklyStats } from '../../gatherWeeklyStats.js'
import { timezoneOffsetMinutes } from '../../../env.js'

const maxDurationMs = 10 * 60_000
const aggregateHours = 1
const weeklyDays = 7

/**
 * @param {{
 *   bot: import('telegraf').Telegraf,
 *   statusStorage: import('../StatusPostgresStorage').StatusPostgresStorage,
 * }} dependencies
 */
export function todayCommand({ bot, statusStorage }) {
  return async (context) => {
    const { localize } = context.state

    const message = await context.reply(localize('fetchingStatus'), {
      parse_mode: 'MarkdownV2',
    })

    try {
      const now = new Date()
      const todayStart = getStartOfTheDay(now, timezoneOffsetMinutes)
      const tomorrowStart = getTomorrowDate(todayStart)

      const latestStatusBefore = await statusStorage.findLatestStatusBefore(
        todayStart
      )
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
    } catch (error) {
      bot.telegram
        .editMessageText(
          message.chat.id,
          message.message_id,
          undefined,
          localize('unknownError'),
          { parse_mode: 'MarkdownV2' }
        )
        .catch(() => {})

      throw error
    }
  }
}

/**
 * @param {{
 *   bot: import('telegraf').Telegraf,
 *   statusStorage: import('../StatusPostgresStorage').StatusPostgresStorage,
 * }} dependencies
 */
export function weekCommand({ bot, statusStorage }) {
  return async (context) => {
    const { localize } = context.state

    const message = await context.reply(localize('fetchingStatus'), {
      parse_mode: 'MarkdownV2',
    })

    try {
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
    } catch (error) {
      bot.telegram
        .editMessageText(
          message.chat.id,
          message.message_id,
          undefined,
          localize('unknownError'),
          { parse_mode: 'MarkdownV2' }
        )
        .catch(() => {})

      throw error
    }
  }
}
