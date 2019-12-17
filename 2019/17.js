const input = require('./17.input.js')
const programList = input.split(',').map(x => +x)

const ArrayOps = require('../utils/arrayOps')
const GridOps = require('../utils/gridOps')
const intCode = require('./intCode')

const LOGS = false

function day17a(exp) {
  let params = {
    id: 0,
    program: programList.reduce((acc, inst, i) => ({ ...acc, [i]: inst}), {}),
    base: 0,
    cursor: 0,
    inputs: [],
    outputs: [],
    running: true,
  }

  while (params.running) {
    params = intCode({ ...params, inputs: [], outputs: [] })
  }
  const outGrid = params.outputs.map( c => String.fromCharCode(c) )
  console.log(outGrid.join(''))

  let grid = {}
  outGrid.join('').split('\n').forEach( (line, y) => {
    grid[y] = {}; line.split('').forEach((c, x) => grid[y][x] = c)
  })
  let coords = GridOps.toList(grid).map(p => ({ ...p, x: p.y, y: p.x }))

  const deltas = [[1,0], [0,-1], [0,1], [-1,0]]
  function isScaffold({x, y}){ return grid[y] !== undefined && grid[y][x] === '#' }

  let intersections = coords.filter( ({x, y, data}) =>
    data === '#' && deltas.map(([dx, dy]) => isScaffold({ x:x+dx, y:y+dy })).indexOf(false) < 0
  )
  console.dir(intersections)
  console.dir(intersections.reduce((acc, p) => acc+(p.x*p.y), 0))
  exp && console.dir(exp)
}

const dirs = ['^', '>', 'v', '<']
const rights = { '^': '>', '>': 'v', 'v': '<', '<': '^' }
const lefts = { '^': '<', '>': '^', 'v': '>', '<': 'v' }
const dirDelta = {
  '<': { x: -1, y: 0 },
  '>': { x: 1, y: 0 },
  '^': { x: 0, y: -1 },
  'v': { x: 0, y: 1 },
}

function day17b(exp) {
  let params = {
    id: 0,
    program: programList.reduce((acc, inst, i) => ({ ...acc, [i]: inst}), {}),
    base: 0,
    cursor: 0,
    inputs: [],
    outputs: [],
    running: true,
  }

  while (params.running) {
    params = intCode({ ...params, inputs: [], outputs: [] })
  }
  const outGrid = params.outputs.map( c => String.fromCharCode(c) )
  console.log(outGrid.join(''))

  let grid = {}
  outGrid.join('').split('\n').forEach( (line, y) => {
    grid[y] = {}; line.split('').forEach((c, x) => grid[y][x] = c)
  })
  let coords = GridOps.toList(grid).map(p => ({ ...p, x: p.y, y: p.x }))

  const deltas = [[1,0], [0,-1], [0,1], [-1,0]]
  function isScaffold({x, y}){ return grid[y] !== undefined && grid[y][x] === '#' }

  let bot = coords.find(p => dirs.indexOf(p.data) >= 0)
  console.dir(bot)

  let canContinue = true
  let instructions = []
  while (canContinue) {
    let nextDir = [lefts[bot.data], rights[bot.data]].find( dir => {
      const d = dirDelta[dir]
      return isScaffold({ x: bot.x+d.x, y: bot.y+d.y })
    })
    if (nextDir === undefined) {
      canContinue = false
    } else {
      instructions.push( nextDir === rights[bot.data] ? 'R' : 'L' )
      bot.data = nextDir
      const d = dirDelta[bot.data]
      let steps = 0
      while (isScaffold({ x: bot.x+d.x, y: bot.y+d.y })) {
        steps++
        bot.x += d.x
        bot.y += d.y
      }
      instructions.push(steps)
    }
  }
  const A = 'L,6,R,8,R,12,L,6,L,8'
  const B = 'L,10,L,8,R,12'
  const C = 'L,8,L,10,L,6,L,6'
  const mainRoutine = instructions.join(',')
    .replace(new RegExp(A, 'g'), 'A')
    .replace(new RegExp(B, 'g'), 'B')
    .replace(new RegExp(C, 'g'), 'C')
  console.dir(instructions.join(','))
  console.dir({ mainRoutine, A, B, C })

  const inputs = [
    mainRoutine,
    A,
    B,
    C,
    'y\n'
  ].join('\n').split('').map(c => c.charCodeAt(0))

  let altProgram = [ 2, ...programList.slice(1) ]
  params = {
    id: 0,
    program: altProgram.reduce((acc, inst, i) => ({ ...acc, [i]: inst}), {}),
    base: 0,
    cursor: 0,
    inputs,
    outputs: [],
    running: true,
  }

  process.stdout.cursorTo(0,0)
  process.stdout.clearLine()

  let buffer = ''
  let cut = 44
  while (params.running && !params.waitingInput) {
    params = intCode({ ...params, outputs: [] }, true)

    buffer += params.outputs.map( c => String.fromCharCode(c) ).join('')

    if (buffer.split('\n').length >= cut+1) {
      const tmp = buffer.split('\n')
      process.stdout.cursorTo(0,0)
      process.stdout.write(tmp.slice(0,cut).join('\n'))
      buffer = tmp.slice(cut).join('\n')
      cut = 38
    }
  }
  process.stdout.write(' - \n')
  process.stdout.clearLine()
  process.stdout.write('GOT: '+params.outputs.slice(-1)[0])
  process.stdout.write('\n')
  process.stdout.clearLine()
  exp && process.stdout.write('EXP: '+exp)
}

//day17a(7780)
day17b(1075882)
