const input = require('./6.input.js')

const ArrayOps = require('../utils/arrayOps.js')

function day6a(src){
  const infos = src.split('\n').map(s => s.split(')'))
  const orbiting = new Set( infos.map(s => s[1]) )

  const orbitMap = infos.reduce((res, data) => {
    res[data[0]] = [ ...(res[data[0]] || []), data[1]]
    return res
  }, {})

  const bodies = Object.keys(orbitMap)
  const rootBodies = bodies.filter(b => !orbiting.has(b)) // Should be length 1

  function computeOrbits(nodes, depth, res) {
    if (nodes.length === 0) {
      return res
    } else {
      const nextNodes = ArrayOps.flatten(nodes.map(n => orbitMap[n]))
      return computeOrbits(nextNodes, depth+1, res + (nextNodes.length * depth))
    }
  }
  const res = computeOrbits(rootBodies, 1, 0)
  console.dir(res)
}

function day6b(src){
  const infos = src.split('\n').map(s => s.split(')'))
  const orbiting = new Set( infos.map(s => s[1]) )

  const orbitMap = infos.reduce((res, data) => {
    res[data[0]] = [ ...(res[data[0]] || []), data[1]]
    return res
  }, {})
  const orbitingMap = infos.reduce((res, data) => {
    res[data[1]] = data[0]
    return res
  }, {})

  var visited = new Set()
  function computeJumps(nodes, res) {
    if (nodes.indexOf('SAN') >= 0) {
      return res - 2 // we count the nodes, -2 for links
    } else {
      nodes.forEach(n => visited.add(n))
      const nextNodes = ArrayOps.flatten(nodes.map(
        n => ArrayOps.flatten([orbitMap[n], orbitingMap[n]]).filter(nn => !visited.has(nn))
      ))
      return computeJumps([ ...new Set(nextNodes)], res + 1)
    }
  }
  const res = computeJumps(['YOU'], 0)
  console.dir(res)
}

day6a(input)
day6b(input)
