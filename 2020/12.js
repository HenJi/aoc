const input = require('./12.input.js')
const ArrayOps = require('../utils/arrayOps')

function dayA(src, exp) {
  const instructions = src.split('\n')
  let dir = 'E'
  let x = 0
  let y = 0

  instructions.forEach( i => {
    //console.dir(`East ${x} - North ${y} - Facing ${dir}`)
    let act = i[0]
    const v = +i.slice(1)
    if (act === 'F') {
      act = dir
    }

    if (act === 'N') {
      y += v
    } else if (act === 'S') {
      y -= v
    } else if (act === 'W') {
      x -= v
    } else if (act === 'E') {
      x += v
    } else if (act === 'R') {
      const angles = ['E', 'S', 'W', 'N']
      const rotation = v / 90
      dir = angles[(angles.findIndex(a => a === dir) + rotation) % 4]
    } else if (act === 'L') {
      const angles = ['E', 'S', 'W', 'N']
      const rotation = v / 90
      dir = angles[(angles.findIndex(a => a === dir) - rotation + 4) % 4]
    }
  })
  //console.dir(`East ${x} - North ${y} - Facing ${dir}`)

  let res = Math.abs(x) + Math.abs(y)

  console.log(`Expected ${exp} - Got ${res}`)
}

// https://stackoverflow.com/questions/28112315/how-do-i-rotate-a-vector
function rotateVector([dx, dy], ang){
  const radAng = -ang * (Math.PI/180)
  const cos = Math.cos(radAng)
  const sin = Math.sin(radAng)
  return [
    Math.round(10000*(dx * cos - dy * sin))/10000,
    Math.round(10000*(dx * sin + dy * cos))/10000,
  ]
}

function dayB(src, exp) {
  const instructions = src.split('\n')
  let dir = 'E'
  let x = 0
  let y = 0

  let wx = 10
  let wy = 1

  instructions.forEach( i => {
    let act = i[0]
    const v = +i.slice(1)

    if (act === 'F') {
      x += wx * v
      y += wy * v
    }

    if (act === 'N') {
      wy += v
    } else if (act === 'S') {
      wy -= v
    } else if (act === 'W') {
      wx -= v
    } else if (act === 'E') {
      wx += v
    } else if (act === 'R') {
      [wx, wy] = rotateVector([wx, wy], v)
    } else if (act === 'L') {
      [wx, wy] = rotateVector([wx, wy], -v)
    }
  })

  let res = Math.abs(x) + Math.abs(y)

  console.log(`Expected ${exp} - Got ${res}`)
}

const test = `F10
N3
F7
R90
F11`

console.dir('PART A')
dayA(test, 25)
dayA(input, 1533)

console.dir('PART B')
dayB(test, 286)
dayB(input, 25235)
