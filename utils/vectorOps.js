/*
  expected interface for vector
  {
    x0: number
    y0: number
    dx: number
    dx: number
    size: number
  }
*/

function checkIntersect(v1, v2) {
  const interSectX =
    (v1.x0 <= v2.x0 && v1.x0+(v1.dx*v1.size) >= v2.x0+(v2.dx*v2.size))
    || (v1.x0 >= v2.x0 && v1.x0+(v1.dx*v1.size) <= v2.x0+(v2.dx*v2.size))
  const interSectY =
    (v1.y0 <= v2.y0 && v1.y0+(v1.dy*v1.size) >= v2.y0+(v2.dy*v2.size))
    || (v1.y0 >= v2.y0 && v1.y0+(v1.dy*v1.size) <= v2.y0+(v2.dy*v2.size))
  return interSectX && interSectY
}

function split(v) {
  const half = Math.ceil(v.size/2)
  const v1 = { ...v, size: half-1 }
  const v2 = { ...v, x0: v.x0+v.dx*half, y0: v.y0+v.dy*half, size: v.size - half }
  return [v1, v2]
}

function getIntersectionPoint(v1, v2) {
  // v1 and v2 must intersect
  if (v1.size === 0) {
    return { x: v1.x0, y:v1.y0 }
  } else if (v2.size === 0) {
    return { x: v2.x0, y:v2.y0 }
  } else {
    const [v11, v12] = split(v1)
    const [v21, v22] = split(v2)
    const [s1, s2] = [[v11, v21], [v11, v22], [v12, v21], [v12, v22]]
      .find(([a, b]) => checkIntersect(a, b))
    return getIntersectionPoint(s1, s2)
  }
}

function print(v) {
  return v.x0 + ',' + v.y0 + ';' + v.dx + ',' + v.dy + ';' + v.size
}

module.exports = {
  checkIntersect,
  split,
  getIntersectionPoint,
  print,
}
