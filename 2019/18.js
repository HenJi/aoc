const input = require('./18.input.js')
const inputb = require('./18.inputb.js')

const ArrayOps = require('../utils/arrayOps')
const GridOps = require('../utils/gridOps')

const deltas = [[1,0], [0,-1], [0,1], [-1,0]]
const pp = p => `${p.x},${p.y}`
const fp = p => {
  const [x, y] = p.split(',')
  return { x:+x, y:+y }
}
function computeReachable(a, isAvailable, isDoor, initDistances = undefined, initDepth = undefined, initTips = undefined) {
  let distances = { ...initDistances } || { [a.x]: { [a.y]: 0 } }
  let doors = []
  let tips = initTips ||[a]
  let depth = initDepth || 0

  while (tips.length > 0) {
    depth++
    let nexts = ArrayOps.uniques(ArrayOps.flatten(
      tips.map(({ x, y }) => deltas.map(([dx, dy]) => pp({ x:x+dx, y:y+dy })) )
    )).map(fp)
      .filter(p => distances[p.x] === undefined || distances[p.x][p.y] === undefined)
      .filter(isAvailable).filter(p => !isDoor(p))

    nexts.forEach(p => {
      if (distances[p.x] === undefined) distances[p.x] = {}
      distances[p.x][p.y] = depth
    })
    tips = nexts
  }

  return distances
}

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
}
}

// vmdntqrghkazjeuboxlcpsfiyw -> 3646
let best = 364800
let aborted = 0
function computeSteps(position, steps, grid, path, keys, doors) {
  //console.dir({ position, steps, keys, doors: doors, path: path.join('') })
  function canPass({x, y}){ return grid[x] !== undefined && grid[x][y] !== '#' }
  function isDoor({x, y}){ return doors.find(d => d.x === x && d.y === y) !== undefined }

  if (keys.length === 0 || steps > best) {
    if (steps > best) {
      aborted++
    }
    if (steps < best) {
      best = steps
      console.dir(path.join('') + ' -> ' + steps)
      console.dir('Aborted '+aborted)
    }
    return steps
  } else {
    const reachable = computeReachable(position, canPass, isDoor)
    const reachableKeys = keys.map(
      k => ({ key: k, d: reachable[k.x] && reachable[k.x][k.y] })
    ).filter(kd => kd.d !== undefined)
    .sort((a, b) => a.d - b.d)
    //shuffleArray(reachableKeys)

    const totalSteps = reachableKeys.slice(0,2).map( ({ key, d }) =>
      computeSteps(
        key, steps+d, grid,
        [ ...path, key.data ],
        keys.filter(k => k.data !== key.data),
        doors.filter(k => k.data !== key.data.toUpperCase()))
    )
    return Math.min(...totalSteps)
  }
}

function day18a(src, exp) {
  let grid = {}
  let keys = []
  let doors = []
  let entrance = undefined
  src.split('\n').forEach( (line, y) => {
    line.split('').forEach((c, x) => {
      let point = { x, y, data: c }
      if (grid[x] === undefined) {
        grid[x] = {}
      }
      if (c === '@') {
        entrance = point
      } else if (c === '#') {
        grid[x][y] = '#'
      } else if (c !== '.') {
        if (c.toUpperCase() === c) doors.push(point)
        else keys.push(point)
      }
    })
  })

  const steps = computeSteps(entrance, 0, grid, [], keys, doors)
  console.dir(steps)

  exp && console.dir(exp)
}

function computeStepsB(positions, steps, dataMap, path, keys, doors) {
  //console.dir({ positions, steps, keys, doors: doors })
  //console.dir({ positions, steps, keys, doors })

  if (keys.length === 0 || steps > best) {
    if (steps > best) {
      aborted++
      //console.dir(path)
      aborted % 1000000 === 0 && console.dir('Aborted '+aborted)
    }
    if (steps < best) {
      console.dir(path + ' -> ' + steps)
      best = steps
    }
  } else {
    const reachableKeys = positions.map(position => {
      const datas = dataMap[pp(position)]
      const reachable = datas.filter( data =>
        data.doors.find(d => doors.find(dd => dd.data === d)) === undefined
      ).filter(k => keys.indexOf(k.key) >= 0)
      .sort((a, b) => a.d - b.d)
      return { position, reachable }
    })

    reachableKeys.forEach( ({ position, reachable }) =>
      reachable.slice(0,2).forEach( ({ key, d }) =>
        computeStepsB(
          [ key, ...positions.filter(p => p !== position) ],
          steps+d, dataMap, path+key.data,
          keys.filter(k => k.data !== key.data),
          doors.filter(k => k.data !== key.data.toUpperCase()))
      )
    )
  }
}

function computeReachableB(a, isAvailable, isDoor) {
  let distances = { [a.x]: { [a.y]: {steps: 0, doors: []} } }
  let doors = []
  let tips = [{ ...a, doors: [] }]
  let steps = 0

  while (tips.length > 0) {
    steps++
    const nexts = ArrayOps.flatten(
      tips.map(({ x, y, doors }) => deltas.map(([dx, dy]) => ({ x:x+dx, y:y+dy, doors })) )
    )
      .filter(p => distances[p.x] === undefined || distances[p.x][p.y] === undefined)
      .filter(isAvailable)
      .map(({ x, y, doors }) =>
        isDoor({x,y}) ? {x, y, doors: doors.concat(isDoor({x,y}).data)} : {x, y, doors}
      )

    nexts.forEach(({ x, y, doors }) => {
      if (distances[x] === undefined) distances[x] = {}
      distances[x][y] = { steps, doors }
    })
    tips = nexts
  }

  return distances
}

function day18b(src, exp) {
  //console.log(src)
  let grid = {}
  let keys = []
  let doors = []
  let entrances = []
  src.split('\n').forEach( (line, y) => {
    line.split('').forEach((c, x) => {
      let point = { x, y, data: c }
      if (grid[x] === undefined) {
        grid[x] = {}
      }
      if (c === '@') {
        entrances.push(point)
      } else if (c === '#') {
        grid[x][y] = '#'
      } else if (c !== '.') {
        if (c.toUpperCase() === c) doors.push(point)
        else keys.push(point)
      }
    })
  })

  let dataMap = []
  function canPass({x, y}){ return grid[x] !== undefined && grid[x][y] !== '#' }
  function isDoor({x, y}){ return doors.find(d => d.x === x && d.y === y) }

  [ ...entrances, ...keys ].forEach( point => {
    const reachable = computeReachableB(point, canPass, isDoor)
    const reachableKeys = keys
      .map( key => {
        const data = reachable[key.x] && reachable[key.x][key.y]
        if (data === undefined) {
          return undefined
        } else {
          return { key, d: data.steps, doors: data.doors }
        }
      })
      .filter(v => v !== undefined)
      .filter(v => v.d > 0)

    dataMap[pp(point)] = reachableKeys
  })
  computeStepsB(entrances, 0, dataMap, '', keys, doors)

  exp && console.dir(exp)
}

//day18b(input, 3646)
//best = 2780
best = 1789
day18b(inputb)
//'vmdnrgxltqhakzjeubocpsfiyw -> 1730'

if (false) {
  day18a(`#########
#b.A.@.a#
#########`, 8)
  day18a(`########################
#f.D.E.e.C.b.A.@.a.B.c.#
######################.#
#d.....................#
########################`, 86)
  day18a(`########################
#...............b.C.D.f#
#.######################
#.....@.a.B.c.d.A.e.F.g#
########################`, 132)
  day18a(`########################
#@..............ac.GI.b#
###d#e#f################
###A#B#C################
###g#h#i################
########################`, 81)
}
if (false) {
  day18a(`#################
#i.G..c...e..H.p#
########.########
#j.A..b...f..D.o#
########@########
#k.E..a...g..B.n#
########.########
#l.F..d...h..C.m#
#################`, 136)
}


if (false) {
  best = Infinity
  day18b(`#######
#a.#Cd#
##@#@##
#######
##@#@##
#cB#Ab#
#######`, 8)
  best = Infinity
  day18b(`#############
#DcBa.#.GhKl#
#.###@#@#I###
#e#d#####j#k#
###C#@#@###J#
#fEbA.#.FgHi#
#############`, 32)
  best = Infinity
  day18b(`#############
#g#f.D#..h#l#
#F###e#E###.#
#dCba@#@BcIJ#
#############
#nK.L@#@G...#
#M###N#H###.#
#o#m..#i#jk.#
#############`, 72)
}