const ArrayOps = require('../utils/arrayOps')
const Deque = require('../utils/Deque')

const LOGS = false

function pad(n) {
  return ('   '+n).slice(-3)
}

function day9a(players, marbles, exp) {
  let scores = ArrayOps.init(players).map(p => 0)
  let game = [0]
  let idx = 0
  let next = 1
  let player = -1
  while (next <= marbles) {
    (next % 10000 === 0) && console.dir(next)
    LOGS && console.dir(`[${pad(player)}]` + game.map((n,i) => i === idx ? `${pad('('+n)})` : pad(n) +' ').join(''))
    if (next % 23 === 0) {
      idx = (idx - 7 + game.length) % game.length
      scores[player] += next + game[idx]
      game.splice(idx, 1)
    } else {
      idx = (idx + 2) % game.length
      game.splice(idx, 0, next)
    }
    next += 1
    player = (player + 1) % players
  }
  const res = Math.max(...scores)
  console.dir(`Got ${res} - Exp ${exp}`)
}



function day9b(players, marbles, exp) {
  let scores = ArrayOps.init(players).map(p => 0)
  let game = new Deque()
  game.append(0)
  let idx = 0
  let next = 1
  let player = -1
  while (next <= marbles) {
    LOGS && game.print()
    if (next % 23 === 0) {
      game.rotate(-7)
      scores[player] += next + game.pop()
    } else {
      game.rotate(2)
      game.append(next)
    }
    next += 1
    player = (player + 1) % players
  }
  const res = Math.max(...scores)
  console.dir(`Got ${res} - Exp ${exp}`)
}

day9b(430, 71588, 422748)
day9b(430, 7158800, 3412522480)

if (false) {
  day9b(9, 25, 32)
  day9b(10, 1618, 8317)
  day9b(13, 7999, 146373)
  day9b(17, 1104, 2764)
  day9b(21, 6111, 54718)
  day9b(30, 5807, 37305)
}
