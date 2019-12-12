const input = require('./10.input.js')
const GridOps = require('../utils/gridOps')

const testInput = `position=< 9,  1> velocity=< 0,  2>
position=< 7,  0> velocity=<-1,  0>
position=< 3, -2> velocity=<-1,  1>
position=< 6, 10> velocity=<-2, -1>
position=< 2, -4> velocity=< 2,  2>
position=<-6, 10> velocity=< 2, -2>
position=< 1,  8> velocity=< 1, -1>
position=< 1,  7> velocity=< 1,  0>
position=<-3, 11> velocity=< 1, -2>
position=< 7,  6> velocity=<-1, -1>
position=<-2,  3> velocity=< 1,  0>
position=<-4,  3> velocity=< 2,  0>
position=<10, -3> velocity=<-1,  1>
position=< 5, 11> velocity=< 1, -2>
position=< 4,  7> velocity=< 0, -1>
position=< 8, -2> velocity=< 0,  1>
position=<15,  0> velocity=<-2,  0>
position=< 1,  6> velocity=< 1,  0>
position=< 8,  9> velocity=< 0, -1>
position=< 3,  3> velocity=<-1,  1>
position=< 0,  5> velocity=< 0, -1>
position=<-2,  2> velocity=< 2,  0>
position=< 5, -2> velocity=< 1,  2>
position=< 1,  4> velocity=< 2,  1>
position=<-2,  7> velocity=< 2, -2>
position=< 3,  6> velocity=<-1, -1>
position=< 5,  0> velocity=< 1,  0>
position=<-6,  0> velocity=< 2,  0>
position=< 5,  9> velocity=< 1, -2>
position=<14,  7> velocity=<-2,  0>
position=<-3,  6> velocity=< 2, -1>`

const LOGS = false

function applySpeed(ast) {
  ast.x += ast.vx
  ast.y += ast.vy
  return ast
}

function readLine(line) {
  const [_, pos, vel] = line.replace(/ /g, '').split('<')
  const [x, y] = pos.split('>')[0].split(',')
  const [vx, vy] = vel.split('>')[0].split(',')
  return { x: +x, y: +y, vx: +vx, vy:+vy, data:0 }
}

function day10a(src) {
  let positions = src.split('\n').map(readLine)

  function hasText(coords) {
    const xyMap = GridOps.toXYMap(coords)
    // console.dir(xyMap)
    const ranges = Object.values(xyMap).map(o => {
      const ys = Object.keys(o)
      const maxY = Math.max(...ys)+1
      const minY = Math.min(...ys)
      return (maxY - minY)
    })
    const maxL = Math.max(...ranges)
    const vLines = Object.values(xyMap)
      .filter(o => {
        const ys = Object.keys(o)
        return ys.length === maxL
      })
    return vLines.length > 2
  }

  let i = 0
  while (!hasText(positions)) {
    LOGS && console.dir(`--- T ${i} ---`)
    positions = positions.map(applySpeed)
    LOGS && console.log(GridOps.draw(positions, ['o']))
    LOGS && console.dir(hasText(positions))
    i++
  }
  console.log(GridOps.draw(positions, ['o']))
  console.log(i)
}

day10a(input)
// day10a(testInput)
