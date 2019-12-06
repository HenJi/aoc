const ArrayOps = require('../utils/arrayOps.js')

const adj = ArrayOps.init(10).map(i => ""+i+i)
function twoAdjacent(n) {
  return adj.find(v => n.indexOf(v) >= 0) !== undefined
}

function increasing(n) {
  const d = n.split('')
  return d[0] <= d[1] && d[1] <= d[2] && d[2] <= d[3] && d[3] <= d[4] && d[4] <= d[5]
}

function day4a(a,b) {
  function check(i) {
    return twoAdjacent(i) && increasing(i)
  }

  var i = a
  var res = 0
  while(i <= b) {
    if (check(''+i)) {
      res += 1
    }
    i+=1
  }
  console.log(res)
}

function validTwoAdjacent(n) {
  const doubles = adj
    .map(double => ({ num: double[0], idx: n.indexOf(double) }))
    .filter(v => v.idx >= 0)
  const validDoubles = doubles
    .filter(({ num, idx }) => idx === 4 || n[idx+2] !== num)

  return validDoubles.length > 0
}

function day4b(a,b) {
  function check(i) {
    return increasing(i) && validTwoAdjacent(i)
  }

  var i = a
  var res = 0
  while(i <= b) {
    if (check(''+i)) {
      res += 1
    }
    i+=1
  }
  console.log(res)
}

day4a(193651, 649729)
day4b(193651, 649729)
