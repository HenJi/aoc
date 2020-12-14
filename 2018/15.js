const input = require('./15.input.js')

const ArrayOps = require('./arrayOps')
const GridOps = require('../utils/gridOps')

const LOGS = true

const deltas = [[1,0], [0,-1], [0,1], [-1,0]]

function day15a(src, hp, exp) {
  let grid = {} // X -> Y -> true
  let entities = []
  src.split('\n').forEach((line, y) => {
    line.split('').forEach((c, x) => {
      if (c === '#') {
        if (grid[x] === undefined) grid[x] = {}
        grid[x][y] = '#'
      } else if (c === 'G' || c === 'E') {
        entities.push({ x, y, hp, power: 3, data: c })
      }
    })
  })
  function sortEntities() {
    entities.sort((a, b) => {
      let ys = a.y - b.y
      return ys === 0 ? a.x - b.x : ys
    })
  }
  console.log(GridOps.draw( GridOps.toList(grid).concat(entities) ))

  function isAvailable(p) {
    const hasWall = grid[p.x] === undefined || grid[p.x][p.y] === '#'
    const hasEntity = entities.find(e => e.x === p.x && e.y === p.y) === undefined
    return !hasWall && !hasEntity
  }

  let gameFinished = false
  let loop = 0
  while (loop < 2 && !gameFinished) {
    loop++
    console.dir(`Loop ${loop}`)
    console.log(GridOps.draw( GridOps.toList(grid).concat(entities) ))
    for (let i = 0; i < entities.length; i++) {
      const cur = entities[i]
      let others = entities.filter(e => e !== cur || e.data !== cur.data)
      if (others.length === 0) {
        gameFinished = true
      }
      const targetSlots = ArrayOps.flatten(others.map(target => {
        return deltas
          .map(([dx, dy]) => ({ x:x+dx, y:y+dy, target }))
          .filter(isAvailable)
      }))

    }

  }

  exp && console.dir(exp)
}

// day15a(input)
  day15a(`#######
#.G...#
#...EG#
#.#.#G#
#..G#E#
#.....#
#######`, 200, 27730)
if (false) {
  day15a(`#######
#.G...#
#...EG#
#.#.#G#
#..G#E#
#.....#
#######`, 200, 27730)
  day15a(`#######
#G..#E#
#E#E.E#
#G.##.#
#...#E#
#...E.#
#######`, 200, 36334)
  day15a(`#######
#E..EG#
#.#G.E#
#E.##E#
#G..#.#
#..E#.#
#######`, 200, 39514)
  day15a(`#######
#E.G#.#
#.#G..#
#G.#.G#
#G..#.#
#...E.#
#######`, 200, 27755)
  day15a(`#########
#G......#
#.E.#...#
#..##..G#
#...##..#
#...#...#
#.G...G.#
#.....G.#
#########`, 200, 18740)
}
