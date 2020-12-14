const input = require('./13.input.js')
const ArrayOps = require('../utils/arrayOps')

function dayA(src, exp) {
  let [arrival, busData] = src.split('\n')
  arrival = +arrival
  const busses = busData.split(',').filter(x => x !== 'x').map(Number)

  const nextBusses = busses.map(b => ({
    bus: b,
    time: Math.ceil(arrival / b)*b,
  }))
  let resTime = Math.min(...nextBusses.map(b => b.time))
  let resBus = nextBusses.find(b => b.time == resTime)
  let waiting = resBus.time - arrival
  let res = waiting * resBus.bus

  console.log(`Expected ${exp} - Got ${res}`)
}

function isMultiple(a, b) {
  return a % b == 0
}

function findNextValidSpot(base, dOffset, busses) {
  let res = base
  let success = false
  while (!success) {
    res += dOffset
    success = true

    busses.forEach(({ id, offset}) => {
      if (!success || !isMultiple((res + offset), id)) {
        success = false
      }
    })
  }
  return res
}

function dayB(src, exp) {
  const busData = src.split('\n')[1]
  let busses = []
  busData.split(',').forEach((d, offset) => {
    if (d !== 'x') {
      busses.push({ id: +d, offset })
    }
  })
  console.dir(busses)

  let res = 0
  let offset = busses[0].id

  for (let i = 2; i < busses.length; i++) {
    const firstMatch = findNextValidSpot(res, offset, busses.slice(0, i))
    const secondMatch = findNextValidSpot(firstMatch, offset, busses.slice(0, i))
    console.log(firstMatch, secondMatch)
    offset = secondMatch - firstMatch
    res = firstMatch
  }

  res = findNextValidSpot(res, offset, busses)
  console.log(`Expected ${exp} - Got ${res}`)
}

const test = `939
7,13,x,x,59,x,31,19`

console.dir('PART A')
//dayA(test, 295)
//dayA(input)

console.dir('PART B')
dayB(test, 1068781)
dayB(input, 741745043105674)
