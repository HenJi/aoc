const input = `#.##.
###.#
#...#
##..#
.#...`

const ArrayOps = require('../utils/arrayOps')
const GridOps = require('../utils/gridOps')

function computeRating(grid) {
  let res = 0
  for (let x = 0; x < 5; x++) {
    for (let y = 0; y < 5; y++) {
      if (grid[y][x] === '#') {
        res += Math.pow(2, 5*y+x)
      }
    }
  }
  return res
}

function tick(grid) {
  const deltas = [[1,0], [0,-1], [0,1], [-1,0]]
  let next = {}
  for (let y = 0; y < 5; y++) {
    next[y] = {}
    for (let x = 0; x < 5; x++) {
      const neighbours = deltas
        .map(([dx,dy]) => ({ x: x+dx, y:y+dy }))
        .filter(p => !(p.x < 0 || p.x > 4 || p.y < 0 || p.y > 4))
        .filter(p => grid[p.y][p.x] === '#')
        .length
      const cur = grid[y][x]
      next[y][x] =
        cur === '.' && (neighbours === 1 || neighbours === 2) ? '#' // Insect spawn
        : cur === '#' && neighbours !== 1 ? '.' // Insect dies
        : cur // same state
    }
  }
  return next
}

function print(grid) {
  return ArrayOps.flatten(
    Object.values(grid).map(o => Object.values(o))
  ).join('')
}

function day24a(src, exp) {
  let grid = GridOps.readYX(src)

  let seen = new Set()
  seen.add(print(grid))

  let i = 0
  let res = undefined
  while (res === undefined) {
    console.dir(`-- Gen ${i} --`)
    console.log(GridOps.draw(GridOps.toListY(grid)))
    grid = tick(grid)

    const printed = print(grid)
    if (seen.has(printed)) {
      res = grid
    } else {
      seen.add(printed)
    }

    i++
  }
  console.dir(computeRating(res))

  exp && console.dir(exp)
}

function tickPluto(grids) {
  const deltas = [[1,0], [0,-1], [0,1], [-1,0]]
  const zs = Object.keys(grids).map(Number)
  const minZ = Math.min(...zs)
  const maxZ = Math.max(...zs)

  let next = {}
  for (let z = minZ; z <= maxZ; z++) {
    next[z] = {}
    for (let y = 0; y < 5; y++) {
      next[z][y] = {}
      for (let x = 0; x < 5; x++) {
        if (x === 2 && y === 2) {
          next[z][y][x] = '.'
          if (grid[z][y-1][x])
        } else {
          const neighbours = ArrayOps.flatten(deltas
            .map(([dx,dy]) => ({ x: x+dx, y:y+dy, z }))
            .map(p => {
              if (p.x === 2 && p.y === 2) {
                if (grids[z+1] !== undefined) {
                  return (
                    x === 1 ? ArrayOps.init(5).map(y => ({ x: 0, y, z: z+1 }))
                    : x === 3 ? ArrayOps.init(5).map(y => ({ x: 4, y, z: z+1 }))
                    : y === 1 ? ArrayOps.init(5).map(x => ({ x, y: 0, z: z+1 }))
                    : y === 3 ? ArrayOps.init(5).map(x => ({ x, y: 4, z: z+1 }))
                    : []
                  )
                } else return []
              } else if (p.x < 0 || p.x > 4 || p.y < 0 || p.y > 4) {
                if (grids[z-1] !== undefined) {
                  return (
                    p.x < 0 ? [{ x: 1, y: 2, z: z-1 }]
                    : p.x > 4 ? [{ x: 3, y: 2, z: z-1 }]
                    : p.y < 0 ? [{ x: 2, y: 1, z: z-1 }]
                    : p.y > 4 ? [{ x: 2, y: 3, z: z-1 }]
                    : []
                } else return []
              } else return [p]
            }))
            .filter(p => grids[p.z][p.y][p.x] === '#')
            .length
          const cur = grid[z][y][x]
          next[z][y][x] =
            cur === '.' && (neighbours === 1 || neighbours === 2) ? '#' // Insect spawn
            : cur === '#' && neighbours !== 1 ? '.' // Insect dies
            : cur // same state
        }
      }
    }
  }
  return next
}

day24b(src, iterations, exp) {
  let grid0 = GridOps.readYX(src)
  let grids = { 0: grid0 }

  exp && console.dir(exp)
}

//day24a(input, 32505887)
//day24b(input, 200)

false && day24a(`....#
#..#.
#..##
..#..
#....`, 2129920)

day24b(`....#
#..#.
#..##
..#..
#....`, 10, 99)

if (false) {
  console.dir(computeRating(GridOps.readYX(`.....
.....
.....
#....
.#...`))) // should be 2129920
}