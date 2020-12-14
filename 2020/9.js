const input = require('./9.input.js')
const ArrayOps = require('../utils/arrayOps')

function dayA(src, windo, exp) {
  const numbers = src.split('\n').map(Number)

  let res = undefined

  for (var i = windo; i < numbers.length; i++) {
    const tested = numbers[i]
    const data = numbers.slice(i-windo, i)
    //console.dir([tested, data])

    let isSum = false
    for (var j = 0; j < windo-1; j++) {
      for (var k = j+1; k < windo; k++) {
        if (data[j] + data[k] === tested) {
          isSum = true
        }
      }
    }
    if (!isSum) {
      res = tested
    }
  }

  console.log(`Expected ${exp} - Got ${res}`)
}

function dayB(src, target, exp) {
  const numbers = src.split('\n').map(Number)

  const testSlice = (start, stop) => ArrayOps.sum(numbers.slice(start, stop))
  let res = undefined

  let a = 0
  let b = 2

  while (res === undefined) {
    const slice = testSlice(a, b)
    if (slice === target) {
      const resSlice = numbers.slice(a,b)
      res = Math.max(...resSlice) + Math.min(...resSlice)
    } else if (slice < target) {
      b += 1
    } else {
      a += 1
    }
  }

  console.log(`Expected ${exp} - Got ${res}`)
}

const test = `35
20
15
25
47
40
62
55
65
95
102
117
150
182
127
219
299
277
309
576`

console.dir('PART A')
dayA(test, 5, 127)
dayA(input, 25, 375054920)

console.dir('PART B')
dayB(test, 127, 62)
dayB(input, 375054920, 54142584)
