const input = require('./2.input.js')

function day2a(strSrc) {
  let src = strSrc.split(',').map(n => +n)
  src[1] = 12
  src[2] = 2
  let i = 0
  while (src[i] !== 99) {
    const op = src[i]
    const a1 = src[src[i+1]]
    const a2 = src[src[i+2]]
    const dest = src[i+3]
    src[dest] = op === 1 ? a1 + a2 : a1 * a2
    i = i + 4
  }
  console.dir(src[0])
}

function day2b(res, srcStr) {
  function inner(a, b) {
    let src = srcStr.split(',').map(n => +n)
    src[1] = a
    src[2] = b
    let i = 0
    while (src[i] !== 99) {
      const op = src[i]
      const a1 = src[src[i+1]]
      const a2 = src[src[i+2]]
      const dest = src[i+3]
      src[dest] = op === 1 ? a1 + a2 : a1 * a2
      i = i + 4
    }
    return src[0]
  }
  let v1 = 0
  let v2 = 0
  let sub = inner(v1, v2)
  while (sub !== res) {
    v1 = (v1 + 1) % 100
    v2 = v1 === 0 ? v2 + 1 : v2
    sub = inner(v1, v2)
  }
  console.dir((100 * v1) + v2)
}

day2a(input)
day2b(19690720, input)
