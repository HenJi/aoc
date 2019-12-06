const [w1, w2] = require('./3.input.js')

const ArrayOps = require('../utils/arrayOps.js')
const VectorOps = require('../utils/vectorOps.js')

// Not my first solutions - but waaaaaay faster and cleaner
function getVectors(line) {
  function unzip(x0, y0, line, res) {
    if (line.length === 0) {
      return res
    }
    const inst = line[0]
    const dir = inst[0]
    const size = +(inst.slice(1))
    const [dx, dy] =
      dir === "R" ? [1, 0]
      : dir === "L" ? [-1, 0]
      : dir === "U" ? [0, 1]
      : [0, -1]
    const added = { x0, y0, dx, dy, size }
    return unzip(x0+dx*size, y0+dy*size, line.slice(1), res.concat(added))
  }
  return unzip(0, 0, line.split(','), [])
}

function day3aVectors(line1Src, line2Src) {
  const vectors1 = getVectors(line1Src)
  const vectors2 = getVectors(line2Src)

  const interSects = vectors1.map(v => {
    // for each vector in v1, get thoses in v2 that intersect it
    const filtered = vectors2.filter(v2 => VectorOps.checkIntersect(v, v2))
    if (filtered.length > 0) {
      return [v, filtered]
    } else {
      return undefined
    }
  }).filter(v => v !== undefined)
    .map(([v, intersections]) => intersections.map(i => VectorOps.getIntersectionPoint(v, i)))
    .reduce((acc, v) => acc.concat(v), [])
    .map(({ x, y }) => Math.abs(x) + Math.abs(y))
    .filter(v => v > 0)

  console.dir(Math.min(...interSects))
}

function day3bVectors(line1Src, line2Src) {
  function addOffsets(v, i, table) {
    v.offset =
      i === 0 ? 0
      : table[i-1].offset + table[i-1].size
    table[i] = v
  }

  let vectors1 = getVectors(line1Src)
  vectors1.forEach(addOffsets)
  let vectors2 = getVectors(line2Src)
  vectors2.forEach(addOffsets)

  const interSects = vectors1
  .map(v => {
    // for each vector in v1, get thoses in v2 that intersect it
    const filtered = vectors2.filter(v2 => VectorOps.checkIntersect(v, v2))
    if (filtered.length > 0) {
      return [v, filtered]
    } else {
      return undefined
    }
  })
  .filter(v => v !== undefined)
  .map(([v, intersections]) => intersections.map(i =>  {
    const point = VectorOps.getIntersectionPoint(v, i)
    const dv = v.dx === 0 ? (point.y - v.y0) / v.dy : (point.x - v.x0) / v.dx
    const di = i.dx === 0 ? (point.y - i.y0) / i.dy : (point.x - i.x0) / i.dx
    return v.offset + i.offset + dv + di
  }))
  .reduce((acc, v) => acc.concat(v), [])
  .filter(v => v > 0)
  console.dir(Math.min(...interSects))
}

// My initial quick to write and dirty slow solutions
function getCases(line) {
  function unzip(x, y, line, steps, res) {
    if (line.length === 0) {
      return res.slice(1) // Remove 1st element to avoid initial 0,0 collision
    }
    const inst = line[0]
    const dir = inst[0]
    const dist = +(inst.slice(1))
    const [dx, dy] =
      dir === "R" ? [1, 0]
      : dir === "L" ? [-1, 0]
      : dir === "U" ? [0, 1]
      : [0, -1]
    const added = ArrayOps.init(dist).map(i => [(x+dx*i)+','+(y+dy*i), steps + i])
    return unzip(x+dx*dist, y+dy*dist, line.slice(1), steps+dist, res.concat(added))
  }
  return unzip(0, 0, line.split(','), 0, [])
}

function day3a(line1Src, line2Src) {
  function computeDist(caseStr) {
    const [x,y] = caseStr.split(',')
    return Math.abs(+x) + Math.abs(+y)
  }

  const cases1 = getCases(line1Src).map(v => v[0])
  const cases2 = getCases(line2Src).map(v => v[0])
  const common = cases1.filter(v1 => cases2.indexOf(v1) >= 0)
  const dists = common.map(computeDist)
  console.dir(Math.min(...dists))
}

function day3b(line1Src, line2Src) {
  function getCommon(l1, l2, res) {
    if (l1.length === 0) {
      return res
    }
    const cur = l1[0]
    const dup = l2.find(v => v[0] === cur[0])
    if (dup === undefined) {
      return getCommon(l1.slice(1), l2, res)
    } else {
      return getCommon(l1.slice(1), l2, res.concat(cur[1]+dup[1]))
    }
  }
  const cases1 = getCases(line1Src)
  const cases2 = getCases(line2Src)
  const filt1 = cases1.filter(v => cases2.find(t => v[0] === t[0]) !== undefined)
  const filt2 = cases2.filter(v => filt1.find(t => v[0] === t[0]) !== undefined)

  const common = getCommon(filt1, filt2, []).filter(v => v > 0)
  console.dir(Math.min(...common))
}

day3aVectors(w1, w2)
// day3a(w1, w2)
day3bVectors(w1, w2)
// day3b(w1, w2)

/*
console.dir('Tests for slow versions')
const tw1 = 'R75,D30,R83,U83,L12,D49,R71,U7,L72'
const tw2 = 'U62,R66,U55,R34,D71,R55,D58,R83'
day3a(tw1, tw2)
day3aVectors(tw1, tw2)
day3b(tw1, tw2)
day3bVectors(tw1, tw2)
*/
