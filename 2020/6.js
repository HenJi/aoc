const input = require('./6.input.js')

function dayA(src, exp) {
  console.dir('PART A')

  function countAnswers(group) {
    const letters = new Set(group.split(''))
    letters.delete('\n')
    return letters.size
  }

  const groups = src.split('\n\n')
  //console.dir(groups.map(countAnswers))
  const res = groups.map(countAnswers).reduce((a, b) => a + b)

  console.log(`Expected ${exp} - Got ${res}`)
}

function dayB(src, exp) {
  console.dir('PART B')

  function countAnswers(group) {
    const answers = group.split('\n').map(a => new Set(a.split('')))
    const common = answers.reduce((acc, ans) => new Set([...acc].filter(x => ans.has(x))))
    return common.size
  }

  const groups = src.split('\n\n')
  //console.dir(groups.map(countAnswers))
  const res = groups.map(countAnswers).reduce((a, b) => a + b, 0)

  console.log(`Expected ${exp} - Got ${res}`)
}

const test = `abc

a
b
c

ab
ac

a
a
a
a

b`

dayA(test, 11)
dayA(input, 6742)

dayB(test, 6)
dayB(input, 3447)
