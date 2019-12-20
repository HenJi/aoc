const input = require('./20.input.js')
const ArrayOps = require('../utils/arrayOps')

const deltas = [[1,0], [0,-1], [0,1], [-1,0]]
const pp = p => `${p.x},${p.y},${p.z||0}`
const fp = p => {
  const [x, y, z] = p.split(',')
  return { x:+x, y:+y, z:+z }
}

function isPortal(portals) {
  return function({x, y, z}){
    const pIn = portals.find(p => p.x === x && p.y === y)
    if (pIn !== undefined) {
      const pOut = portals.find(p => p.id === pIn.id && p !== pIn)
      return { ...pOut.path, z: z+pIn.dz }
    } else return undefined
  }
}

function isOpen(grid) {
  return function({x, y}){
    return grid[x] !== undefined && grid[x][y] !== undefined && grid[x][y] === '.'
  }
}

function computeShortestPath(a, b, testOpen, testPortal) {
  const target = pp(b)

  let distances = {
    [pp(a)]: { depth: 0, prev: undefined }
  }
  let tips = [a]
  let depth = 0
  while (distances[target] === undefined && tips.length > 0) {
    depth++
    let nexts = ArrayOps.flatten(
      tips.map(({ x, y, z }) => deltas.map(([dx, dy]) => {
        const point = { x:x+dx, y:y+dy, z }
        const mbPortal = testPortal(point)
        if (mbPortal && mbPortal.z < 0) {
          return a
        } else return { ...(mbPortal || point), prev: pp({x,y,z}) }
      }))
    ).filter(p => distances[pp(p)] === undefined)
     .filter(testOpen)
    nexts.forEach(p => distances[pp(p)] = { depth, prev: p.prev })
    tips = nexts
  }
  return distances
}

function day20a(src, exp) {
  let grid = {}
  let portalsData = []

  src.split('\n').forEach( (line, y) => {
    line.split('').forEach((c, x) => {
      let point = { x, y, data: c }
      if (grid[x] === undefined) {
        grid[x] = {}
      }
      if (c !== ' ') {
        grid[x][y] = c
        if (c !== '.' && c !== '#') {
          portalsData.push(point)
        }
      }
    })
  })

  let entrance = undefined
  let exit = undefined
  let portals = []
  portalsData.forEach( ({ x, y, data }) => {
    let path = undefined
    let other = undefined
    deltas.forEach(([dx, dy]) => {
      if (grid[x+dx] !== undefined) {
        const next = grid[x+dx][y+dy]
        if (next === '.') {
          path = { x: x+dx, y: y+dy }
        } else if (next !== undefined) {
          other = next
        }
      }
    })
    if (path !== undefined && other !== undefined) {
      const id = [data, other].sort().join('')

      if (id === 'AA') {
        entrance = { ...path, z: 0 }
      } else if (id === 'ZZ') {
        exit = { ...path, z: 0 }
      } else {
        portals.push({ x, y, path, id, dz: 0 })
      }
    }
  })
  console.dir({ entrance, exit, portals: portals.map(p => ({ ...p, path: pp(p.path) })) })

  const res = computeShortestPath(entrance, exit, isOpen(grid), isPortal(portals))
  console.dir(res[pp(exit)])

  exp && console.dir(exp)
}

function day20b(src, exp) {
  let grid = {}
  let portalsData = []

  let maxX = 0
  let maxY = 0
  src.split('\n').forEach( (line, y) => {
    maxY = Math.max(maxY, y)
    line.split('').forEach((c, x) => {
      maxX = Math.max(maxX, x)
      let point = { x, y, data: c }
      if (grid[x] === undefined) {
        grid[x] = {}
      }
      if (c !== ' ') {
        grid[x][y] = c
        if (c !== '.' && c !== '#') {
          portalsData.push(point)
        }
      }
    })
  })

  let entrance = undefined
  let exit = undefined
  let portals = []
  portalsData.forEach( ({ x, y, data }) => {
    let path = undefined
    let other = undefined
    deltas.forEach(([dx, dy]) => {
      if (grid[x+dx] !== undefined) {
        const next = grid[x+dx][y+dy]
        if (next === '.') {
          path = { x: x+dx, y: y+dy }
        } else if (next !== undefined) {
          other = next
        }
      }
    })
    if (path !== undefined && other !== undefined) {
      const id = [data, other].sort().join('')

      if (id === 'AA') {
        entrance = { ...path, z: 0 }
      } else if (id === 'ZZ') {
        exit = { ...path, z: 0 }
      } else {
        let dz = x === 1 || y === 1 || x === maxX-1 || y === maxY-1 ? -1 : 1
        portals.push({ x, y, path, id, dz })
      }
    }
  })
  //console.dir({ entrance, exit, portals: portals.map(p => ({ ...p, path: pp(p.path) })) })

  const res = computeShortestPath(entrance, exit, isOpen(grid), isPortal(portals))
  
  if (false) {
    let path = []
    let prev = res[pp(exit)]
    while (prev !== undefined) {
      path.push(prev)
      prev = res[prev.prev]
    }
    path.reverse()
    path.forEach(e => console.dir(e))
  }

  console.dir(res[pp(exit)])
  
  exp && console.dir(exp)
}

day20a(input, 454)
day20b(input, 5744)

if (false) {
  day20a(
`         A           
         A           
  #######.#########  
  #######.........#  
  #######.#######.#  
  #######.#######.#  
  #######.#######.#  
  #####  B    ###.#  
BC...##  C    ###.#  
  ##.##       ###.#  
  ##...DE  F  ###.#  
  #####    G  ###.#  
  #########.#####.#  
DE..#######...###.#  
  #.#########.###.#  
FG..#########.....#  
  ###########.#####  
             Z       
             Z       `, 23)

  day20a(
`                   A               
                   A               
  #################.#############  
  #.#...#...................#.#.#  
  #.#.#.###.###.###.#########.#.#  
  #.#.#.......#...#.....#.#.#...#  
  #.#########.###.#####.#.#.###.#  
  #.............#.#.....#.......#  
  ###.###########.###.#####.#.#.#  
  #.....#        A   C    #.#.#.#  
  #######        S   P    #####.#  
  #.#...#                 #......VT
  #.#.#.#                 #.#####  
  #...#.#               YN....#.#  
  #.###.#                 #####.#  
DI....#.#                 #.....#  
  #####.#                 #.###.#  
ZZ......#               QG....#..AS
  ###.###                 #######  
JO..#.#.#                 #.....#  
  #.#.#.#                 ###.#.#  
  #...#..DI             BU....#..LF
  #####.#                 #.#####  
YN......#               VT..#....QG
  #.###.#                 #.###.#  
  #.#...#                 #.....#  
  ###.###    J L     J    #.#.###  
  #.....#    O F     P    #.#...#  
  #.###.#####.#.#####.#####.###.#  
  #...#.#.#...#.....#.....#.#...#  
  #.#####.###.###.#.#.#########.#  
  #...#.#.....#...#.#.#.#.....#.#  
  #.###.#####.###.###.#.#.#######  
  #.#.........#...#.............#  
  #########.###.###.#############  
           B   J   C               
           U   P   P               `, 58)
}

false && day20b(
`         A           
         A           
  #######.#########  
  #######.........#  
  #######.#######.#  
  #######.#######.#  
  #######.#######.#  
  #####  B    ###.#  
BC...##  C    ###.#  
  ##.##       ###.#  
  ##...DE  F  ###.#  
  #####    G  ###.#  
  #########.#####.#  
DE..#######...###.#  
  #.#########.###.#  
FG..#########.....#  
  ###########.#####  
             Z       
             Z       `, 26)

false && day20b(
`             Z L X W       C                 
             Z P Q B       K                 
  ###########.#.#.#.#######.###############  
  #...#.......#.#.......#.#.......#.#.#...#  
  ###.#.#.#.#.#.#.#.###.#.#.#######.#.#.###  
  #.#...#.#.#...#.#.#...#...#...#.#.......#  
  #.###.#######.###.###.#.###.###.#.#######  
  #...#.......#.#...#...#.............#...#  
  #.#########.#######.#.#######.#######.###  
  #...#.#    F       R I       Z    #.#.#.#  
  #.###.#    D       E C       H    #.#.#.#  
  #.#...#                           #...#.#  
  #.###.#                           #.###.#  
  #.#....OA                       WB..#.#..ZH
  #.###.#                           #.#.#.#  
CJ......#                           #.....#  
  #######                           #######  
  #.#....CK                         #......IC
  #.###.#                           #.###.#  
  #.....#                           #...#.#  
  ###.###                           #.#.#.#  
XF....#.#                         RF..#.#.#  
  #####.#                           #######  
  #......CJ                       NM..#...#  
  ###.#.#                           #.###.#  
RE....#.#                           #......RF
  ###.###        X   X       L      #.#.#.#  
  #.....#        F   Q       P      #.#.#.#  
  ###.###########.###.#######.#########.###  
  #.....#...#.....#.......#...#.....#.#...#  
  #####.#.###.#######.#######.###.###.#.#.#  
  #.......#.......#.#.#.#.#...#...#...#.#.#  
  #####.###.#####.#.#.#.#.###.###.#.###.###  
  #.......#.....#.#...#...............#...#  
  #############.#.#.###.###################  
               A O F   N                     
               A A D   M                     `, 396)
