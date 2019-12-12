const input = require('./11.input.js')
const GridOps = require('../utils/gridOps')
const intCode = require('./intCode')

const LOGS = false

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

function day11(initial, src) {
  const programList = src.split(',').map(x => +x)
  let params = {
    id: 0,
    program: programList.reduce((acc, inst, i) => ({ ...acc, [i]: inst}), {}),
    base: 0,
    cursor: 0,
    inputs: [initial],
    outputs: [],
    running: true,
  }

  let painted = new Set()
  let grid = { 0: {} }
  let pos = { x: 0, y: 0 }
  let dir = 'U'
  while (params.running) {
    params = intCode(params)

    const [ color, rotation ] = params.outputs
    painted.add(`${pos.x}:${pos.y}`)
    LOGS && console.dir(`${pos.x}:${pos.y} [${res.outputs[0]},${res.outputs[1]}]`)
    grid[pos.x][pos.y] = color
    dir = dirNext[dir][rotation]
    const dp = dirDeltas[dir]
    pos = { x: pos.x + dp.x, y: pos.y + dp.y }
    if (!grid[pos.x]) grid[pos.x] = {}

    params.inputs = [ grid[pos.x][pos.y] || 0 ]
    params.outputs = []
  }

  console.log(GridOps.draw(GridOps.toList(grid), { 0: ' ', 1: 'o' }))
  console.dir(painted.size)
}

day11(0, input)
day11(1, input)
