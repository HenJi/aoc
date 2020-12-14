const input = require('./10.input.js')
const ArrayOps = require('../utils/arrayOps')

function dayA(src, exp) {
  const volts = src.split('\n').map(Number)
  volts.sort((a, b) => a - b)
  //console.dir(volts)
  const voltage = Math.max(...volts) + 3

  let ones = 0
  let twos = 0
  let threes = 1
  let prev = 0
  volts.forEach( v => {
    const delta = v-prev
    if (delta === 1) {
      ones += 1
    } else if (delta === 2) {
      twos += 1
    } else if (delta === 3) {
      threes += 1
    } else {
      console.dir('?')
    }
    prev = v
  })
  console.dir([ones, twos, threes])
  let res = ones * threes

  console.log(`Expected ${exp} - Got ${res}`)
}

function dayB(src, exp) {
  const jolts = src.split('\n').map(Number)
  jolts.sort((a, b) => a - b)

  function testSet(set) {
    //console.dir(set)
    let mixes = ArrayOps.init(set.length).map(_ => 0)
    mixes[0] = 1

    for (let i = 0; i < set.length; i++) {
      for (let j = i + 1; j < set.length; j++) {
        if (set[j] - set[i] > 3) break;
        mixes[j] += mixes[i];
      }
    }
    //console.dir(ways)

    return ways[set.length-1]
  }


  const rating = Math.max(...jolts) + 3
  const outlet = 0
  const res = testSet([outlet, ...jolts, rating])

  console.log(`Expected ${exp} - Got ${res}`)
}

const test1 = `1
4
5
6
7
10
11
12
15
16
19`

const test2 = `1
2
3
4
7
8
9
10
11
14
17
18
19
20
23
24
25
28
31
32
33
34
35
38
39
42
45
46
47
48
49`

/*
console.dir('PART A')
dayA(test1, 7*5)
dayA(test2, 22*10)
dayA(input, 2482)
*/

console.dir('PART B')
dayB(test1, 8)
dayB(test2, 19208)
dayB(input)
