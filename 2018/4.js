const input = require('./4.input.js')
const ArrayOps = require('../utils/arrayOps')

const LOGS = false

function readMinutes(line) {
  return +line.split(':')[1].split(']')[0]
}

function readLogs(logs, res, cur) {
  const line = logs[0]
  if (line === undefined) {
    return res.concat(cur)
  }
  if (line.indexOf('Guard') >= 0) {
    // Line is 'Guard #NNN begins'
    const id = +line.split('Guard #')[1].split(' ')[0]
    const newRes = cur === undefined ? res : res.concat(cur)
    return readLogs(logs.slice(1), newRes, { id, ranges: [] })
  } else if (line.indexOf('falls asleep') >= 0) {
    const asleep = readMinutes(line)
    return readLogs(logs.slice(1), res, { ...cur, asleep })
  } else if (line.indexOf('wakes up') >= 0) {
    const asleep = cur.asleep
    const awake = readMinutes(line)
    const ranges = cur.ranges.concat({ asleep, awake })
    return readLogs(logs.slice(1), res, { id: cur.id, ranges })
  } else {
    console.dir('Unregcognized line: '+line)
    return readLogs(logs.slice(1), res, cur)
  }
}

function day4a(src) {
  const logs = readLogs(src.split('\n').sort(), [], undefined)
  const totalSleepTimes = logs.reduce((acc, log) => {
    const curSleepTime = acc[log.id] || 0
    const addedSleep = log.ranges.reduce((t, r) => t + r.awake - r.asleep, 0)
    acc[log.id] = curSleepTime + addedSleep
    return acc
  }, {})
  const sorted = Object.entries(totalSleepTimes).sort((a,b) => b[1] - a[1])
  const biggestSleeper = +(sorted[0][0])

  LOGS && console.dir('Biggest sleeper is '+biggestSleeper)
  const biggerSleeperLogs = logs.filter(l => l.id === biggestSleeper)

  if (LOGS) {
    console.dir(biggerSleeperLogs.map(l => ({ ...l, ranges: l.ranges.map(r => `${r.asleep}:${r.awake}`) })))
  }

  const minuteStats = {}
  biggerSleeperLogs.forEach(  log =>
    log.ranges.forEach( r => {
      for (let i = r.asleep; i < r.awake; i++) {
        minuteStats[i] = (minuteStats[i] || 0) + 1
      }
    })
  )
  LOGS && console.dir(minuteStats)

  const sortedMinutes = Object.entries(minuteStats).sort((a,b) => b[1] - a[1])
  const mostSleptMinute = sortedMinutes[0][0]
  LOGS && console.dir('Most slept minute: '+mostSleptMinute)
  console.dir(biggestSleeper * mostSleptMinute)
}

function day4b(src) {
  const logs = readLogs(src.split('\n').sort(), [], undefined)

  const guardMinuteStats = {}
  logs.forEach(log => {
    if (guardMinuteStats[log.id] === undefined) {
      guardMinuteStats[log.id] = {}
    }

    log.ranges.forEach(r => {
      for (let i = r.asleep; i < r.awake; i++) {
        guardMinuteStats[log.id][i] = (guardMinuteStats[log.id][i] || 0) + 1
      }
    })
  }, {})

  Object.keys(guardMinuteStats).forEach( id => {
    const sortedMinutes = Object.entries(guardMinuteStats[id]).sort((a,b) => b[1] - a[1])
    if (sortedMinutes.length > 0) {
      const mostSleptMinute = +sortedMinutes[0][0]
      const mostSleptTimes = sortedMinutes[0][1]
      guardMinuteStats[id] = { id: +id, mostSleptMinute, mostSleptTimes }
    }
  })

  const sortedGuards = Object.values(guardMinuteStats).sort((a, b) => b.mostSleptTimes - a.mostSleptTimes)
  const picked = sortedGuards[0]
  console.dir(picked.id * picked.mostSleptMinute)
}

day4a(input)
day4b(input)

const testInput = `[1518-11-01 00:00] Guard #10 begins shift
[1518-11-01 00:05] falls asleep
[1518-11-01 00:25] wakes up
[1518-11-01 00:30] falls asleep
[1518-11-01 00:55] wakes up
[1518-11-01 23:58] Guard #99 begins shift
[1518-11-02 00:40] falls asleep
[1518-11-02 00:50] wakes up
[1518-11-03 00:05] Guard #10 begins shift
[1518-11-03 00:24] falls asleep
[1518-11-03 00:29] wakes up
[1518-11-04 00:02] Guard #99 begins shift
[1518-11-04 00:36] falls asleep
[1518-11-04 00:46] wakes up
[1518-11-05 00:03] Guard #99 begins shift
[1518-11-05 00:45] falls asleep
[1518-11-05 00:55] wakes up`

//day4a(testInput)
//day4b(testInput)
