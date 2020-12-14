const input = require('./5.input.js')
const ArrayOps = require('../utils/arrayOps')

function computeId(pass) {
  let rowStart = 0
  let rowEnd = 127
  const rows = pass.slice(0,7).split("")
  //console.dir([rowStart, rowEnd])
  rows.forEach( r => {
    if (r == 'F') {
      rowEnd = rowStart + Math.floor((rowEnd - rowStart) / 2)
    } else {
      rowStart = rowStart + Math.ceil((rowEnd - rowStart) / 2)
    }
    //console.dir([rowStart, rowEnd])
  })
  //console.dir(rowStart)

  let colStart = 0
  let colEnd = 7
  const cols = pass.slice(7).split("")
  //console.dir([colStart, colEnd])
  cols.forEach( r => {
    if (r == 'L') {
      colEnd = colStart + Math.floor((colEnd - colStart) / 2)
    } else {
      colStart = colStart + Math.ceil((colEnd - colStart) / 2)
    }
    //console.dir([colStart, colEnd])
  })
  //console.dir(colStart)

  return rowStart * 8 + colStart
}

function dayA(src) {
  const passes = src.split('\n').map(computeId)
  console.dir(Math.max(...passes))
}

function dayB(src) {
  const passes = src.split('\n').map(computeId)
  passes.sort()
  for (let i = 0; i < 880; i++) {
    if (passes.indexOf(i) < 0) {
      console.dir(i)
    }
  }
  //console.dir(passes)
}

const test = `BFFFBBFRRR
FFFBBBFRRR
BBFFBBFRLL`

//computeId('FBFBBFFRLR', 44, 5, 357)
//computeId('BFFFBBFRRR', 70, 7, 567)
//computeId('FFFBBBFRRR', 14, 7, 119)
//computeId('BBFFBBFRLL', 102, 4, 820)
//dayA(test, 820)
//dayA(input)

const testB1 = ``
//const testB2 = ``

//dayB(testB1)
//dayB(testB2)
dayB(input)
