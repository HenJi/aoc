const input = require('./19.input.js')
const programList = input.split(',').map(x => +x)
const GridOps = require('../utils/gridOps')

const intCode = require('./intCode')

const pp = p => `${p.x},${p.y}`
const deltas = [[0,1], [1,0]]

function initParams(inputs) {
  return {
    id: 0,
    program: programList.reduce((acc, inst, i) => ({ ...acc, [i]: inst}), {}),
    base: 0,
    cursor: 0,
    inputs,
    outputs: [],
    running: true,
  }
}

function day19a(area, exp) {
  let beamed = 0
  for (let x = 0; x < area; x++) {
    for (let y = 0; y < area; y++) {
      const params = intCode(initParams([x, y]))
      //console.dir({ x, y, res: params.outputs })

      if (params.outputs[0] === 1) {
        beamed++
      }
    }
  }

  console.dir(beamed)
  exp && console.dir(exp)
}

function day19b(size, exp) {
  function isBeamed({x, y}) {
    const res = intCode(intCode(initParams([x, y])))
    return res.outputs[0] === 1
  }

  let grid = {} // y -> x
  let heads = []
  let tested = new Set()
  for (let x = 0; x < 16; x++) {
    for (let y = 0; y < 16; y++) {
      if (grid[y] === undefined) grid[y] = {}
      const beamed = isBeamed({ x, y })
      tested.add(pp({x, y}))
      if (beamed) {
        grid[y][x] = beamed
      }
      if (x === 15 || y === 15 && beamed) {
        heads.push({ x, y })
      }
    }
  }

  let i = 0
  let j = 700 // Magic value, answer should be more than that
  let res = undefined
  let firsts = {} // y -> first x
  while (i < 2000 && res === undefined) {
    if (i % 100 === 0) {
      console.dir(i)
    }
    let next = []
    deltas.forEach(([dx, dy]) => {
      heads.forEach( ({x, y}) => {
        const point = { x: x+dx, y: y+dy }
        if (grid[point.y] === undefined) grid[point.y] = {}

        if (tested.has(pp(point))) {
          return
        } else {
          tested.add(pp(point))
          const beamed = isBeamed(point)
          if (beamed) {
            if (firsts[point.y] === undefined && point.y > j) {
              j = point.y
              firsts[point.y] = point.x
            }
            grid[point.y][point.x] = beamed
            next.push(point)
          }
        }
      })
    })
    Object.entries(firsts).forEach(([y, x]) => {
      if (res === undefined && grid[y-size+1][x] === true && grid[y-size+1][x+size-1] === true) {
        res = { x, y: y - size + 1 }
      } else {
        delete firsts[y]
      }
    })

    heads = next
    i++
  }
  console.dir(i)
  Object.entries(firsts).forEach(([y, x]) => {
    if (res === undefined && grid[y-size+1][x] === true && grid[y-size+1][x+size-1] === true) {
      res = { x, y: y - size + 1 }
    }
  })
  console.dir(res.x*10000 + res.y)
  //console.log(GridOps.draw(coords))
  exp && console.dir(exp)
}

day19a(50, 173)
console.dir(' - ')
day19b(100, 6671097)
