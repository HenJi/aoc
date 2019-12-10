const input = require('./10.input.js')
const ArrayOps = require('../utils/arrayOps')

const LOGS = false

function pgcd(a,b){
  if (a === 0) return b
  if (b === 0) return a
	while (a!=b) { (a>b) ? a -= b : b -= a }
	return a;
}

function day10a(src) {
  const asteroids = ArrayOps.flatten(src.split('\n').map(
    (line, y) => line.split('')
    .map((content, x) => ({ content, x, y }))
    .filter(c => c.content === '#')
  ))

  let astMap = {}
  asteroids.forEach(({x,y}) => { astMap[x] = (astMap[x] || new Set()).add(y) })
  //console.dir(asteroids)
  //console.dir(astMap)

  function isVisible(center, target) {
    LOGS && console.dir(target)
    const dx = target.x - center.x
    const dy = target.y - center.y
    const div = pgcd(Math.abs(dx), Math.abs(dy))
    if (div === 0) {
      return false // center === target
    } else if (div === 1) {
      return true
    } else {
      let blocked = false
      let i = 1
      while (!blocked && i < div) {
        const tx = center.x + (dx * i / div)
        const ty = center.y + (dy * i / div)
        blocked = blocked || (astMap[tx] && astMap[tx].has(ty))
        if (blocked) {
          LOGS && console.dir('Blocked by '+tx+','+ty)
        }
        i++
      }
      return !blocked
    }
  }
  function computeVisible(center) {
    return asteroids.filter(a => isVisible(center, a)).length
  }
  const res = asteroids.map(a => ({ x:a.x, y:a.y, v:computeVisible(a)})).sort((a,b) => b.v-a.v)
  return res[0]
}

function day10b(targetCount, src) {
  const baseStation = day10a(src)
  LOGS && console.dir(baseStation)

  const asteroids = ArrayOps.flatten(src.split('\n').map(
    (line, y) => line.split('')
    .map((content, x) => ({ content, x, y }))
    .filter(c => c.content === '#')
    .map(a => ({ x: a.x, y: a.y }))
  )).filter(a => a.x !== baseStation.x || a.y !== baseStation.y)

  function getAngle(center, target) {
    const dx = target.x - center.x
    const dy = center.y - target.y
    const dist = Math.sqrt(dx*dx + dy*dy)

    let angle = Math.atan2(dx, dy)
    angle = angle >= 0 ? angle : 2*Math.PI + angle
    return { angle: Math.round(angle*10000), dist }
  }
  const angled = asteroids
    .map(a => ({ ...a, ...getAngle(baseStation, a) }))

  let angleMap = {}
  angled.forEach(a => {
    angleMap[a.angle] = (angleMap[a.angle] || []).concat(a).sort((a,b) => a.dist - b.dist)
  })
  let angles = ArrayOps.uniques(angled.map(a => a.angle)).sort((a,b) => a-b)
  LOGS && console.dir(angles)
  LOGS && console.dir(angleMap)

  let last = undefined
  let count = 0
  let i = 0
  while (count < targetCount) {
    const angle = angles[i]
    const targets = angleMap[angle]
    if (targets.length > 0) {
      count++
      last = targets[0]
      LOGS && console.dir(count)
      LOGS && console.dir(count+': '+last.x + ',' + last.y + ' ' + last.angle)
      angleMap[angle] = angleMap[angle].slice(1)
    }
    i = (i+1) % angles.length
  }
  console.dir(last.x*100+last.y)
}

console.dir(day10a(input))

false && day10a(`.#..#
.....
#####
....#
...##`)

false && day10a(`......#.#.
#..#.#....
..#######.
.#.#.###..
.#..#.....
..#....#.#
#..#....#.
.##.#..###
##...#..#.
.#....####`)

day10b(200,input)

false && day10b(200,`.#..##.###...#######
##.############..##.
.#.######.########.#
.###.#######.####.#.
#####.##.#.##.###.##
..#####..#.#########
####################
#.####....###.#.#.##
##.#################
#####.##.###..####..
..######..##.#######
####.##.####...##..#
.#####..#.######.###
##...#.##########...
#.##########.#######
.####.#.###.###.#.##
....##.##.###..#####
.#.#.###########.###
#.#.#.#####.####.###
###.##.####.##.#..##`)
