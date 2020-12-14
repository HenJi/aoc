const ArrayOps = require('./arrayOps')

// Draw a {x, y, data} grid
// with { data: char } chars
function draw(coords, colors) {
  const xs = coords.map(c => c.x)
  const ys = coords.map(c => c.y)
  const minX = Math.min(...xs)
  const minY = Math.min(...ys)
  const maxX = Math.max(...xs)+1
  const maxY = Math.max(...ys)+1

  let panel = ArrayOps.init(maxY - minY).map(_ => ArrayOps.init(maxX - minX).map(_ => ' '))
  coords.forEach(({x, y, data}) => {
    panel[y-minY][x-minX] = colors ? colors[data] : data
  })
  return panel.map(l => l.join('')).join('\n')
}

// Convert a {x: {y: data}} grid into a [{ x, y, data }] list
function toList(grid) {
  return ArrayOps.flatten(Object.keys(grid).map(x =>
    Object.keys(grid[x]).map(([y, data]) => ({ x:+x, y:+y, data }))
  ))
}

// Convert a {y: {x: data}} grid into a [{ x, y, data }] list
function toListY(grid) {
  return ArrayOps.flatten(Object.keys(grid).map(y =>
    Object.entries(grid[y]).map(([x, data]) => ({ x:+x, y:+y, data }))
  ))
}

// Convert a [{ x, y, data }] list into a {x: {y: data}} grid
function toXYMap(coords) {
  let res = {}
  coords.forEach(({x, y, data}) => {
    if (res[x] === undefined) {
      res[x] = {}
    }
    res[x][y] = data
  })
  return res
}

const deltas = [[1,0], [0,-1], [0,1], [-1,0]]
const pp = p => `${p.x},${p.y}`
const fp = p => {
  const [x, y] = p.split(',')
  return { x:+x, y:+y }
}

function computeShortestPath(a, b, isAvailable) {
  const target = pp(b)

  let distances = {
    [pp(a)]: 0
  }
  let tips = [a]
  let depth = 0
  while (distances[target] === undefined && tips.length > 0) {
    //console.dir(tips)
    depth++
    let nexts = ArrayOps.uniques(ArrayOps.flatten(
      tips.map(({ x, y }) => deltas.map(([dx, dy]) => pp({ x:x+dx, y:y+dy })) )
    )).filter(p => distances[p] === undefined)
      .map(fp).filter(isAvailable)
    nexts.forEach(p => distances[pp(p)] = depth)
    tips = nexts
  }
  return distances
}

function computeShortestPaths(a, bs, isAvailable) {
  const targets = bs.map(pp)

  let distances = {
    [pp(a)]: 0
  }
  let tips = [a]
  let depth = 0
  while (distances[target] === undefined && tips.length > 0) {
    //console.dir(tips)
    depth++
    let nexts = ArrayOps.uniques(ArrayOps.flatten(
      tips.map(({ x, y }) => deltas.map(([dx, dy]) => pp({ x:x+dx, y:y+dy })) )
    )).filter(p => distances[p] === undefined)
      .map(fp).filter(isAvailable)
    nexts.forEach(p => distances[pp(p)] = depth)
    tips = nexts
  }
  return distances
}

function computeReachable(a, isAvailable) {
  let distances = { [a.x]: { [a.y]: 0 } }
  let tips = [a]
  let depth = 0

  while (tips.length > 0) {
    depth++
    let nexts = ArrayOps.uniques(ArrayOps.flatten(
      tips.map(({ x, y }) => deltas.map(([dx, dy]) => pp({ x:x+dx, y:y+dy })) )
    )).map(fp)
      .filter(p => distances[p.x] === undefined || distances[p.x][p.y] === undefined)
      .filter(isAvailable)
    nexts.forEach(p => {
      if (distances[p.x] === undefined) distances[p.x] = {}
      distances[p.x][p.y] = depth
    })
    tips = nexts
  }

  return distances
}

// Convert a [{ x, y, data }] list into a {y: {x: data}} grid
function toYXMap(coords) {
  let res = {}
  coords.forEach(({x, y, data}) => {
    if (res[y] === undefined) {
      res[y] = {}
    }
    res[y][x] = data
  })
  return res
}

function readYX(src) {
  let grid = {}
  src.split('\n').forEach( (line, y) => {
    grid[y] = {}; line.split('').forEach((c, x) => grid[y][x] = c)
  })
  return grid
}

module.exports = {
  draw,
  toList,
  toListY,
  toXYMap,
  toYXMap,
  computeShortestPath,
  computeShortestPaths,
  computeReachable,
  readYX,
}
