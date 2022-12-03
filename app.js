import { formatDailyStats } from './app/formatDailyStats.js'
import { formatTime } from './app/formatTime.js'
import { gatherDailyStats } from './app/gatherDailyStats.js'
import { MiHomeStatusChecker } from './app/MiHomeStatusChecker.js'
import { Status } from './app/Status.js'
import { country, password, username } from './env.js'

async function start() {
  const statusChecker = new MiHomeStatusChecker({
    country,
    password,
    username,
  })

  // await statusChecker.init()

  // console.log(await statusChecker.check({ userId: 'fake-user-id' }))

  function createStatus(isOnline, time) {
    return new Status({
      raw: {},
      userId: '',
      isOnline,
      createdAt: new Date(`2020-01-01 ${time}`)
    })
  }

  const latestStatus = createStatus(true, '13:50')
  const currentStatus = createStatus(false, '15:30')

  const durationMs = currentStatus.createdAt.getTime() - latestStatus.createdAt.getTime()

  if (latestStatus.isOnline && !currentStatus.isOnline) {
    console.log(`❌ Your home is now offline after ${formatTime(durationMs)} hours of being online`)
  }

  if (!latestStatus.isOnline && currentStatus.isOnline) {
    console.log(`✅ Your home is now online after ${formatTime(durationMs)} hours of being offline`)
  }

  // IMPORTANT: assume that there are NO repeating statuses (true is always followed by false and vice versa)
  const dailyStatuses = [
    createStatus(true, '0:05'),
    createStatus(false, '4:40'),
    createStatus(true, '15:05'),
    createStatus(false, '17:20'),
    createStatus(true, '17:55'),
    createStatus(false, '22:05'),
  ]

  const date = new Date('2020-01-01 12:00')
  const { perHour, totalOnlineMs } = gatherDailyStats(date, dailyStatuses, createStatus(false, '23:00'))

  console.log(perHour.map(({ hour, onlineMs }) => `${hour}:00 – ${Math.floor(onlineMs / 60_000)} minutes`).join('\n'))
  console.log('Total online for', formatTime(totalOnlineMs), 'hours')

  console.log(formatDailyStats(date, { perHour, totalOnlineMs }))
}

start()
  .then(() => console.log('Started!'))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
