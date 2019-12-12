const input = require('./12.input.js')
const LOGS = false

const testInput = {
  init: '#..#.#..##......###...###',
  rules: `...## => #
..#.. => #
.#... => #
.#.#. => #
.#.## => #
.##.. => #
.#### => #
#.#.# => #
#.### => #
##.#. => #
##.## => #
###.. => #
###.# => #
####. => #`,
}

function day12a(src, gens, exp) {
  let ruleMap = {}
  src.rules.split('\n').forEach( l => {
    const [conf, res] = l.split(' => ')
    if (res === '#') {
      ruleMap[conf] = res
    }
  })

  let state = src.init
  let dx = 0

  let i = 0
  while (i < gens) {
    LOGS && console.dir(i+' '+dx+' '+state)
    let testState = '....' + state + '.....'
    state = ''
    for (let i = 2; i < testState.length-2; i++) {
      state += ruleMap[testState.slice(i-2, i+3)] || '.'
    }
    const realStart = state.indexOf('#')
    dx = dx - 2 + realStart
    state = state.slice(realStart, state.lastIndexOf('#')+1)
    i++
  }

  LOGS && console.dir(i+' '+dx+' '+state)
  const res = state.split('').reduce((acc, t, i) => t === '#' ? acc + i + dx : acc, 0)
  console.dir(res)
  exp && console.dir(exp)
}

function day12b(src, gens, exp, delta = 0) {
  let ruleMap = {}
  src.rules.split('\n').forEach( l => {
    const [conf, res] = l.split(' => ')
    if (res === '#') {
      ruleMap[conf] = res
    }
  })

  let state = src.init
  let dx = delta
  let met = {}

  let i = 0
  while (i < gens && met[state] === undefined) {
    if (delta === 0) met[state] = { idx: i, dx }
    LOGS && console.dir(i+' '+dx+' '+state)
    let testState = '....' + state + '.....'
    state = ''
    for (let i = 2; i < testState.length-2; i++) {
      state += ruleMap[testState.slice(i-2, i+3)] || '.'
    }
    const realStart = state.indexOf('#')
    dx = dx - 2 + realStart
    state = state.slice(realStart, state.lastIndexOf('#')+1)
    i++
  }

  // We have reached a loop after i generations of reached gens
  if (i >= gens) {
    LOGS && console.dir(i+' '+dx+' '+state)
    const res = state.split('').reduce((acc, t, i) => t === '#' ? acc + i + dx : acc, 0)
    console.dir(res)
    exp && console.dir(exp)
  } else {
    const stepsToRepro = i - met[state].idx
    const dxDuringLoop = dx - met[state].dx
    const nextGens = (gens - met[state].idx) % stepsToRepro
    const nextDx = met[state].dx + dxDuringLoop*(Math.floor((gens - met[state].idx) / stepsToRepro))
    day12b({ init: state, rules: src.rules }, nextGens, exp, nextDx)
  }
}

day12a(input, 20, 2909)
// day12a(testInput, 20, 325)

//day12a(input, 500, 26175)
//day12b(input, 500, 26175)
day12b(input, 50000000000)
