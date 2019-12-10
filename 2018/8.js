const input = require('./8.input.js')
const ArrayOps = require('../utils/arrayOps')

const testInput = `2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2`

function readNode(subData) {
  const nbChildren = subData[0]
  const nbData = subData[1]
  const body = subData.slice(2)
  let children = []
  let remaining = body
  ArrayOps.init(nbChildren).map(_ => {
    let nodeData = readNode(remaining)
    remaining = nodeData.remaining
    children.push(nodeData.node)
  })
  return {
    node: { children, metadata: remaining.slice(0, nbData) },
    remaining: remaining.slice(nbData),
  }
}

function day8a(src) {
  const data = src.split(' ').map(i => +i)
  const rootNode = readNode(data).node

  let res = 0
  let nodes = [rootNode]
  while (nodes.length > 0) {
    nodes.forEach( n =>
      res = n.metadata.reduce((acc, v) => acc + v, res)
    )
    nodes = ArrayOps.flatten(nodes.map(n => n.children))
  }
  console.dir(res)
}

function day8b(src) {
  const data = src.split(' ').map(i => +i)
  const rootNode = readNode(data).node

  function computeValue(n) {
    if (n.children.length === 0) {
      return n.metadata.reduce((acc, v) => acc + v, 0)
    } else {
      const subValues = n.metadata.map(i => n.children[i-1]).filter(v => v !== undefined)
      return subValues.map(computeValue).reduce((acc, v) => acc + v, 0)
    }
  }
  console.dir(computeValue(rootNode))
}

// day8a(testInput)
day8a(input)

// day8b(testInput)
day8b(input)
