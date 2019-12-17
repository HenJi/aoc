const input = require('./16.input.js')

const ArrayOps = require('../utils/arrayOps')

function day16a(src, phases, exp){
  let signal = src.split('').map(Number)

  const basePattern = { 0: 0, 1: 1, 2: 0, 3: -1 }
  function mult(phase, idx) {
    const base = Math.floor((idx+1) / (phase+1)) % 4
    return basePattern[base]
  }

  for (let phase = 0; phase < phases; phase++) {
    let next = []
    //console.dir(phase)
    //console.dir(signal)

    signal.forEach( (_, nb) => {
      let calc = 0
      signal.slice(nb).forEach( (d, idx) => {
        calc = calc + d * mult(nb, idx+nb)
      })
      const added = Math.abs(calc % 10)

      next.push(added)
    })
    signal = next
  }

  console.dir(signal.join('').slice(0,8))
  exp && console.dir(exp)
}

function day16b(src, phases, nbRepeat, exp){
  const offset = +src.slice(0,7)

  function repeat(src, times) {
    return ArrayOps.init(times).map(_ => src).join('')
  }
  const signal = repeat(src, nbRepeat).split('').map(Number).reverse()

  const target = signal.length - offset
  let res = {}
  ArrayOps.init(phases+1).forEach(i => res[i] = 0)

  console.dir(target)
  let n = 0
  let res100 = []
  while (res100.length < target) {
    for (let phase = 0; phase < phases; phase++) {
      if (phase === 0) {
        res[phase] = (res[phase] + signal[n]) % 10
      } else {
        const next = (res[phase-1]+res[phase]) % 10
        res[phase] = next
        if (phase === 99) {
          res100.push(next)
        }
      }
    }
    n++
  }
  console.dir(res100.slice(0).reverse().slice(0, 8).join(''))
  exp && console.dir(exp)
}

day16a(input, 100, '23135243')
day16b(input, 100, 10000, '21130597')

if (false) {
  day16a('12345678', 2, '34040438')
  day16a('80871224585914546619083218645595', 100, '24176176')
  day16a('19617804207202209144916044189917', 100, '73745418')
  day16a('69317163492948606335995924319873', 100, '52432133')
}

if (false) {
  day16b('03036732577212944063491565474664', 100, 10000, '84462026')
  day16b('02935109699940807407585447034323', 100, 10000, '78725270')
  day16b('03081770884921959731165446850517', 100, 10000, '53553731')
}
