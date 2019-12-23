const input = require('./23.input.js')
//const GridOps = require('../utils/gridOps')
const ArrayOps = require('../utils/arrayOps')

const intCode = require('./intCode.23')

const LOGS = false

function initComputer(id) {
  return {
    id,
    program: input.split(',').map(x => +x).reduce((acc, inst, i) => ({ ...acc, [i]: inst}), {}),
    base: 0,
    cursor: 0,
    inputs: [id],
    outputs: [],
    running: true,
    target: undefined,
    idle: false
  }
}

function day23a(nbComputers, exp) {
  let computers = ArrayOps.init(nbComputers).map(initComputer)

  let i = 0
  let buffer = {}
  ArrayOps.init(nbComputers).forEach(i => buffer[i] = [])
  buffer[255] = []

  while (i < 200 || buffer[255].length === 0) {
    //console.dir(Object.entries(buffer).filter(v => v[1].length > 0))
    let nextBuffer = {}
    computers = computers.map( c => {
      if (buffer[c.id].length > 0) {
        c.inputs = c.inputs.concat(buffer[c.id])
        //console.dir(c.id+' push: '+buffer[c.id].join(','))
        //console.dir(c.inputs)
        buffer[c.id] = []
      }
      let next = intCode(c)
      if (next.outputs.length > 0) {
        if (next.target === undefined) {
          next.target = next.outputs[0]
          next.outputs = []
          LOGS && console.dir(`${next.id} -> ${next.target}`)
        } else if (next.outputs.length === 2) {
          nextBuffer[next.target] = (nextBuffer[next.target] || []).concat(next.outputs)
          LOGS && console.dir(nextBuffer[next.target])
          next.target = undefined
          next.outputs = []
        }
      }
      return next
    })
    Object.entries(nextBuffer).forEach( ([key, vals]) => {
      buffer[key] = buffer[key].concat(vals)
    })
    i++
  }

  console.dir(buffer[255][1])
  exp && console.dir(exp)
}

function day23b(nbComputers, exp) {
  let computers = ArrayOps.init(nbComputers).map(initComputer)

  let i = 0
  let buffer = {}
  ArrayOps.init(nbComputers).forEach(i => buffer[i] = [])
  buffer[255] = []

  let turnsIdle = 0
  let prevY = undefined
  let res = undefined
  while (res === undefined) {
    //console.dir(Object.entries(buffer).filter(v => v[0] != 255 && v[1].length > 0))
    let nextBuffer = {}
    const allIdle = computers.reduce((res, c) => res && c.idle, true)
    if (allIdle) {
      turnsIdle++
    } else {
      turnsIdle = 0
    }
    if (turnsIdle > 20 && buffer[255].length > 0) {
      console.dir('All Idle - send '+buffer[255].join(','))
      if (prevY === buffer[255][1]) {
        res = prevY
      }
      buffer[0] = buffer[255]
      prevY = buffer[255][1]
      computers = computers.map(c => ({ ...c, idle: false }))
      turnsIdle = 0
    }
    computers = computers.map( c => {
      if (buffer[c.id].length > 0) {
        c.inputs = c.inputs.concat(buffer[c.id])
        buffer[c.id] = []
      }
      let next = intCode(c)
      if (next.outputs.length > 0) {
        if (next.target === undefined) {
          next.target = next.outputs[0]
          next.outputs = []
          LOGS && console.dir(`${next.id} -> ${next.target}`)
        } else if (next.outputs.length === 2) {
          if (next.target === 255) {
            nextBuffer[next.target] = next.outputs
          } else {
            nextBuffer[next.target] = (nextBuffer[next.target] || []).concat(next.outputs)
          }
          LOGS && console.dir(nextBuffer[next.target])
          next.target = undefined
          next.outputs = []
        }
      }
      return next
    })
    Object.entries(nextBuffer).forEach( ([key, vals]) => {
      if (key == 255) {
        buffer[key] = vals
      } else {
        buffer[key] = buffer[key].concat(vals)
      }
    })
    i++
  }

  console.dir(res)
  exp && console.dir(exp)
}

//day23a(50, 27061)
day23b(50)