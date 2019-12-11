const ArrayOps = require('./arrayOps')

// Draw a {x: {y: color[]}} grid
// with { color: char } chars
function draw(grid, colors) {
  const coords = ArrayOps.flatten(Object.keys(grid).map(x => {
    const line = grid[x]
    return Object.keys(line).map(y => ({ x:+x, y:+y, color: line[y] }))
  }))
  const xs = coords.map(c => c.x)
  const ys = coords.map(c => c.y)
  const minX = Math.min(...xs)
  const minY = Math.min(...ys)
  const maxX = Math.max(...xs)+1
  const maxY = Math.max(...ys)+1

  let panel = ArrayOps.init(maxY - minY).map(_ => ArrayOps.init(maxX - minX).map(_ => ' '))
  coords.forEach(({x, y, color}) => {
    panel[y-minY][x-minX] = colors[color]
  })
  return panel.map(l => l.join('')).join('\n')
}

module.exports = {
  draw,
}
