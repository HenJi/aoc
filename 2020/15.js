const input = require('./15.input.js')
const ArrayOps = require('../utils/arrayOps')

function dayA(src, exp) {
  let init = src.split(',').map(Number)
  let turns = {}
  init.slice(0,-1).forEach( (n, i) => {
    //console.dir(n)
    turns[n] = i
  })

  let turn = init.length-1
  let next = init[init.length-1]

  let target = 2020
  while (turn < target-1) {
    console.dir(next)
    if (turns[next] === undefined) {
      turns[next] = turn
      next = 0
    } else {
      let nextNext = turn - turns[next]
      turns[next] = turn
      next = nextNext
    }
    turn++
  }

  let res = next

  console.log(`Expected ${exp} - Got ${res}`)
}

function dayB(src, exp) {
  const init = src.split(',').map(Number)
  let turns = new Map()
  init.slice(0,-1).forEach( (n, i) => {
    turns.set(n, i)
  })

  let turn = init.length-1
  let next = init[init.length-1]

  const target = 30000000
  while (turn < target-1) {
    if (turn % 1000000 === 0) {
      console.dir(turn)
    }
    if (turns.get(next) === undefined) {
      turns.set(next, turn)
      next = 0
    } else {
      let nextNext = turn - turns.get(next)
      turns.set(next, turn)
      next = nextNext
    }
    turn++
  }

  const res = next

  console.log(`Expected ${exp} - Got ${res}`)
}

const test = `0,3,6`

console.dir('PART A')
//dayA(test, 436)
//dayA(input)

console.dir('PART B')
//dayB(test, 175594)
dayB(input, 59006)
