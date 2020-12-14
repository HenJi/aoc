const input = require('./2.input.js')
const StrOps = require('../utils/stringOps')

function testPasswordA(dbLine) {
  const [policy, letterDb, password] = dbLine.split(' ')
  const [min, max] = policy.split('-').map(Number)
  const letter = letterDb[0]
  const occ = StrOps.occurrences(password, letter)
  return occ >= min && occ <= max
}

function day2a(src) {
  const data = src.split('\n')
  const len = data.length
  console.log(data.filter(testPasswordA).length)
}


function testPasswordB(dbLine) {
  const [policy, letterDb, password] = dbLine.split(' ')
  const [a, b] = policy.split('-').map(Number)
  const letter = letterDb[0]
  const tA = password[a-1] === letter
  const tB = password[b-1] === letter
  return (tA && !tB) || (!tA && tB)
}

function day2b(src) {
  const data = src.split('\n')
  const len = data.length
  console.log(data.filter(testPasswordB).length)
}

const test = `1-3 a: abcde
1-3 b: cdefg
2-9 c: ccccccccc`

//day2a(test)
day2a(input)

//day2b(test)
day2b(input)
