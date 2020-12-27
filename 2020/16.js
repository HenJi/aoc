const input = require('./16.input.js')
const ArrayOps = require('../utils/arrayOps')

function testNum({ r1: [a1, b1], r2: [a2, b2] }, num) {
  const res = (a1 <= num && num <= b1) || (a2 <= num && num <= b2)
  //console.dir([a1, b1, a2, b2, num, res])
  return res
}

function dayA(src, exp) {
  let [ rules, myTicket, nearby ] = src.split('\n\n')

  rules = rules.split('\n').map(l => {
    const [field, ranges] = l.split(': ')
    const [r1, r2] = ranges.split(' or ').map(r => r.split('-').map(Number))
    return { field, r1, r2 }
  })
  //console.dir(rules)

  const numbers = ArrayOps.flatten(
    nearby.split('\n').slice(1).map(t => t.split(',').map(Number))
  )
  //console.dir(numbers)

  let res = 0
  numbers.forEach(n => {
    //console.dir(`${n} - ${rules.map(r => testNum(r, n))} - ${rules.map(r => testNum(r, n)).indexOf(true) < 0}`)
    if (rules.map(r => testNum(r, n)).indexOf(true) < 0) {
      res += n
    }
  })

  console.log(`Expected ${exp} - Got ${res}`)
}

function dayB(src, exp) {
  let [ rules, myTicket, nearby ] = src.split('\n\n')

  myTicket = myTicket.split('\n')[1].split(',').map(Number)
  rules = rules.split('\n').map(l => {
    const [field, ranges] = l.split(': ')
    const [r1, r2] = ranges.split(' or ').map(r => r.split('-').map(Number))
    return { field, r1, r2 }
  })
  console.dir(rules)

  const nearbyTickets = nearby.split('\n').slice(1).map(t => t.split(',').map(Number))
  const validTickets = nearbyTickets.filter(t => {
    let isValid = true
    t.forEach(n => {
      if (rules.map(r => testNum(r, n)).indexOf(true) < 0) {
        isValid = false
      }
    })
    return isValid
  })
  //console.dir(validTickets)

  let tests = ArrayOps
    .init(validTickets[0].length)
    .map(i => validTickets.map(t => t[i]))
    .map( (values, index) => {
      const validRules = rules
        .filter(r => values.map(v => testNum(r, v)).indexOf(false) < 0)
        .map(r => r.field)
      return { index, validRules }
    })
  //console.dir(tests)

  const validated = {}
  while (tests.length > 0) {
    //console.dir(validated)
    tests.forEach(({ index, validRules }) => {
      if (validRules.length === 1) validated[validRules[0]] = index
    })
    tests = tests
      .filter(t => t.validRules.length > 1)
      .map(({ index, validRules }) => ({ index, validRules: validRules.filter(r => validated[r] === undefined) }))
  }

  let resValues = [
    'departure location', 'departure station', 'departure platform',
    'departure track', 'departure date', 'departure time'
  ].map(k => myTicket[validated[k]])

  console.dir(validated)
  console.dir(resValues)
  let res = ArrayOps.product(resValues)

  console.log(`Expected ${exp} - Got ${res}`)
}

const test = `class: 1-3 or 5-7
row: 6-11 or 33-44
seat: 13-40 or 45-50

your ticket:
7,1,14

nearby tickets:
7,3,47
40,4,50
55,2,20
38,6,12`

console.dir('PART A')
//dayA(test, 71)
//dayA(input, 28873)

const test2 = `class: 0-1 or 4-19
row: 0-5 or 8-19
seat: 0-13 or 16-19

your ticket:
11,12,13

nearby tickets:
3,9,18
15,1,5
5,14,9`

console.dir('PART B')
//dayB(test2)
dayB(input)
