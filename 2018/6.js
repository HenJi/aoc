const input = require('./6.input.js')
const ArrayOps = require('../utils/arrayOps')

const LOGS = false

function isFull(grid) {
  return grid.find(l => l.indexOf(0) >= 0) === undefined
}

function neighbours({x, y}) {
  return [
    { x: x+1, y }, { x: x-1, y },
    { x, y: y+1 }, { x, y: y-1 },
  ]
}

function day6a(src) {
  const centers = src.split('\n').map((l, i) => {
    const [x, y] = l.split(', ')
    return {id: i+1, x: +x, y: +y}
  })
  const xs = centers.map(c => c.x)
  const minX = Math.min(...xs)
  const ys = centers.map(c => c.y)
  const minY = Math.min(...ys)
  const EXTRA = 0

  const maxX = Math.max(...xs) + 1 + EXTRA
  const maxY = Math.max(...ys) + 1 + EXTRA
  const adjusted = centers.map(c => ({ id: c.id, x: c.x + EXTRA, y: c.y + EXTRA }))

  LOGS && console.dir(`Grid ${maxX}x${maxY}`)
  let grid = ArrayOps.init(maxY+EXTRA).map(_ => ArrayOps.init(maxX+EXTRA).map(i => 0))

  let areas = {}
  adjusted.forEach(({ id, x, y }) => {
    grid[y][x] = id
    areas[id] = { id, cover: new Set([{ x, y }]), infinite: false, prev: new Set([{ x, y }]) }
  })

  while (!isFull(grid)) {
    LOGS && console.dir(' - * - ')
    LOGS && console.log(grid.map(l => l.join('')).join('\n').replace(/0/g, ' '))
    LOGS && console.dir(Object.values(areas).map(a => ({ ...a, cover: a.cover.size, prev: a.prev.size })))

    Object.values(areas)
    .map(({ id, cover, infinite, prev }) => {
      const potentialNext = ArrayOps.flatten([ ...prev.values() ].map(neighbours))
      const freeNext = potentialNext.filter(({x, y}) => grid[y] && grid[y][x] === 0)
      const inf = infinite || potentialNext.find(({x, y}) => grid[y] === undefined || grid[y][x] === undefined) !== undefined
      return { id, cover, infinite: inf, freeNext }
    })
    .forEach(({ id, cover, infinite, freeNext }) => {
      let prev = new Set()
      freeNext.forEach(({ x, y }) => {
        const curCell = grid[y][x]
        if (curCell === 0) {
          grid[y][x] = id
          prev.add({ x, y })
          cover.add({ x, y })
        } else if (curCell !== '.' && curCell !== id) {
          grid[y][x] = '.'
          prev.add({ x, y })
          areas[curCell].cover.delete({ x, y })
        }
      })
      areas[id] = { id, cover, infinite, prev }
    })
  }
  LOGS && console.dir(' - * - ')
  LOGS && console.log(grid.map(l => l.join('')).join('\n').replace(/0/i, ' '))
  const res = Object.values(areas)
    .filter(a => !a.infinite)
    .map(a => ({ ...a, cover: a.cover.size, prev: a.prev.size }))
    .sort((a,b) => b.cover - a.cover)
  console.dir(res)
}

function manhattanDist(p1, p2) {
  return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y)
}

function day6b(dist, src) {
  const centers = src.split('\n').map((l, i) => {
    const [x, y] = l.split(', ')
    return {id: i+1, x: +x, y: +y}
  })
  function computeDist(point) {
    return centers.reduce((res, c) => res + manhattanDist(point, c), 0)
  }
  const xs = centers.map(c => c.x)
  const ys = centers.map(c => c.y)
  const minX = Math.min(...xs)
  const minY = Math.min(...ys)
  const maxX = Math.max(...xs)
  const maxY = Math.max(...ys)

  const center = { x: Math.floor((maxX - minX)/2), y: Math.floor((maxY - minY)/2) }
  if (computeDist(center) > dist) {
    console.dir('Oups, center is not valid :/')
    return
  }

  let valid = new Set([center.x+':'+center.y])
  let prev = [center]

  while (prev.length > 0) {
    let cur = []
    prev.forEach(c => {
      neighbours(c).forEach(p => {
        const strP = p.x+':'+p.y
        if (!valid.has(strP) && computeDist(p) < dist) {
          valid.add(strP)
          cur.push(p)
        }
      })
    })
    prev = cur
  }
  console.dir(valid.size)
}

day6a(input)
// 2358 too high -> 2342 ?
/*
day6a(`1, 1
1, 6
8, 3
3, 4
5, 5
8, 9`)
*/
day6b(10000, input)

/*day6b(32, `1, 1
1, 6
8, 3
3, 4
5, 5
8, 9`)
*/
