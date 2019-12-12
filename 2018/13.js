const input = require('./13.input.js')

const GridOps = require('../utils/gridOps.js')
const LOGS = false

const testInputA = `/->-\\
|   |  /----\\
| /-+--+-\\  |
| | |  | v  |
\\-+-/  \\-+--/
  \\------/   `

const testInputB = `/>-<\\
|   |
| /<+-\\
| | | v
\\>+</ |
  |   ^
  \\<->/`

const dirs = ['<', '^', '>', 'v']
const intersect = '+'
const turns = [ '/', '\\' ]
const rails = ['-', '|', '-', intersect, ...turns]

const turnMap = {
  '<': { '/': 'v', '\\': '^' },
  '>': { '/': '^', '\\': 'v' },
  '^': { '/': '>', '\\': '<' },
  'v': { '/': '<', '\\': '>' },
}

const dirDelta = {
  '<': { dx: -1, dy: 0 },
  '>': { dx: 1, dy: 0 },
  '^': { dx: 0, dy: -1 },
  'v': { dx: 0, dy: 1 },
}

function day13a(src, exp) {
  let grid = {}
  let carts = []

  src.split('\n').forEach((line, y) => {
    line.split('').forEach((c, x) => {
      if (rails.indexOf(c) >= 0 || dirs.indexOf(c) >= 0) {
        if (grid[x] === undefined) {
          grid[x] = {}
        }
        grid[x][y] = dirs.indexOf(c) >= 0 ? '.' : c
      }
      if (dirs.indexOf(c) >= 0) {
        carts.push({ x, y, dir: c, state: 0 }) // 0: left, 1: straight, 2: right
      }
    })
  })
  carts = carts.map((c, i) => ({ ...c, id: i}))
  //console.log(GridOps.draw( carts.map((c, i) => ({ ...c, data: i})) ))

  let i = 0
  let res = undefined
  while (res === undefined) {
    LOGS && console.log(i)
    LOGS && console.log(GridOps.draw([ ...GridOps.toList(grid), ...carts.map((c, i) => ({ ...c, data: c.dir})) ]))
    for (let j = 0; j < carts.length; j++) {
      const cur = carts[j]
      const { dx, dy } = dirDelta[cur.dir]
      const rail = grid[cur.x+dx][cur.y+dy]
      const nextDir =
        turns.indexOf(rail) >= 0 ? turnMap[cur.dir][rail]
        : rail === intersect ? dirs[ (dirs.indexOf(cur.dir) + cur.state + 3) % 4 ] // -1 + 4
        : cur.dir
      const next = {
        ...cur,
        x: cur.x + dx,
        y: cur.y + dy,
        dir: nextDir,
        state: rail === intersect ? (cur.state+1)%3 : cur.state
      }
      const collision = carts.find(c => c.x === next.x && c.y === next.y) !== undefined
      if (collision) {
        res = next.x + ',' + next.y
      }
      carts[j] = next
    }
    carts = carts.sort((a,b) => {
      const dy = a.y - b.y
      return dy === 0 ? a.x - b.x : dy
    })
    i++
  }
  console.log(i)
  LOGS && console.log(GridOps.draw([ ...GridOps.toList(grid), ...carts.map((c, i) => ({ ...c, data: c.dir})) ]))
  console.dir(res)

  exp && console.dir(exp)
}

function day13b(src, exp) {
  let grid = {}
  let carts = []

  src.split('\n').forEach((line, y) => {
    line.split('').forEach((c, x) => {
      if (rails.indexOf(c) >= 0 || dirs.indexOf(c) >= 0) {
        if (grid[x] === undefined) {
          grid[x] = {}
        }
        grid[x][y] = dirs.indexOf(c) >= 0 ? '.' : c
      }
      if (dirs.indexOf(c) >= 0) {
        carts.push({ x, y, dir: c, state: 0, dead: false }) // 0: left, 1: straight, 2: right
      }
    })
  })
  carts = carts.map((c, i) => ({ ...c, id: i}))
  //console.log(GridOps.draw( carts.map((c, i) => ({ ...c, data: i})) ))

  let i = 0
  while (carts.length > 1) {
    LOGS && console.log(i)
    LOGS && console.log(GridOps.draw([ ...GridOps.toList(grid), ...carts.map((c, i) => ({ ...c, data: c.dir})) ]))
    for (let j = 0; j < carts.length; j++) {
      const cur = carts[j]
      if (!cur.dead) {
        const { dx, dy } = dirDelta[cur.dir]
        const rail = grid[cur.x+dx][cur.y+dy]
        const nextDir =
          turns.indexOf(rail) >= 0 ? turnMap[cur.dir][rail]
          : rail === intersect ? dirs[ (dirs.indexOf(cur.dir) + cur.state + 3) % 4 ] // -1 + 4
          : cur.dir
        const next = {
          ...cur,
          x: cur.x + dx,
          y: cur.y + dy,
          dir: nextDir,
          state: rail === intersect ? (cur.state+1)%3 : cur.state
        }
        let collision = carts.find(c => c.x === next.x && c.y === next.y && !c.dead)
        carts[j] = next
        if (collision !== undefined) {
          carts[j].dead = true
          collision.dead = true
        }
      }
    }
    carts = carts.filter(c => !c.dead).sort((a,b) => {
      const dy = a.y - b.y
      return dy === 0 ? a.x - b.x : dy
    })
    i++
  }
  console.log(i)
  LOGS && console.log(GridOps.draw([ ...GridOps.toList(grid), ...carts.map((c, i) => ({ ...c, data: c.dir})) ]))

  const survivor = carts[0]
  console.dir(`${survivor.x},${survivor.y}`)

  exp && console.dir(exp)
}

day13a(input, '32,8')
// day13a(testInputA, '7,3')

day13b(input, '38,38')
// day13b(testInputB, '6,4')
