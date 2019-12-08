const input = require('./5.input.js')

const LOGS = false

function polymerize(src) {
  let res = src
  let i = 1
  while (i < res.length) {
    const a = res[i-1]
    const b = res[i]
    if (a !== b && a.toUpperCase() === b.toUpperCase()) {
      res = res.slice(0, i-1) + res.slice(i+1)
    } else {
      i += 1
    }
  }
  return res
}

function day5a(src) {
  LOGS && console.dir(src)
  let prev = src
  let pol = polymerize(src)
  while (prev.length !== pol.length) {
    LOGS && console.dir(pol)
    prev = pol
    pol = polymerize(pol)
  }
  return pol.length
}

function day5b(src) {
  LOGS && console.dir(src)
  const tests = 'abcdefghijlmnopqrstuvwxyz'.split('')
  const results = tests.map( unit => ({ unit, pol: day5a(src.replace(new RegExp(unit, 'gi'), '')) }) )
  console.dir(results)
}

console.dir(day5a(input))
//console.dir(day5a('dabAcCaCBAcCcaDA'))

day5b(input)
//day5b('dabAcCaCBAcCcaDA')
