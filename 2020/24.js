const input = require('./24.input.js')
const ArrayOps = require('../utils/arrayOps')

function getDest(line) {
  //console.dir(line)
  let x = 0
  let y = 0
  const moves = {
    e: [1, 0],
    se: [.5, .5],
    sw: [-.5, .5],
    w: [-1, 0],
    nw: [-.5, -.5],
    ne: [.5, -.5],
  }
  for (let i = 0; i < line.length; i++) {
    let next = line[i]
    if (next == 's' || next == 'n') {
      i++
      next += line[i]
    }
    //console.dir(next)
    const [dx, dy] = moves[next]
    x += dx
    y += dy
  }
  //console.dir({x,y})
  return [x,y].join(',')
}

function dayA(src, exp) {
  const results = {}
  src
    .split('\n')
    .map(getDest)
    .forEach(res => results[res] = !results[res])
  //console.dir(results)

  let res = Object.values(results).filter(v => v).length

  console.log(`Expected ${exp} - Got ${res} - ${exp == res}`)
}

function getNeighbours(coords) {
  const [x,y] = coords.split(',').map(Number)
  const neighbours = [
    [1, 0], [.5, .5], [-.5, .5],
    [-1, 0], [-.5, -.5], [.5, -.5],
  ].map(([dx,dy]) => [x+dx, y+dy].join(','))
  return neighbours
}

function dayB(src, exp) {
  const days = 100
  let tiles = new Map()
  src
    .split('\n')
    .map(getDest)
    .forEach(lineRes => tiles.set(lineRes, !tiles.get(lineRes)))
  //console.dir(tiles)
  for (let k of tiles.keys()) {
    if (!tiles.get(k)) tiles.delete(k)
  }

  for (let i = 1; i <= days; i++) {
    const nextTiles = new Map()

    tiles.forEach((value, key) => {
      const neighbours = getNeighbours(key)
      const nbBlack = neighbours.map(p => !!tiles.get(p)).filter(v => v).length
      //console.dir(`${key} -> ${neighbours.join('|')} -> ${nbBlack}`)
      nextTiles.set(key, value ? (nbBlack == 1 || nbBlack == 2) : (nbBlack == 2))

      neighbours.forEach(nb => {
        if (!nextTiles.has(nb)) {
          const nbNeighbours = getNeighbours(nb)
          const nnBlack = nbNeighbours.map(p => !!tiles.get(p)).filter(v => v).length
          //console.dir(`${nb} -> ${nbNeighbours.join('|')}-> ${nnBlack}`)
          nextTiles.set(nb, tiles.get(nb) ? (nnBlack == 1 || nnBlack == 2) : (nnBlack == 2))
        }
      })
    })

    tiles = nextTiles
    for (let k of tiles.keys()) {
      if (!tiles.get(k)) tiles.delete(k)
    }

    console.dir(`day ${i}: ${tiles.size}`)
  }

  let res = tiles.size

  console.log(`Expected ${exp} - Got ${res} - ${exp == res}`)
}

const test = `sesenwnenenewseeswwswswwnenewsewsw
neeenesenwnwwswnenewnwwsewnenwseswesw
seswneswswsenwwnwse
nwnwneseeswswnenewneswwnewseswneseene
swweswneswnenwsewnwneneseenw
eesenwseswswnenwswnwnwsewwnwsene
sewnenenenesenwsewnenwwwse
wenwwweseeeweswwwnwwe
wsweesenenewnwwnwsenewsenwwsesesenwne
neeswseenwwswnwswswnw
nenwswwsewswnenenewsenwsenwnesesenew
enewnwewneswsewnwswenweswnenwsenwsw
sweneswneswneneenwnewenewwneswswnese
swwesenesewenwneswnwwneseswwne
enesenwswwswneneswsenwnewswseenwsese
wnwnesenesenenwwnenwsewesewsesesew
nenewswnwewswnenesenwnesewesw
eneswnwswnwsenenwnwnwwseeswneewsenese
neswnwewnwnwseenwseesewsenwsweewe
wseweeenwnesenwwwswnew`

console.dir('PART A')
//dayA(test, 10)
//dayA(input, 382)

console.dir('PART B')
//dayB(test, 2208)
dayB(input, 3964)
