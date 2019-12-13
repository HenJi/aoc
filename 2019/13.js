const input = require('./13.input.js')
const testInput = require('./9.input.js')

const GridOps = require('../utils/gridOps')
const intCode = require('./intCode')

const LOGS = true
//const frameEnd = [ 35, 20, 1 ]

process.stdout.cursorTo(0,0)
process.stdout.clearLine()

function print(coords) {
  let scores = coords.filter(v => v.x === -1 && v.y === 0)
  scores.reverse()
  process.stdout.cursorTo(0,0);
  process.stdout.write(`* - ${scores[0].data} - *\n`)
  process.stdout.write(GridOps.draw(coords, [' ', '|', '▓', '-', 'o']))
}

function draw(params) {
  let coords = []
  const outs = params.outputs
  let lastCoords = []
  for (let i = 0; i < outs.length; i+=3) {
    const added = { x: outs[i], y: outs[i+1], data: outs[i+2] }
    coords.push(added)
  }
  print(coords)
  coords.reverse()

  return {
    ...params,
    paddle: coords.find(d => d.data === 3),
    ball: coords.find(d => d.data === 4),
  }
}

function day13a(src, exp) {
  const programList = src.split(',').map(x => +x)
  let params = {
    id: 0,
    program: programList.reduce((acc, inst, i) => ({ ...acc, [i]: inst}), {}),
    base: 0,
    cursor: 0,
    inputs: [],
    outputs: [],
    running: true,
  }

  const res = intCode(params)
  const outs = res.outputs
  console.dir(outs.length)
  draw(params)

  const data = []
  for (let i = 0; i < outs.length; i+=3) {
    data.push({ x: outs[i], y: outs[i+1], data: outs[i+2] })
  }
  const blocks = data.filter(c => c.data === 2)
  console.dir(blocks.length)

  exp && console.dir(exp)
}

function day13b(src, exp) {
  let programList = src.split(',').map(x => +x)
  programList[0] = 2

  let params = {
    id: 0,
    program: programList.reduce((acc, inst, i) => ({ ...acc, [i]: inst}), {}),
    base: 0,
    cursor: 0,
    inputs: [],
    outputs: [],
    running: true,
    waitingInput: false,
  }
  let score = 0
  while (params.running) {
    if (params.waitingInput) {
      // console.dir(`ball ${params.ball.x} - paddle ${params.paddle.x}`)
      params.inputs = [
        params.ball.x > params.paddle.x ? 1
        : params.ball.x < params.paddle.x ? -1
        : 0
      ]
      params.waitingInput = false
    }

    params = intCode(params)
    params = draw(params)
  }
  params = draw(params)

  exp && console.log('\n'+exp)
}

//day13a(input, 236)
day13b(input, 11040)
