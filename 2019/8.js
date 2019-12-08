const input = require('./8.input.js')
const ArrayOps = require('../utils/arrayOps')

const LOGS = false

function countOccurences(str, q) {
  return (str.match(new RegExp(q, 'g')) || []).length
}

function day8a(w, h, data) {
  const nbLayers = data.length / (w*h)
  const layers = ArrayOps.init(nbLayers)
    .map(l => data.slice(l*w*h, (l+1)*w*h))

  const fewest0 = layers
    .map(layer => ({ layer, zeroes: countOccurences(layer, 0) }))
    .sort((a,b) => a.zeroes - b.zeroes)[0].layer

  console.dir(countOccurences(fewest0, 1) * countOccurences(fewest0, 2))

  if (LOGS) {
    console.dir(fewest0)
    console.dir(countOccurences(fewest0, 1))
    console.dir(countOccurences(fewest0, 2))

    layers.forEach((l, i) => {
      console.dir('layer '+i)
      console.dir(l)
      console.dir('')
    })
  }
}

function superpose(l2, l1) {
  // l1 is placed OVER l2
  let res = l2.split('')
  for (let i = 0; i < l1.length; i++) {
    const p1 = +l1[i]
    const p2 = +l2[i]
    res[i] = p1 === 2 ? p2 : p1
  }
  return res.join('')
}

function day8b(w, h, data) {
  const nbLayers = data.length / (w*h)
  const layers = ArrayOps.init(nbLayers)
    .map(l => data.slice(l*w*h, (l+1)*w*h))
    .reverse()
  const finalDraw = layers.reduce(superpose, layers[0])
    .replace(/0/g, ' ').replace(/1/g, '\u2666')
  for (let j = 0; j < h; j++) {
    console.dir(finalDraw.slice(j*w, (j+1)*w))
  }
}

//day8a(3, 2, '123456789012')
day8a(25, 6, input)

//day8b(2, 2, '0222112222120000')
day8b(25, 6, input)
