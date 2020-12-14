const input = require('./1.input.js')

function day1a(src, target) {
  const data = src.split('\n').map(Number)
  const len = data.length

  for (var i = 0; i < len-1; i++) {
    for (var j = i+1; j < len; j++) {
      if (data[i] + data[j] === target) {
        console.log(data[i] * data[j])
      }
    }
  }
}

function day1b(src, target) {
  const data = src.split('\n').map(Number)
  const len = data.length

  for (var i = 0; i < len-2; i++) {
    for (var j = i+1; j < len-1; j++) {
      for (var k = j+1; k < len; k++) {
        if (data[i] + data[j] + data[k] === target) {
          console.log(data[i] * data[j] * data[k])
        }
      }
    }
  }
}

const test = `1721
979
366
299
675
1456`

//day1a(test, 2020)
day1a(input, 2020)

//day1b(test, 2020)
day1b(input, 2020)
