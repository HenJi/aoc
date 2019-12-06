const input = require('./3.input.js')

const ArrayOps = require('../utils/arrayOps.js')

function readClaim(line) {
  const [id, _, pos, size] = line.split(' ')
  const [x, y] = pos.split(':')[0].split(',').map(n => +n)
  const [w, h] = size.split('x').map(n => +n)
  return { id, x, y, w, h }
}

function day3a(src) {
  const claims = src.split('\n').map(readClaim)

  let grid = {}
  let overlaps = new Set()
  claims.forEach(({ x, y, w, h }) => {
    // console.dir(w+'x'+h)
    ArrayOps.init(w).forEach( dx => {
      let col = grid[x+dx] || new Set()
      ArrayOps.init(h).forEach( dy => {
        // console.dir((x+dx)+' '+(y+dy))
        if (col.has(y+dy)) {
          overlaps.add((x+dx)+' '+(y+dy))
        } else {
          col.add(y+dy)
        }
      })
      grid[x+dx] = col
    })
  })
  console.dir(overlaps.size)
}

function day3b(src) {
  const claims = src.split('\n').map(readClaim)

  let grid = {}
  let overlaps = new Set()
  claims.forEach(({ id, x, y, w, h }) => {
    // console.dir(w+'x'+h)
    ArrayOps.init(w).forEach( dx => {
      let col = grid[x+dx] || {}
      ArrayOps.init(h).forEach( dy => {
        // console.dir((x+dx)+' '+(y+dy))
        const curCont = col[y+dy]
        if (curCont !== undefined) {
          overlaps.add(curCont)
          overlaps.add(id)
        } else {
          col[y+dy] = id
        }
      })
      grid[x+dx] = col
    })
  })

  const notOverlapping = claims.filter(c => !overlaps.has(c.id))
  console.dir(notOverlapping)
}

day3a(input)
day3b(input)

false && day3b(`#1 @ 1,3: 4x4
#2 @ 3,1: 4x4
#3 @ 5,5: 2x2`)
