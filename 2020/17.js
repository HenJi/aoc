const input = require('./17.input.js')
const ArrayOps = require('../utils/arrayOps')

function countActiveVoisins(dim, x, y, z) {
  return [
    [-1,-1,-1], [-1,0,-1], [-1,1,-1],
    [0,-1,-1], [0,0,-1], [0,1,-1],
    [1,-1,-1], [1,0,-1], [1,1,-1],

    [-1,-1,0], [-1,0,0], [-1,1,0],
    [0,-1,0], [0,1,0],
    [1,-1,0], [1,0,0], [1,1,0],

    [-1,-1,1], [-1,0,1], [-1,1,1],
    [0,-1,1], [0,0,1], [0,1,1],
    [1,-1,1], [1,0,1], [1,1,1],
  ].map(([dx, dy, dz]) => dim.get([x+dx,y+dy,z+dz].join(',')))
  .filter(x => x == '#')
  .length
}

function dayA(src, cycles, exp) {
  const data = src.split('\n').map(l => l.split(''))

  let dimension = new Map()
  let width = data[0].length
  let height = data.length

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let z = 0
      dimension.set([x,y,z].join(','), data[y][x])
    }
  }

  for (let cycle = 1; cycle <= cycles; cycle++) {
    //console.dir(dimension)
    let next = new Map()
    for (let y = -cycle; y < height+cycle; y++) {
      for (let x = -cycle; x < width+cycle; x++) {
        for (let z = -cycle; z < 1+cycle; z++) {
          const voisins = countActiveVoisins(dimension, x, y, z)
          //console.dir(`${[x,y,z]} -> ${voisins}`)
          const state = dimension.get([x,y,z].join(','))
          const nextState =
            state === '#' && (voisins === 2 || voisins === 3) ? '#'
            : state === '#' ? '.'
            : voisins === 3 ? '#'
            : '.'

          next.set([x,y,z].join(','), nextState)
        }
      }
    }
    dimension = next
  }
  //console.dir(dimension)

  let res = Array.from(dimension.values()).filter(v => v === '#').length

  console.log(`Expected ${exp} - Got ${res}`)
}

function countActiveVoisinsW(dim, x, y, z, w) {
  return [
    [-1,-1,-1,0], [-1,0,-1,0], [-1,1,-1,0],
    [0,-1,-1,0], [0,0,-1,0], [0,1,-1,0],
    [1,-1,-1,0], [1,0,-1,0], [1,1,-1,0],

    [-1,-1,0,0], [-1,0,0,0], [-1,1,0,0],
    [0,-1,0,0], [0,1,0,0],
    [1,-1,0,0], [1,0,0,0], [1,1,0,0],

    [-1,-1,1,0], [-1,0,1,0], [-1,1,1,0],
    [0,-1,1,0], [0,0,1,0], [0,1,1,0],
    [1,-1,1,0], [1,0,1,0], [1,1,1,0],


    [-1,-1,-1,-1], [-1,0,-1,-1], [-1,1,-1,-1],
    [0,-1,-1,-1], [0,0,-1,-1], [0,1,-1,-1],
    [1,-1,-1,-1], [1,0,-1,-1], [1,1,-1,-1],

    [-1,-1,0,-1], [-1,0,0,-1], [-1,1,0,-1],
    [0,-1,0,-1], [0,0,0,-1], [0,1,0,-1],
    [1,-1,0,-1], [1,0,0,-1], [1,1,0,-1],

    [-1,-1,1,-1], [-1,0,1,-1], [-1,1,1,-1],
    [0,-1,1,-1], [0,0,1,-1], [0,1,1,-1],
    [1,-1,1,-1], [1,0,1,-1], [1,1,1,-1],


    [-1,-1,-1,1], [-1,0,-1,1], [-1,1,-1,1],
    [0,-1,-1,1], [0,0,-1,1], [0,1,-1,1],
    [1,-1,-1,1], [1,0,-1,1], [1,1,-1,1],

    [-1,-1,0,1], [-1,0,0,1], [-1,1,0,1],
    [0,-1,0,1], [0,0,0,1], [0,1,0,1],
    [1,-1,0,1], [1,0,0,1], [1,1,0,1],

    [-1,-1,1,1], [-1,0,1,1], [-1,1,1,1],
    [0,-1,1,1], [0,0,1,1], [0,1,1,1],
    [1,-1,1,1], [1,0,1,1], [1,1,1,1],
  ].map(([dx, dy, dz, dw]) => dim.get([x+dx,y+dy,z+dz,w+dw].join(',')))
  .filter(x => x == '#')
  .length
}

function dayB(src, cycles, exp) {
  const data = src.split('\n').map(l => l.split(''))

  let dimension = new Map()
  let width = data[0].length
  let height = data.length

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let z = 0
      let w = 0
      dimension.set([x,y,z, w].join(','), data[y][x])
    }
  }

  for (let cycle = 1; cycle <= cycles; cycle++) {
    //console.dir(dimension)
    let next = new Map()
    for (let y = -cycle; y < height+cycle; y++) {
      for (let x = -cycle; x < width+cycle; x++) {
        for (let z = -cycle; z < 1+cycle; z++) {
          for (let w = -cycle; w < 1+cycle; w++) {
            const voisins = countActiveVoisinsW(dimension, x, y, z, w)
            //console.dir(`${[x,y,z]} -> ${voisins}`)
            const state = dimension.get([x,y,z,w].join(','))
            const nextState =
              state === '#' && (voisins === 2 || voisins === 3) ? '#'
              : state === '#' ? '.'
              : voisins === 3 ? '#'
              : '.'

            next.set([x,y,z,w].join(','), nextState)
          }
        }
      }
    }
    dimension = next
  }
  //console.dir(dimension)

  let res = Array.from(dimension.values()).filter(v => v === '#').length

  console.log(`Expected ${exp} - Got ${res}`)
}

const test = `.#.
..#
###`

console.dir('PART A')
//dayA(test, 6, 112)
//dayA(input, 6, 310)

console.dir('PART B')
//dayB(test, 6, 848)
dayB(input, 6, 2056)
