const input = require('./18.input.js')
const ArrayOps = require('../utils/arrayOps')

function computeFlat(op) {
  //console.dir(op)
  const args = op.split(' ')
  let result = +args[0]
  for (let i = 1; i < args.length; i += 2) {
    let op = args[i]
    let v = +args[i+1]
    if (op === '+') result += v
    else if (op === '*') result = result * v
    else consle.dir('unknown operator '+op)
  }
  return result
}


function computePlusFirst(op) {
  //console.dir(op)
  let loc = op.split(' ')

  while (loc.indexOf('+') >= 0) {
    let operator = loc.indexOf('+')
    let subRes = (+loc[operator-1]) + (+loc[operator+1])
    loc = [ ...loc.slice(0, operator-1), subRes, ...loc.slice(operator+2) ]
    //console.dir(loc)
  }

  return computeFlat(loc.join(' '))
}

function compute(flatCompute){
  return function(op) {
    let loc = op
    while (loc.indexOf('(') >= 0) {
      let subOpLeft = loc.lastIndexOf('(')
      let subOpRight = loc.indexOf(')', subOpLeft)
      let subOp = loc.slice(subOpLeft, subOpRight+1)
      //console.dir(subOp)
      let res = flatCompute(subOp.slice(1,-1))
      loc = loc.replace(subOp, res)
    }
    //console.dir(loc)
    return flatCompute(loc)
  }
}

function dayA(src, exp) {
  let ops = src.split('\n')

  let results = ops.map(compute(computeFlat))

  let res = ArrayOps.sum(results)

  console.log(`Expected ${exp} - Got ${res}`)
}

function dayB(src, exp) {
  let ops = src.split('\n')

  let results = ops.map(compute(computePlusFirst))

  let res = ArrayOps.sum(results)

  console.log(`Expected ${exp} - Got ${res}`)
}

console.dir('PART A')

//console.dir(compute(computeFlat)('2 * 3 + (4 * 5)'))

const test = `2 * 3 + (4 * 5)
5 + (8 * 3 + 9 + 3 * 4 * 3)
5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))
((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2`

dayA(test, 26+437+12240+13632)
dayA(input, 1451467526514)

console.dir('PART B')

//console.dir(computePlusFirst('1 + 2 * 3 + 4 * 5 + 6'))

const test2 = `1 + (2 * 3) + (4 * (5 + 6))
2 * 3 + (4 * 5)
5 + (8 * 3 + 9 + 3 * 4 * 3)
5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))
((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2`

dayB(test2, 51+46+1445+669060+23340)
dayB(input, 224973686321527)
