const input = require('./11.input.js')
const ArrayOps = require('../utils/arrayOps')
const StringOps = require('../utils/stringOps')

function print(grid) {
  return grid.map(l => l.join('')).join('\n')
}

function cpt(grid, x, y) {
  if (grid[y] === undefined) return 0
  else return grid[y][x] === '#' ? 1 : 0
}

function dayA(src, exp) {
  let grid = src.split('\n').map(l => l.split(''))
  let height = grid.length
  let width = grid[0].length

  let state = ''

  while (print(grid) !== state) {
    state = print(grid)
    //console.dir('loop')
    //console.log(state)
    let newGrid = ArrayOps.init(height).map(y => ArrayOps.init(width).map(x => grid[y][x]))
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const st = grid[y][x]
        if (st !== '.') {
          const next = cpt(grid, x+1, y) + cpt(grid, x-1, y) + cpt(grid, x, y+1) + cpt(grid, x, y-1)
            + cpt(grid, x+1, y+1) + cpt(grid, x-1, y-1) + cpt(grid, x-1, y+1) + cpt(grid, x+1, y-1)
          if (st === 'L' && next === 0) {
            newGrid[y][x] = '#'
          } else if (st === '#' && next >= 4) {
            newGrid[y][x] = 'L'
          }
        }
      }
    }

    grid = newGrid
  }


  //console.log(state)

  let res = StringOps.occurrences(state, '#', false)

  console.log(`Expected ${exp} - Got ${res}`)
}

function cpt2(grid, x, y, dx, dy) {
  let testX = x + dx
  let testY = y + dy
  while (grid[testY] && grid[testY][testX] === '.') {
    testX += dx
    testY += dy
  }
  if (grid[testY] === undefined) return 0
  else return grid[testY][testX] === '#' ? 1 : 0
}

function dayB(src, exp) {
  let grid = src.split('\n').map(l => l.split(''))
  let height = grid.length
  let width = grid[0].length

  let state = ''

  while (print(grid) !== state) {
    state = print(grid)
    //console.dir('loop')
    //console.log(state)
    let newGrid = ArrayOps.init(height).map(y => ArrayOps.init(width).map(x => grid[y][x]))
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const st = grid[y][x]
        if (st !== '.') {
          const next = cpt2(grid, x, y, 0, 1) + cpt2(grid, x, y, 0, -1) + cpt2(grid, x, y, 1, 0) + cpt2(grid, x, y, -1, 0)
            + cpt2(grid, x, y, 1, 1) + cpt2(grid, x, y, 1, -1) + cpt2(grid, x, y, -1, -1) + cpt2(grid, x, y, -1, 1)
          if (st === 'L' && next === 0) {
            newGrid[y][x] = '#'
          } else if (st === '#' && next >= 5) {
            newGrid[y][x] = 'L'
          }
        }
      }
    }

    grid = newGrid
  }

  //console.log(state)

  let res = StringOps.occurrences(state, '#', false)

  console.log(`Expected ${exp} - Got ${res}`)
}

const test = `L.LL.LL.LL
LLLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLLL
L.LLLLLL.L
L.LLLLL.LL`

console.dir('PART A')
//dayA(test, 37)
//dayA(input, 2243)

console.dir('PART B')
//dayB(test, 26)
dayB(input, 2027)
