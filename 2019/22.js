const input = require('./22.input.js')

const ArrayOps = require('../utils/arrayOps')

const LOGS = false

function day22a(instructions, size, searched, exp) {
  let deck = ArrayOps.init(size)

  instructions.split('\n').forEach( i => {
    LOGS && console.dir(deck)
    //console.dir(i)
    if (i.indexOf('new stack') > 0) {
      LOGS && console.dir(`reverse`)
      deck.reverse()
    } else if (i.indexOf('increment') > 0) {
      const nb = +i.split('increment ')[1]
      LOGS && console.dir(`increment ${nb}`)
      let res = ArrayOps.init(size)
      deck.forEach( (card, j) => res[(nb*j) % size] = card )
      deck = res
    } else if (i.indexOf('cut') === 0) {
      const nb = +i.split('ut ')[1]
      LOGS && console.dir(`cut ${nb}`)
      deck = deck.slice(nb).concat(deck.slice(0, nb))
    } else {
      console.dir('Unknown op '+i)
    }
  })
  LOGS && console.dir(deck)

  console.dir(deck.indexOf(searched))

  exp && console.dir(exp)
}

function day22b(instructions, size, repeated, index, exp) {
  let res = index

  for (let k = 0; k < repeated; k++) {
    if (k % 10000 === 0) {
      // console.dir(k)
    }

    instructions.split('\n').reverse().forEach( i => {
      if (i.indexOf('new stack') > 0) {
        LOGS && console.dir(`reverse`)
        res = size - res - 1
      } else if (i.indexOf('increment') > 0) {
        const nb = +i.split('increment ')[1]
        LOGS && console.dir(`increment ${nb}`)
        let found = false
        let j = 0
        let t = 0
        while (!found) {
          if (t === res) {
            found = true
            res = j
          }
          t = (t + nb) % size
          j++
        }
      } else if (i.indexOf('cut') === 0) {
        const nb = +i.split('ut ')[1]
        LOGS && console.dir(`cut ${nb}`)
        res = (res + nb + size) % size
      } else {
        console.dir('Unknown op '+i)
      }
    })
  }
  console.dir(res)

  exp && console.dir(exp)
}

day22a(input, 10007, 2019, 8502)

//day22b(input, 119315717514047, 101741582076661, 2020)

day22b(input, 10007, 1, 8502, 2019)

false && day22a(`deal into new stack
cut -2
deal with increment 7
cut 8
cut -4
deal with increment 7
cut 3
deal with increment 9
deal with increment 3
cut -1`, 10, 8, 3)

false && day22a(`deal into new stack
cut -2
deal with increment 7
cut 4
deal with increment 7
cut 3
deal with increment 7
cut -1`, 10, 8, 3)
