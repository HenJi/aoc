const input = require('./1.input.js')

function day1a(src) {
  const freqs = src.split('\n').map(n => +n)
  const res = freqs.reduce((acc, n) => acc + n, 0)
  console.dir(res)
}

function day1b(src) {
  const freqs = src.split('\n').map(n => +n)
  const reached = new Set()

  let cur = 0
  let idx = 0
  while (!reached.has(cur)) {
    reached.add(cur)
    cur = cur + freqs[idx]
    idx = (idx + 1) % (freqs.length)
  }
  console.dir(cur)

  /* JS has no tail rec optim - so this blows up call stack size
  function test(remaining, curTotal) {
    if (remaining.length === 0) {
      return test(freqs, curTotal)
    } else {
      const newTotal = curTotal + remaining[0]
      console.dir(newTotal + ' ' + reached.size)
      if (reached.has(newTotal)) {
        console.dir('Duplicate found: '+newTotal)
      } else {
        reached.add(newTotal)
        return test(remaining.slice(1), newTotal)
      }
    }
  }
  test(freqs, 0)
  */
}

day1a(input)
day1b(input)

//day1b('+3\n+3\n+4\n-2\n-4')
//day1b('+7\n+7\n-2\n-7\n-4')
