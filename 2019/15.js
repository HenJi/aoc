const input = require('./15.input.js')
const programList = input.split(',').map(x => +x)

const ArrayOps = require('../utils/arrayOps')
const GridOps = require('../utils/gridOps')
const intCode = require('./intCode')

const LOGS = false

const commands = {
  1: { x:0,  y:1 }, // North
  2: { x:0,  y:-1 }, // South
  3: { x:-1, y:0 }, // West
  4: { x:1,  y:0 }, // East
}

let grid = { 0: { 0: ' ' } } // X -> Y -> ' ' | '#' | 'O'

// clockwise
const nextDir = { 1: 4, 4: 2, 2: 3, 3: 1 }
// counter clockwise
const prevDir = { 1: 3, 4: 1, 2: 4, 3: 2 }

function rightWallBot() {
  // A bot that follows it right hand wall
  let params = {
    id: 0,
    program: programList.reduce((acc, inst, i) => ({ ...acc, [i]: inst}), {}),
    base: 0,
    cursor: 0,
    inputs: [],
    outputs: [],
    running: true,
  }
  let i = 0
  let x = 0
  let y = 0
  let direction = 1

  while (params.running) {
    i++
    params = intCode({ ...params, inputs: [direction], outputs: [] })
    const status = params.outputs[0]

    const nx = x + commands[direction].x
    const ny = y + commands[direction].y
    if (grid[nx] === undefined) { grid[nx] = {} }
    if (status === 0) {
      // Wall
      grid[nx][ny] = '#'
      direction = nextDir[direction]
    } else if (status === 1) {
      // Move success
      grid[nx][ny] = '.'
      x = nx
      y = ny
      direction = prevDir[direction]
    } else if (status === 2) {
      // Oxygen tank found
      grid[nx][ny] = 'O'
      x = nx
      y = ny
      params.running = false
    }
  }
  LOGS && console.dir(`right wall bot stopped after ${i} iterations`)
  return { x, y }
}

function leftWallBot() {
  // A bot that follows it right hand wall
  let params = {
    id: 0,
    program: programList.reduce((acc, inst, i) => ({ ...acc, [i]: inst}), {}),
    base: 0,
    cursor: 0,
    inputs: [],
    outputs: [],
    running: true,
  }
  let i = 0
  let x = 0
  let y = 0
  let direction = 1

  while (params.running) {
    i++
    params = intCode({ ...params, inputs: [direction], outputs: [] })
    const status = params.outputs[0]

    const nx = x + commands[direction].x
    const ny = y + commands[direction].y
    if (grid[nx] === undefined) { grid[nx] = {} }
    if (status === 0) {
      // Wall
      grid[nx][ny] = '#'
      direction = prevDir[direction]
    } else if (status === 1) {
      // Move success
      grid[nx][ny] = '.'
      x = nx
      y = ny
      direction = nextDir[direction]
    } else if (status === 2) {
      // Oxygen tank found
      grid[nx][ny] = 'O'
      x = nx
      y = ny
      params.running = false
    }
  }
  LOGS && console.dir(`left wall bot stopped after ${i} iterations`)
  return { x, y }
}

function day15a(exp) {
  const resR = rightWallBot()
  const resL = leftWallBot()
  const { x, y } = resR

  const drawData = GridOps.toList(grid).concat(
    [{ x, y, data: 'D' }, { x: 0, y: 0, data: 'X' }],
  )
  console.log(GridOps.draw(drawData))

  function isEmpty({x, y}){
    if (grid[x] === undefined) {
      return false
    } else {
      const cell = grid[x][y]
      return cell === '.' || cell === 'O'
    }
  }
  const distances = GridOps.computeShortestPath({x: 0, y:0}, {x, y}, isEmpty)
  console.dir(distances[`${x},${y}`])

  /*
  const fp = p => {
    const [x, y] = p.split(',')
    return { x:+x, y:+y }
  }
  const draw2 = drawData.concat(
    Object.entries(distances).map(([k,d]) => ({ ...fp(k), data: d%10 }))
  )
  console.log(GridOps.draw(draw2))
  */
  exp && console.dir(exp)
}

function day15b(exp) {
  const resR = rightWallBot()
  const resL = leftWallBot()
  const { x, y } = resR

  const drawData = GridOps.toList(grid).concat(
    [{ x, y, data: 'D' }, { x: 0, y: 0, data: 'X' }],
  )
  LOGS && console.log(GridOps.draw(drawData))

  function isEmpty({x, y}){
    if (grid[x] === undefined) {
      return false
    } else {
      const cell = grid[x][y]
      return cell === '.' || cell === 'O'
    }
  }

  const pp = p => `${p.x},${p.y}`
  const fp = p => {
    const [x, y] = p.split(',')
    return { x:+x, y:+y }
  }
  const deltas = [[1,0], [0,-1], [0,1], [-1,0]]

  let tips = [{ x, y }]
  let depth = 0
  let fixed = new Set(tips.map(pp))
  while (tips.length > 0) {
    depth++
    let nexts = ArrayOps.uniques(ArrayOps.flatten(
      tips.map(({ x, y }) => deltas.map(([dx, dy]) => pp({ x:x+dx, y:y+dy })) )
    )).filter(p => !fixed.has(p))
      .map(fp).filter(isEmpty)
    nexts.forEach(p => fixed.add(pp(p)))
    tips = nexts
  }
  const distances = GridOps.computeShortestPath({x: 0, y:0}, {x, y}, isEmpty)

  console.dir(depth - 1)

  exp && console.dir(exp)
}

day15a(330)
day15b(352)
