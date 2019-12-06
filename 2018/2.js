const input = require('./2.input.js')

function day2a(src) {
  const words = src.split('\n')
  const { twos, threes } = words.reduce((acc, word) => {
    const letters = word.split('')
    const counts = Object.values(letters.reduce((acc, l) => ({ ...acc, [l]: (acc[l] || 0) + 1 }), {}))
    return {
      twos: acc.twos + (counts.indexOf(2) >= 0 ? 1 : 0),
      threes: acc.threes + (counts.indexOf(3) >= 0 ? 1 : 0),
    }
  }, { twos: 0, threes: 0 })
  console.dir(twos * threes)
}

function diffs(w1, w2) {
  let diffs = 0
  let i = 0
  while (i < w1.length && diffs < 2) {
    if (w1[i] !== w2[i]) {
      diffs += 1
    }
    i += 1
  }
  //console.dir(w1 + ' ' + w2 + ' ' + diffs)
  return diffs
}

function commons(w1, w2) {
  let res = ''
  let i = 0
  while (i < w1.length) {
    if (w1[i] === w2[i]) {
      res += w1[i]
    }
    i += 1
  }
  return res
}

function day2b(src) {
  const words = src.split('\n').sort()
  let testedIdx = 0
  let curWord = words[testedIdx]
  let subIdx = testedIdx + 1
  let res = ''
  while (res === '' && testedIdx < words.length) {
    const subWord = words[subIdx]
    if (diffs(curWord, subWord) < 2) {
      res = subWord
    } else {
      subIdx = (subIdx + 1) % words.length
      if (subIdx === 0) {
        testedIdx += 1
        curWord = words[testedIdx]
        subIdx = testedIdx + 1
      }
    }
  }
  console.dir(commons(curWord, res))
}

day2a(input)
day2b(input)
/*
day2b(`abcde
fghij
klmno
pqrst
fguij
axcye
wvxyz`)
*/
