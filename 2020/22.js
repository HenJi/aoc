const input = require('./22.input.js')
const ArrayOps = require('../utils/arrayOps')
//const Deque = require('../utils/Deque')

function dayA(src, exp) {
  let [da, db] = src.split('\n\n')
  da = da.split('\n').slice(1).map(Number)
  db = db.split('\n').slice(1).map(Number)

  while (da.length > 0 && db.length > 0) {
    //console.dir(da)
    //console.dir(db)
    const na = da[0]
    const nb = db[0]
    if (na > nb) {
      da = [ ...da.slice(1), na, nb ]
      db = db.slice(1)
    } else {
      da = da.slice(1)
      db = [ ...db.slice(1), nb, na ]
    }
  }
  //console.dir(da)
  //console.dir(db)
  const resDeck = da.length > 0 ? da : db
  resDeck.reverse()

  let res = 0
  resDeck.forEach((c,i) => res += c*(1+i))


  console.log(`Expected ${exp} - Got ${res} - ${exp == res}`)
}

var outcomes = new Map()

function runGame(pp1, pp2) {
  const game = `${pp1} vs ${pp2}`
  if (outcomes.has(game)) {
    //console.dir(`Rerun game ${game}`)
    return outcomes.get(game)
  }
  //console.dir(`Running game ${game}`)
  let p1 = pp1.slice()
  let p2 = pp2.slice()
  let round = 1

  var seen = new Set()
  while (p1.length > 0 && p2.length > 0) {
    const c1 = p1[0]
    const c2 = p2[0]

    /*
    console.log(`-- Round ${round} --`)
    console.dir(`Player 1's deck: `+p1.join(','))
    console.dir(`Player 2's deck: `+p2.join(','))
    console.dir(`${c1} vs ${c2}`)
    */

    let match = `${p1} vs ${p2}`
    if (seen.has(match)) {
      p2 = []
    } else {
      seen.add(match)
      if (p1.length > c1 && p2.length > c2) {
        const [winner] = runGame(p1.slice(1, c1+1), p2.slice(1, c2+1))
        if (winner === 1) {
          p1 = [ ...p1.slice(1), c1, c2 ]
          p2 = p2.slice(1)
        } else {
          p1 = p1.slice(1)
          p2 = [ ...p2.slice(1), c2, c1 ]
        }
      } else if (c1 > c2) {
        p1 = [ ...p1.slice(1), c1, c2 ]
        p2 = p2.slice(1)
      } else {
        p1 = p1.slice(1)
        p2 = [ ...p2.slice(1), c2, c1 ]
      }
    }
    round++
  }
  const [winner, res] = p1.length > 0 ? [1, p1] : [2, p2]
  outcomes.set(game, [winner, res])
  return [winner, res]
}

function dayB(src, exp) {
  let [p1, p2] = src.split('\n\n')
  p1 = p1.split('\n').slice(1).map(Number)
  p2 = p2.split('\n').slice(1).map(Number)

  const [winner, resDeck] = runGame(p1, p2)
  resDeck.reverse()

  let res = 0
  resDeck.forEach((c,i) => res += c*(1+i))

  console.log(`Expected ${exp} - Got ${res} - ${exp == res}`)
}

const test = `Player 1:
9
2
6
3
1

Player 2:
5
8
4
7
10`

const test2 = `Player 1:
43
19

Player 2:
2
29
14`

console.dir('PART A')
//dayA(test, 306)
//dayA(input, 33631)

console.dir('PART B')
//dayB(test, 291)
//dayB(test2, 105)
dayB(input, 33469)
