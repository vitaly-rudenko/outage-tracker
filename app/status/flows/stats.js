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
import { getRecords } from '../../getRecords.js'

const maxDurationMs = 10 * 60_000
const aggregateHours = 1
const weeklyDays = 7

export function yesterdayCommand({ bot, statusStorage }) {
  return createDailyHandler({
    date: new Date(Date.now() - 24 * 60 * 60_000),
    bot,
    statusStorage,
  })
}

export function todayCommand({ bot, statusStorage }) {
  return createDailyHandler({ date: new Date(), bot, statusStorage })
}

/**
 * @param {{
 *   date: Date,
 *   bot: import('telegraf').Telegraf,
 *   statusStorage: import('../StatusPostgresStorage').StatusPostgresStorage,
 * }} dependencies
 */
export function createDailyHandler({ date, bot, statusStorage }) {
  return async (context) => {
    const { localize } = context.state

    const message = await context.reply(localize('fetchingStatus'), {
      parse_mode: 'MarkdownV2',
    })

    try {
      const now = date
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

      const records = getRecords({ latestStatusBefore, statuses, dateUntil: now })

      await bot.telegram.editMessageText(
        message.chat.id,
        message.message_id,
        undefined,
        formatDailyStats({
          now,
          timezoneOffsetMinutes,
          dailyStats,
          records,
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

      const records = getRecords({ latestStatusBefore, statuses, dateUntil: now })

      await bot.telegram.editMessageText(
        message.chat.id,
        message.message_id,
        undefined,
        formatWeeklyStats({ weeklyStats, records, aggregateHours, localize }),
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
