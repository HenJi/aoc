const input = require('./11.input.js')
const ArrayOps = require('../utils/arrayOps')

const LOGS = false

const opCodeNames = {
  99: 'End',
  1: 'Add',
  2: 'Mult',
  3: 'Input',
  4: 'Output',
  5: 'Jump if not zero',
  6: 'Jump if zero',
  7: 'Inf',
  8: 'Equal',
  9: 'Set base'
}

function intCode(id, program, base, cursor, inputs, outputs, resetLoop) {
  function readArg(mode, offset) {
    const baseArg = +program[cursor+offset]
    if (mode === 0) {
      // address mode
      return +program[baseArg] || 0
    } else if (mode === 1) {
      // Immediate mode
      return baseArg
    } else if (mode === 2) {
      // Relative mode
      return +program[base+baseArg] || 0
    }
  }

  if (LOGS && cursor === 0 && false) {
    console.dir(id+' Start instance')
    console.dir(program.join(",")+ '::' + inputs.join(','))
  }
  if (program[cursor] === undefined) {
    console.dir(id+' No more instruction')
    return { program, cursor, outputs, running: false }
  }

  const fullOp = ("0000"+program[cursor]).slice(-5)
  const modeA3 = +(fullOp[0])
  if (modeA3 === 1) {
    console.dir(id+' Something is wrong')
  }

  const modeA2 = +(fullOp[1])
  const modeA1 = +(fullOp[2])
  const opCode = +(fullOp.slice(-2))
  LOGS && console.dir(fullOp+' '+opCodeNames[opCode])

  if (opCode === 99) {
    LOGS && console.dir(id+' End program')
    return { program, base, cursor, inputs, outputs, running: false }
  } else if (opCode === 1 || opCode === 2 || opCode === 7 || opCode === 8) {
    let arg1 = readArg(modeA1, 1)
    let arg2 = readArg(modeA2, 2)
    let dest = +program[cursor+3]
    if (modeA3 === 2) { dest = base + dest }
    program[dest] =
      opCode === 1 ? arg1 + arg2
      : opCode === 2 ? arg1 * arg2
      : opCode === 7 && arg1 < arg2 ? 1
      : opCode === 8 && arg1 === arg2 ? 1
      : 0
    LOGS && console.dir(opCode + ' '+ arg1 + ' ' + arg2 + ' => ' + program[dest] + ' (' + dest + ')')
    return intCode(id, program, base, cursor + 4, inputs, outputs)
  } else if (opCode === 3 || opCode === 4) {
    //let arg1 = program[cursor+1]
    if (opCode === 3) {
      let arg1 = program[cursor+1]
      if (modeA1 === 2) { arg1 = base + arg1 }
      const input = inputs[0]
      if (input === undefined) {
        LOGS && console.dir(id+' Waiting for input')
        return { program, base, cursor, inputs, outputs, running: true }
      } else {
        LOGS && console.dir(id+' Input: '+input)
        program[arg1] = input
        return intCode(id, program, base, cursor + 2, inputs.slice(1), outputs)
      }
    } else {
      let arg1 = readArg(modeA1, 1)
      LOGS && console.dir(id+' Output: '+arg1)
      //return arg1
      return intCode(id, program, base, cursor + 2, inputs.slice(1), [...outputs, arg1])
    }
  } else if (opCode === 5 || opCode === 6) {
    let arg1 = readArg(modeA1, 1)
    let arg2 = readArg(modeA2, 2)
    //console.dir(opCode + ' ' + arg1 + ' ' + arg2)
    if ((opCode === 5 && arg1 !== 0) || (opCode === 6 && arg1 === 0)) {
      return intCode(id, program, base, arg2, inputs, outputs)
    } else {
      return intCode(id, program, base, cursor+3, inputs, outputs)
    }
  } else if (opCode === 9) {
    let arg1 = readArg(modeA1, 1)
    return intCode(id, program, base+arg1, cursor+2, inputs, outputs)
  } else {
    console.dir(id+' Unknown op: '+opCode)
    console.dir(program[cursor])
    return { program, base, cursor, inputs, outputs, running: false }
  }
}

const dirDeltas = {
  U: { x: 0, y: -1 },
  D: { x: 0, y: 1 },
  L: { x: -1, y: 0 },
  R: { x: 1, y: 0 },
}
const dirNext = {
  U: ['L', 'R'],
  D: ['R', 'L'],
  L: ['D', 'U'],
  R: ['U', 'D'],
}

function day11a(src) {
  const programList = src.split(',').map(x => +x)
  let program = programList.reduce((acc, inst, i) => ({ ...acc, [i]: inst}), {})
  let inputs = [0]
  let outputs = []
  let base = 0
  let cursor = 0
  let running = true
  let res = {}

  let painted = new Set()
  let grid = { 0: {} }
  let pos = { x: 0, y: 0 }
  let dir = 'U'
  while (running) {
    res = intCode(0, program, base, cursor, inputs, outputs)

    const [ color, rotation ] = res.outputs
    painted.add(`${pos.x}:${pos.y}`)
    // console.dir(`${pos.x}:${pos.y} [${res.outputs[0]},${res.outputs[1]}]`)
    grid[pos.x][pos.y] = color
    dir = dirNext[dir][rotation]
    const dp = dirDeltas[dir]
    pos = { x: pos.x + dp.x, y: pos.y + dp.y }
    if (!grid[pos.x]) grid[pos.x] = {}

    program = res.program
    base = res.base
    cursor = res.cursor
    inputs = [ grid[pos.x][pos.y] || 0 ]
    outputs = []
    running = res.running
  }
  //console.dir(painted)
  console.dir(painted.size)
}

function day11b(src) {
  const programList = src.split(',').map(x => +x)
  let program = programList.reduce((acc, inst, i) => ({ ...acc, [i]: inst}), {})
  let inputs = [1]
  let outputs = []
  let base = 0
  let cursor = 0
  let running = true
  let res = {}

  let painted = new Set()
  let grid = { 0: {} }
  let pos = { x: 0, y: 0 }
  let dir = 'U'
  while (running) {
    res = intCode(0, program, base, cursor, inputs, outputs)

    const [ color, rotation ] = res.outputs
    painted.add(`${pos.x}:${pos.y}`)
    // console.dir(`${pos.x}:${pos.y} [${res.outputs[0]},${res.outputs[1]}]`)
    grid[pos.x][pos.y] = color
    dir = dirNext[dir][rotation]
    const dp = dirDeltas[dir]
    pos = { x: pos.x + dp.x, y: pos.y + dp.y }
    if (!grid[pos.x]) grid[pos.x] = {}

    program = res.program
    base = res.base
    cursor = res.cursor
    inputs = [ grid[pos.x][pos.y] || 0 ]
    outputs = []
    running = res.running
  }
  let coords = ArrayOps.flatten(Object.keys(grid).map(x => {
    const line = grid[x]
    return Object.keys(line).map(y => ({ x:+x, y:+y, color: line[y] }))
  }))
  let xs = coords.map(c => c.x)
  let ys = coords.map(c => c.y)
  let minX = Math.min(...xs)
  let minY = Math.min(...ys)
  let maxX = Math.max(...xs)+1
  let maxY = Math.max(...ys)+1

  let panel = ArrayOps.init(maxY - minY).map(_ => ArrayOps.init(maxX - minX).map(_ => ' '))
  coords.forEach(({x, y, color}) => {
    if (color === 1) {
      panel[y-minY][x-minX] = 'o'
    }
  })
  console.log(panel.map(l => l.join('')).join('\n'))
}

day11a(input)
day11b(input)
