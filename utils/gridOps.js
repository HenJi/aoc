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
  return ArrayOps.flatten(Object.keys(grid).map(x => {
    const line = grid[x]
    return Object.keys(line).map(y => ({ x:+x, y:+y, data: line[y] }))
  }))
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

module.exports = {
  draw,
  toList,
  toXYMap,
  toYXMap,
}
