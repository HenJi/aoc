const input = require('./20.input.js')
const ArrayOps = require('../utils/arrayOps')
const StringOps = require('../utils/stringOps')

function reverse(s){
  return s.split("").reverse().join("")
}

function flip(tile){
  return [
    reverse(tile[0]),
    reverse(tile[3]),
    reverse(tile[2]),
    reverse(tile[1]),
  ]
}

function dayA(src, exp) {
  let tiles = {}

  const sideMap = {}

  src.split('\n\n').forEach(t => {
    const content = t.split('\n')
    const id = +content[0].split(' ')[1].split(':')[0]
    const data = content.slice(1)
    const sides = [
      data[0],
      data.map(l => l.slice(-1)[0]).join(''),
      reverse(data.slice(-1)[0]),
      reverse(data.map(l => l[0]).join('')),
    ]
    const flipd = flip(sides)

    sides.forEach(s => {sideMap[s] = (sideMap[s] || 0) +1 })
    flipd.forEach(s => {sideMap[s] = (sideMap[s] || 0) +1 })

    tiles[id] = { sides, flipd }
  })
  //console.dir(tiles)
  //console.dir(Object.keys(tiles).length + ' tiles')

  const uniques = Object.entries(tiles).map( ([id, {sides, flipd}]) => {
    const uSides = sides.filter(s => sideMap[s] === 1).length
    const uFlipd = flipd.filter(s => sideMap[s] === 1).length
    return { id: +id, uSides, uFlipd }
  }).filter(({ id, uSides, uFlipd }) => uSides == 2 || uFlipd == 2)
  //console.dir(sideMap)

  //console.dir(uniques)

  let res = ArrayOps.product(uniques.map(u => u.id))

  console.log(`Expected ${exp} - Got ${res} - ${exp == res}`)
}

function hasAll(target, tested) {
  return target.find(v => tested.indexOf(v) < 0) === undefined
}

function buildGrid(neighboursObj, imgSize) {
  let neighbours = Object.entries(neighboursObj).map(([k,n]) => ([+k,n]))
  //console.dir(neighbours)

  const corners = neighbours.filter(([k,n]) => n.length === 2)

  let placed = new Set()
  let grid = {}

  for (let x = 0; x < imgSize; x++) {
    for (let y = 0; y < imgSize; y++) {
      //console.dir(grid)
      let found = undefined

      if (x === 0 && y === 0) {
        found = corners[0][0]
      } else {
        const curNext = [
          grid[[x-1,y].join(',')],
          grid[[x,y-1].join(',')],
          grid[[x+1,y].join(',')],
          grid[[x,y+1].join(',')],
        ].filter(v => v !== undefined)

        const valid = neighbours
          .filter(([key, ns]) => hasAll(curNext, ns))
        valid.sort(([a],[b]) => neighboursObj[a].filter(v => !placed.has(v)).length - neighboursObj[b].filter(v => !placed.has(v)).length)

        found = valid[0][0]
      }
      neighbours = neighbours.filter(([k]) => k !== found)
      placed.add(found)
      grid[[x,y].join(',')] = found
    }
  }
  return grid
}

function flipTile(tile) {
  //console.dir('FLIP')
  //console.dir(tile)
  const { id, sides, flipd, data } = tile
  const fData = data.map(reverse)
  return { id, sides: flipd, flipd: sides, data: fData }
}

function rotateData(data) {
  const w = data.length
  return ArrayOps.init(w).map(x => ArrayOps.init(w).map(y => data[w-1-y][x]).join(''))
}

function rotateTile(tile) {
  //console.dir('ROTATE')
  //console.dir(tile)
  const { id, sides, data } = tile
  const rSides = [...sides.slice(-1), ...sides.slice(0,3)]
  const rFlipd = flip(rSides)
  const rData = rotateData(data)
  return { id, sides: rSides, flipd: rFlipd, data: rData }
}

function placeFirst(first, second, third) {
  //console.log('--------------')
  //console.dir(first)
  //console.dir(second)
  //console.dir(third)
  let common = first.sides.find(s => second.flipd.indexOf(s) >= 0)

  if (common === undefined) {
    second = flipTile(second)
    common = first.sides.find(s => second.flipd.indexOf(s) >= 0)
  }
  let commonIdx = first.sides.indexOf(common)
  while (commonIdx !== 1) {
    first = rotateTile(first)
    commonIdx = first.sides.indexOf(common)
  }
  commonIdx = second.flipd.indexOf(common)
  while (commonIdx !== 1) {
    second = rotateTile(second)
    commonIdx = second.flipd.indexOf(common)
  }

  if (third.flipd.indexOf(first.sides[2]) < 0 && third.sides.indexOf(first.sides[2]) < 0) {
    return placeFirst(flipTile(first), second, third)
  } else {
    //console.dir(first)
    //console.dir(second)
    //console.dir(third)
    return first
  }
}

function placeRight(left, right) {
  const common = left.sides[1]
  let idx = right.flipd.indexOf(common)
  if (right.flipd.indexOf(common) < 0) {
    right = flipTile(right)
    idx = right.flipd.indexOf(common)
  }

  while (idx !== 1) {
    right = rotateTile(right)
    idx = right.flipd.indexOf(common)
  }
  return right
}

function placeBelow(top, bot) {
  /*
  console.log('BELOW')
  console.dir(top)
  console.dir(bot)
  */
  const common = top.sides[2]
  let idx = bot.flipd.indexOf(common)
  if (bot.flipd.indexOf(common) < 0) {
    bot = flipTile(bot)
    idx = bot.flipd.indexOf(common)
  }

  while (idx !== 0) {
    bot = rotateTile(bot)
    idx = bot.flipd.indexOf(common)
  }
  return bot
}

function trimData(data) {
  return data.slice(1,-1).map(l => l.substr(1,8))
}

function patternIndex(line, pattern, startIndex) {
  let res = -1
  let i = startIdx
  while (i < line.length && res < 0) {
    const applied = pattern.map(j => line[i+j])
    if (pattern.indexOf('.') < 0) {
      res = i
    }
    i++
  }
  return res
}

function findMonsters(image) {
  //console.dir(image)
  const size = image.length
  let monster = [
    '                  # ',
    '#    ##    ##    ###',
    ' #  #  #  #  #  #   ',
  ].map(l => l.split('').map((c,i) => [c,i]).filter(([c,i]) => c === '#').map(([c,i]) => i))
  .map((l, y) => l.map(x => ({ x, y })))
  monster = ArrayOps.flatten(monster)
  //console.dir(monster)

  function checkMonster(x0, y0) {
    const sub = monster.map(({ x, y }) => image[y0+y][x0+x])
    //console.dir(sub)
    return sub.indexOf('.') < 0
  }

  //console.dir(checkMonster(2,2))
  let positions = []
  for (let x = 0; x < size-19; x++) {
    for (let y = 0; y < size-3; y++) {
      //console.dir({ x, y, test: checkMonster(x, y) })
      if (checkMonster(x, y)) {
        positions.push({ x, y})
      }
    }
  }
  //console.dir(positions)
  if (positions.length === 0) {
    return -1
  }
  let res = image.map(l => l.split(''))
  positions.forEach(({ x: x0, y: y0 }) => {
    monster.map(({ x, y }) => res[y0+y][x0+x] = 'O')
  })
  res = res.map(l => l.join('')).join('')
  return StringOps.occurrences(res, '#')
}

function dayB(src, exp) {
  let tiles = {}

  const sideMap = {}

  src.split('\n\n').forEach(t => {
    const content = t.split('\n')
    const id = +content[0].split(' ')[1].split(':')[0]
    const data = content.slice(1)
    const sides = [
      data[0],
      data.map(l => l.slice(-1)[0]).join(''),
      reverse(data.slice(-1)[0]),
      reverse(data.map(l => l[0]).join('')),
    ]
    const flipd = flip(sides)

    sides.forEach(s => {sideMap[s] = [...(sideMap[s] || []), id] })
    flipd.forEach(s => {sideMap[s] = [...(sideMap[s] || []), id] })

    tiles[id] = { id, sides, flipd, data }
  })
  //console.dir(tiles)
  //console.dir(Object.keys(tiles).length + ' tiles')
  const imgSize = Math.sqrt(Object.keys(tiles).length)

  const neighboursObj = {}
  Object.values(sideMap)
    .filter(d => d.length === 2)
    .forEach(([a,b]) => {
      neighboursObj[a] = ArrayOps.uniques([ ...(neighboursObj[a] || []), b ])
      neighboursObj[b] = ArrayOps.uniques([ ...(neighboursObj[b] || []), a ])
    })

  // Build grid
  const grid = buildGrid(neighboursObj, imgSize)
  //console.dir(grid)

  // Get first 2 element orientation
  const first = tiles[grid['0,0']]
  const second = tiles[grid['0,1']]
  const third = tiles[grid['1,0']]

  const correctFirst = placeFirst(first, third, second)

  const gridContent = {
    '0,0': correctFirst,
  }

  for (let x = 0; x < imgSize; x++) {
    for (let y = 0; y < imgSize; y++) {
      //console.dir(gridContent)
      //console.dir({ x, y })
      if (x == 0 && y == 0) {
        // ignore
      } else if (y === 0) {
        // Check left tile
        const res = placeRight(gridContent[[x-1,y].join(',')], tiles[grid[[x,y].join(',')]])
        //console.dir(res)
        gridContent[[x,y].join(',')] = res
      } else {
        // Check upper tile
        const res = placeBelow(gridContent[[x,y-1].join(',')], tiles[grid[[x,y].join(',')]])
        //console.dir(res)
        gridContent[[x,y].join(',')] = res
      }
    }
  }
  //console.dir(gridContent)
  let fullContent = []

  for (let y = 0; y < imgSize; y++) {
    for (let x = 0; x < imgSize; x++) {
      const tile = gridContent[[x,y].join(',')]
      const trimmed = trimData(tile.data)
      if (x === 0) {
        fullContent[y] = trimmed
      } else {
        fullContent[y] = fullContent[y].map((l, i) => l+trimmed[i])
      }
    }
  }
  fullContent = ArrayOps.flatten(fullContent)

  function flipData(data){
    return data.map(reverse)
  }
  const flipFull = flipData(fullContent)

  const res = [
    fullContent,
    rotateData(fullContent),
    rotateData(rotateData(fullContent)),
    rotateData(rotateData(rotateData(fullContent))),
    flipFull,
    rotateData(flipFull),
    rotateData(rotateData(flipFull)),
    rotateData(rotateData(rotateData(flipFull))),
  ].map(findMonsters).find(r => r > 0)

  console.log(`Expected ${exp} - Got ${res} - ${exp == res}`)
}

/*
1951    2311    3079
2729    1427    2473
2971    1489    1171
*/

const test = `Tile 2311:
..##.#..#.
##..#.....
#...##..#.
####.#...#
##.##.###.
##...#.###
.#.#.#..##
..#....#..
###...#.#.
..###..###

Tile 1951:
#.##...##.
#.####...#
.....#..##
#...######
.##.#....#
.###.#####
###.##.##.
.###....#.
..#.#..#.#
#...##.#..

Tile 1171:
####...##.
#..##.#..#
##.#..#.#.
.###.####.
..###.####
.##....##.
.#...####.
#.##.####.
####..#...
.....##...

Tile 1427:
###.##.#..
.#..#.##..
.#.##.#..#
#.#.#.##.#
....#...##
...##..##.
...#.#####
.#.####.#.
..#..###.#
..##.#..#.

Tile 1489:
##.#.#....
..##...#..
.##..##...
..#...#...
#####...#.
#..#.#.#.#
...#.#.#..
##.#...##.
..##.##.##
###.##.#..

Tile 2473:
#....####.
#..#.##...
#.##..#...
######.#.#
.#...#.#.#
.#########
.###.#..#.
########.#
##...##.#.
..###.#.#.

Tile 2971:
..#.#....#
#...###...
#.#.###...
##.##..#..
.#####..##
.#..####.#
#..#.#..#.
..####.###
..#.#.###.
...#.#.#.#

Tile 2729:
...#.#.#.#
####.#....
..#.#.....
....#..#.#
.##..##.#.
.#.####...
####.#.#..
##.####...
##..#.##..
#.##...##.

Tile 3079:
#.#.#####.
.#..######
..#.......
######....
####.#..#.
.#...#.##.
#.#####.##
..#.###...
..#.......
..#.###...`

console.dir('PART A')
dayA(test, 20899048083289)
dayA(input, 15003787688423)

console.dir('PART B')
dayB(test, 273)
dayB(input, 1705)
