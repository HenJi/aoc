const input = require('./19.input.js')
const ArrayOps = require('../utils/arrayOps')

function runTest(rules, rule, tested) {
  const chars = tested.split('')
  let options = rule.split(' | ').map(opt => opt.split(' '))

  const incomplete = (option, idx) => option[idx][0] !== '"'

  for (let i = 0; i < chars.length; i++) {
    options = options.filter(o => o.length > i && o.length <= chars.length)
    while (options.find(o => incomplete(o, i)) !== undefined) {
      let nextOptions = options.map( option => {
        const raw = option.map((e, j) => (e[0] === '"' || j !== i) ? e : rules.get(e))
        let res = raw[0].split(' | ')
        raw.slice(1)
        .forEach(e => {
          if (e.indexOf(' | ') > 0) {
            const [l,r] = e.split(' | ')
            res = [
              ...res.map(v => v + ' ' + l),
              ...res.map(v => v + ' ' + r),
            ]
          } else {
            res = res.map(v => v + ' ' + e)
          }
        })
        return res
      })
      let optionsSet = new Set(ArrayOps.flatten(nextOptions))
      options = Array.from(optionsSet)
        .map(l => l.split(' '))
        .filter(l => (l[i][0] !== '"') ? true : l[i][1] === chars[i])
    }
  }

  return options.length > 0
}

function dayA(src, exp) {
  let [rulesLst, tests] = src.split('\n\n')

  rulesLst = rulesLst.split('\n')
  let rules = new Map()
  rulesLst.forEach(l => {
    const [num, detail] = l.split(': ')
    rules.set(num, detail)
  })

  tests = tests.split('\n')

  const valid = tests.filter(t => runTest(rules, rules.get('0'), t))
  const res = valid.length

  console.log(`Expected ${exp} - Got ${res}`)
}

function dayB(src, exp) {
  let [rulesLst, tests] = src.split('\n\n')

  rulesLst = rulesLst.split('\n')
  let rules = new Map()
  rulesLst.forEach(l => {
    const [num, detail] = l.split(': ')
    rules.set(num, detail)
  })
  rules.set('8', '42 | 42 8')
  rules.set('11', '42 31 | 42 11 31')

  tests = tests.split('\n')

  const valid = tests.filter(t => runTest(rules, rules.get('0'), t))
  const res = valid.length

  console.log(`Expected ${exp} - Got ${res}`)
}

const test = `0: 4 1 5
1: 2 3 | 3 2
2: 4 4 | 5 5
3: 4 5 | 5 4
4: "a"
5: "b"

ababbb
bababa
abbbab
aaabbb
aaaabbb`

console.dir('PART A')
dayA(test, 2)
dayA(input, 241)

console.dir('PART B')

const testB = `0: 8 11
1: "a"
10: 23 14 | 28 1
11: 42 31
12: 24 14 | 19 1
13: 14 3 | 1 12
14: "b"
15: 1 | 14
16: 15 1 | 14 14
17: 14 2 | 1 7
18: 15 15
19: 14 1 | 14 14
2: 1 24 | 14 4
20: 14 14 | 1 15
21: 14 1 | 1 14
22: 14 14
23: 25 1 | 22 14
24: 14 1
25: 1 1 | 1 14
26: 14 22 | 1 20
27: 1 6 | 14 18
28: 16 1
3: 5 14 | 16 1
31: 14 17 | 1 13
4: 1 1
42: 9 14 | 10 1
5: 1 14 | 15 1
6: 14 14 | 1 14
7: 14 5 | 1 21
8: 42
9: 14 27 | 1 26

aaaabbaaaabbaaa`
const more = `
abbbbbabbbaaaababbaabbbbabababbbabbbbbbabaaaa
bbabbbbaabaabba
babbbbaabbbbbabbbbbbaabaaabaaa
aaabbbbbbaaaabaababaabababbabaaabbababababaaa
bbbbbbbaaaabbbbaaabbabaaa
bbbababbbbaaaaaaaabbababaaababaabab
ababaaaaaabaaab
ababaaaaabbbaba
baabbaaaabbaaaababbaababb
abbbbabbbbaaaababbbbbbaaaababb
aaaaabbaabaaaaababaa
aaaabbaabbaaaaaaabbbabbbaaabbaabaaa
babaaabbbaaabaababbaabababaaab
aabbbbbaabbbaaaaaabbbbbababaaaaabbaaabba`

//dayA(testB+more, 3)
dayB(testB, 0)
dayB(testB+more, 12)
dayB(input, 424)
// less than 430
