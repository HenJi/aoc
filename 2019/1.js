const input = require('./1.input.js')

function computeFuel(weight) {
  const base = Math.floor(weight / 3)
  return base - 2
}

function day1a(src) {
  const lines = src.split('\n')
  const res = lines.map(computeFuel).reduce(function(acc, v){ return acc + v }, 0)
  console.dir(res)
}

function computeFuelFuel(total, added) {
  const addedFuel = computeFuel(added)
  if (addedFuel <= 0) {
    return total + added
  } else {
    return computeFuelFuel(total + added, addedFuel)
  }
}

function day1b(src) {
  const lines = src.split('\n')
  const res = lines.map(computeFuel).map(function(f){ return computeFuelFuel(0, f) }).reduce(function(acc, v){ return acc + v }, 0)
  console.dir(res)
}

day1a(input)
day1b(input)
