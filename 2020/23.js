const input = '364297581'
const ArrayOps = require('../utils/arrayOps')
const Deque = require('../utils/Deque')

function shuffle(cups, nb) {
  //console.dir(cups)
  const cur = cups[0]
  const picked = cups.slice(1,4)
  //console.dir('picked '+picked)
  const remains = [...cups.slice(4), cur]
  let destination = ((cur+nb-2) % nb) + 1
  while (picked.indexOf(destination) >= 0) {
    destination = ((destination+nb-2) % nb) + 1
  }
  //console.dir('dest '+destination)
  let idxDest = remains.indexOf(destination)
  return [ ...remains.slice(0, idxDest+1), ...picked, ...remains.slice(idxDest+1) ]
}

function shuffleDeque(deque, log) {
  const nb = deque.count
  const cur = deque.head.value
  deque.rotate(1)
  const picked = [
    deque.pop(),
    deque.pop(),
    deque.pop(),
  ]
  const next = deque.head.value
  let destination = ((cur+nb-2) % nb) + 1
  while (picked.indexOf(destination) >= 0) {
    destination = ((destination+nb-2) % nb) + 1
  }
  while (deque.head.value !== destination) {
    deque.rotate(-1)
  }

  deque.rotate(1)
  deque.append(picked[2])
  deque.append(picked[1])
  deque.append(picked[0])
  while (deque.head.value !== next) {
    deque.rotate(1)
  }
  if (log) {
    console.dir('cur ' + cur + ' - picked ' + picked + ' - dest ' + destination)
  }
}

function dayA(src, moves, exp) {
  let cups = src.split('').map(Number)

  for (let i = 0; i < moves; i++) {
    cups = shuffle(cups, 9)
  }
  let one = cups.indexOf(1)
  console.dir(cups)
  let res = [...cups.slice(one+1), ...cups.slice(0, one)].join('')

  console.log(`Expected ${exp} - Got ${res} - ${exp == res}`)
}

function dayADeque(src, moves, exp) {
  let cups = src.split('').map(Number)
  const deque = new Deque()
  cups.reverse()
  cups.forEach(i => deque.append(i))

  for (let i = 0; i < moves; i++) {
    console.dir(` --- moves ${i} --- `)
    shuffleDeque(deque, true)
  }

  cups = deque.toList()
  let one = cups.indexOf(1)
  let res = [...cups.slice(one+1), ...cups.slice(0, one)].join('')

  console.log(`Expected ${exp} - Got ${res} - ${exp == res}`)
}

function dayB(src, exp) {
  let cups = src.split('').map(Number)
  const totalCups = 1000000

  const deque = new Deque()
  cups.reverse()
  cups.forEach(i => deque.append(i))

  for (let i = 10; i <= totalCups; i++) {
    deque.append(i)
    deque.rotate(1)
  }
  //deque.print()
  const moves = 10000000
  for (let i = 0; i < moves; i++) {
    //console.dir(deque.toList().slice(0,20))
    if (i%1000 === 0) {
      console.dir(i)
    }
    shuffleDeque(deque, i > 80000 && i%100 === 0)
  }

  while (deque.head.value !== 1) {
    deque.rotate(1)
  }
  const resValues = [
    deque.pop(),
    deque.pop(),
    deque.pop(),
  ]
  console.dir(resValues)
  let res = ArrayOps.product(resValues)

  console.log(`Expected ${exp} - Got ${res} - ${exp == res}`)
}

function dayB2(src, exp) {
  let cups = src.split('').map(Number)

  const steps = 10000000
  const nb = 1000000

  for (let i = Math.max(...cups) + 1; i <= nb; i++) {
    cups.push(i)
  }

  cups.forEach((v, i) => {
    cups[i] = { v }
  })
  cups.forEach((v, i) => {
    cups[i].n = i < cups.length - 1 ? cups[i + 1] : cups[0]
  })

  const vMap = new Map(cups.map((item) => [item.v, item]))

  let picked = cups[0]

  for (let i = 0; i < steps; i++) {
    if (i % 10000 === 0) {
      console.log("  " + (i / (steps / 100)).toFixed(2) + "%");
    }

    const extract = [picked.n.v, picked.n.n.v, picked.n.n.n.v]
    const firstExtracted = picked.n
    picked.n = picked.n.n.n.n

    let destination = ((picked.v+nb-2) % nb) + 1
    while (extract.includes(destination)) {
      destination = ((destination+nb-2) % nb) + 1
    }

    const dest = vMap.get(destination)
    firstExtracted.n.n.n = dest.n
    dest.n = firstExtracted

    picked = picked.n
  }

  const posOne = vMap.get(1)

  let res = posOne.n.v * posOne.n.n.v

  console.log(`Expected ${exp} - Got ${res} - ${exp == res}`)
}

const test = `389125467`

console.dir('PART A')
//dayA(test, 10, 92658374)
//dayA(test, 100, 67384529)
//dayA(input, 100, 47382659)
//dayADeque(input, 100, 47382659)

console.dir('PART B')
//dayB(test, 934001*159792)
//dayB2(test, 934001*159792)
dayB2(input, 42271866720)
