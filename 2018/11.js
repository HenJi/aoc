const ArrayOps = require('../utils/arrayOps')

function computeFuel(x, y, id) {
  const rackId = x + 10
  const powerLevel = rackId * y
  const step34 = (powerLevel + id) * rackId
  const hundreds = Math.floor(step34/100) % 10
  return hundreds - 5
}

function computeSum(grid, w, x0, y0) {
  let res = 0
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < w; y++) {
      res += grid[y0+y][x0+x]
    }
  }
  return res
}

function pad(n) {
  return ('  '+n).slice(-2)
}

function computeBigest(grid, size) {
  const w = grid.length - 1
  let score = computeSum(grid, size, 0, 0)
  let resX = 0
  let resY = 0
  for (let x = 1; x < w - size; x++) {
    for (let y = 1; y < w - size; y++) {
      const test = computeSum(grid, size, x, y)
      if (test > score) {
        score = test
        resX = x+1
        resY = y+1
      }
    }
  }
  return { x: resX, y: resY, size, score }
}

function day11a(id, w, sw) {
  const line = ArrayOps.init(w).map(_ => undefined)
  let grid = line.map(_ => line.slice(0))

  for (let x = 0; x < w; x++) {
    for (let y = 0; y < w; y++) {
      grid[y][x] = computeFuel(x+1, y+1, id)
    }
  }

  console.dir(computeBigest(grid, 3))
}

function day11b(id, w) {
  const line = ArrayOps.init(w).map(_ => undefined)
  let grid = line.map(_ => line.slice(0))

  for (let x = 0; x < w; x++) {
    for (let y = 0; y < w; y++) {
      grid[y][x] = computeFuel(x+1, y+1, id)
    }
  }

  let results = ArrayOps
    .init(w/10) // Generally, result should be there
    .map(s => {
      const res = computeBigest(grid, s+1)
      // console.dir(res)
      return res
    })
    .sort((a,b) => b.score - a.score)
  console.dir(results[0])
}

day11a(5235, 300, 3)
/*
if (false) {
  day11a(18, 300, 3)
  console.dir('Should be 33,45')
}
*/

day11b(5235, 300)

// not 232,289,8
//day11b(18, 300)

if (false) {
  // Should all give 0
  console.dir(computeFuel(3, 5, 8) - 4)
  console.dir(computeFuel(122, 79, 57) + 5)
  console.dir(computeFuel(217, 196, 39) - 0)
  console.dir(computeFuel(101, 153, 71) - 4)
}
