const LOGS = false
const NumOps = require('../utils/numOps')

const input = `<x=15, y=-2, z=-6>
<x=-5, y=-4, z=-11>
<x=0, y=-6, z=0>
<x=5, y=9, z=6>`

function readLine(line) {
  const [tx, ty, tz] = line.replace(/,/g, '').replace('<', '').replace('>', '').split(' ')
  return {
    x: +tx.split('=')[1],
    y: +ty.split('=')[1],
    z: +tz.split('=')[1],
    vx: 0,
    vy: 0,
    vz: 0,
  }
}

function applySpeed(ast) {
  ast.x += ast.vx
  ast.y += ast.vy
  ast.z += ast.vz
  return ast
}

function computeEnergy(ast) {
  const pot = Math.abs(ast.x) + Math.abs(ast.y) + Math.abs(ast.z)
  const kine = Math.abs(ast.vx) + Math.abs(ast.vy) + Math.abs(ast.vz)
  return pot * kine
}

function day12a(steps, src, exp) {
  let positions = src.split('\n').map(readLine)

  function updateSpeeds(ast, i) {
    const others = positions.filter((_, j) => j !== i)
    function deltaC(f) {
      const curC = f(ast)
      const otherC = others.map(f)
      return otherC.reduce((res, oC) =>
        curC > oC ? res-1
        : curC < oC ? res+1
        : res
      ,0)
    }
    return {
      ...ast,
      vx: ast.vx + deltaC(a => a.x),
      vy: ast.vy + deltaC(a => a.y),
      vz: ast.vz + deltaC(a => a.z),
    }
  }

  let i = 0
  while (i < steps) {
    LOGS && console.dir(`--- STEP ${i} ---`)
    LOGS && console.dir(positions)

    positions = positions.map(updateSpeeds)
    positions = positions.map(applySpeed)
    i++
  }
  LOGS && console.dir(`--- STEP ${i} ---`)
  LOGS && console.dir(positions)

  const energy = positions.map(computeEnergy)
  const res = energy.reduce((acc, v) => acc+v, 0)
  console.dir(res)
  exp && console.dir(`exp: ${exp}`)
}

function day12b(src, exp) {
  let positions = src.split('\n').map(readLine)

  function updateSpeeds(ast, i) {
    const others = positions.filter((_, j) => j !== i)
    function deltaC(f) {
      const curC = f(ast)
      const otherC = others.map(f)
      return otherC.reduce((res, oC) =>
        curC > oC ? res-1
        : curC < oC ? res+1
        : res
      ,0)
    }
    ast.vx += deltaC(a => a.x)
    ast.vy += deltaC(a => a.y)
    ast.vz += deltaC(a => a.z)
    return ast
  }
  function print(p) {
    return p.map(a => `${a.x}:${a.y}:${a.z} ${a.vx}:${a.vy}:${a.vz}`).join(' ')
  }

  const initial = print(positions)
  let i = 0

  while (i === 0 || print(positions) !== initial) {
    if (i % 100000 === 0) {
      console.log(i)
    }
    LOGS && console.dir(`--- STEP ${i} ---`)
    LOGS && console.dir(positions)

    positions = positions.map(updateSpeeds)
    positions = positions.map(applySpeed)
    i++
  }
  LOGS && console.dir(`--- STEP ${i} ---`)
  LOGS && console.dir(positions)

  console.dir(i)
  exp && console.dir(`exp: ${exp}`)
}



function day12bo(src, exp) {
  const positions = src.split('\n').map(readLine)
  function buildDataband(fp, fv) {
    return {
      p: positions.map(a => fp(a)),
      v: positions.map(a => fv(a)),
    }
  }
  const data = [
    buildDataband(a => a.x, a => a.vx),
    buildDataband(a => a.y, a => a.vy),
    buildDataband(a => a.z, a => a.vz),
  ]
  function tick(b) {
    const dv = b.p.map((c, i, o) =>
      o.filter((_, j) => j != i)
        .reduce((res, n) => c > n ? res-1 : c < n ? res+1 : res, 0)
    )
    b.v = b.v.map((vv,i) => vv+dv[i])
    b.p = b.p.map((pp,i) => pp+b.v[i])
  }

  function print(b) {
    return b.p.join(',')+':'+b.v.join(',')
  }

  function getBandLoop(b) {
    const init = print(b)
    let local = Object.assign({}, b)
    let i = 0
    while (i === 0 || print(local) !== init) {
      tick(local)
      i++
    }
    return i
  }

  const loops = data.map(getBandLoop)
  console.dir(loops)
  const res = NumOps.lcm(loops)
  console.dir(res)
  exp && console.dir(`exp: ${exp} ${exp === res}`)
}

// day12a(1000, input)
false && day12a(10, `<x=-1, y=0, z=2>
<x=2, y=-10, z=-7>
<x=4, y=-8, z=8>
<x=3, y=5, z=-1>`, 179)

day12bo(input, 326489627728984)
if (false) {
  day12bo(`<x=-1, y=0, z=2>
<x=2, y=-10, z=-7>
<x=4, y=-8, z=8>
<x=3, y=5, z=-1>`, 2772)
  day12bo(`<x=-8, y=-10, z=0>
<x=5, y=5, z=10>
<x=2, y=-7, z=3>
<x=9, y=-8, z=-3>`, 4686774924)
}
