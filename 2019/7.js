const input = require('./7.input.js')
const ArrayOps = require('../utils/arrayOps')

const LOGS = false

function intCode(program, cursor, inputs) {
  if (LOGS && cursor === 0) {
    console.dir('Start instance')
    console.dir(program.join(",")+ '::' + inputs.join(','))
  }
  if (program[cursor] === undefined) {
    console.dir('No more instruction')
    return
  }

  const fullOp = ("0000"+program[cursor]).slice(-5)
  const modeA3 = +(fullOp[0])
  if (modeA3 !== 0) {
    console.dir('Something is wrong')
  }

  const modeA2 = +(fullOp[1])
  const modeA1 = +(fullOp[2])
  const opCode = +(fullOp.slice(-2))

  if (opCode === 99) {
    console.dir('End program')
  } else if (opCode === 1 || opCode === 2 || opCode === 7 || opCode === 8) {
    let arg1 = +program[cursor+1]
    if (modeA1 === 0) {
      arg1 = +program[arg1]
    }
    let arg2 = +program[cursor+2]
    if (modeA2 === 0) {
      arg2 = +program[arg2]
    }
    let dest = +program[cursor+3]
    program[dest] =
      opCode === 1 ? arg1 + arg2
      : opCode === 2 ? arg1 * arg2
      : opCode === 7 && arg1 < arg2 ? 1
      : opCode === 8 && arg1 === arg2 ? 1
      : 0
    // console.dir(opCode + ' '+ arg1 + ' ' + arg2 + ' => ' + program[dest])
    return intCode(program, cursor + 4, inputs)
  } else if (opCode === 3 || opCode === 4) {
    let arg1 = program[cursor+1]
    if (opCode === 3) {
      const input = inputs[0]
      LOGS && console.dir('Input: '+input)
      program[arg1] = input
      return intCode(program, cursor + 2, inputs.slice(1))
    } else {
      if (modeA1 === 0) {
        arg1 = program[arg1]
      }
      LOGS && console.dir('Output: '+arg1)
      return arg1
    }
  } else if (opCode === 5 || opCode === 6) {
    let arg1 = program[cursor+1]
    if (modeA1 === 0) {
      arg1 = program[arg1]
    }
    let arg2 = program[cursor+2]
    if (modeA2 === 0) {
      arg2 = program[arg2]
    }
    //console.dir(opCode + ' ' + arg1 + ' ' + arg2)
    if ((opCode === 5 && arg1 !== 0) || (opCode === 6 && arg1 === 0)) {
      return intCode(program, arg2, inputs)
    } else {
      return intCode(program, cursor+3, inputs)
    }
  } else {
    console.dir('Unknown op: '+opCode)
    console.dir(program[cursor])
  }
}

function singles(n) {
  return !(n+'').split('').some((v,i,a) => a.lastIndexOf(v)!=i)
}

function day7a(src, expected) {
  function testSettings(n) {
    const seq = ('00000'+n).slice(-5).split('').map(n => +n)
    return seq.reduce((prev, digit) => {
      let program = src.split(',').map(n => +n)
      return +intCode(program, 0, [digit, prev])
    }, 0)
  }
  const allowed = new Set(['0', '1', '2', '3', '4'])
  const thrustTests = ArrayOps
    .init(100000)
    .map(i => ('00000'+i).slice(-5))
    .filter(i => i.split('').find(d => !allowed.has(d)) === undefined)
    .filter(singles)
  const thrustResults = thrustTests
    .map(i => ({ i, thrust: +testSettings(i) }) )
    .sort((a,b) => b.thrust - a.thrust)

  console.dir(thrustResults[0])
  if (expected !== undefined) {
    console.dir(' * --- * ')
    console.dir(expected+' => '+testSettings(expected))
  }
}

function intCodeB(id, program, cursor, inputs, outputs) {
  if (LOGS && cursor === 0) {
    console.dir(id+' Start instance')
    console.dir(program.join(",")+ '::' + inputs.join(','))
  }
  if (program[cursor] === undefined) {
    console.dir(id+' No more instruction')
    return
  }

  const fullOp = ("0000"+program[cursor]).slice(-5)
  const modeA3 = +(fullOp[0])
  if (modeA3 !== 0) {
    console.dir(id+' Something is wrong')
  }

  const modeA2 = +(fullOp[1])
  const modeA1 = +(fullOp[2])
  const opCode = +(fullOp.slice(-2))

  if (opCode === 99) {
    LOGS && console.dir(id+' End program')
    return { program, cursor, outputs, running: false }
  } else if (opCode === 1 || opCode === 2 || opCode === 7 || opCode === 8) {
    let arg1 = +program[cursor+1]
    if (modeA1 === 0) {
      arg1 = +program[arg1]
    }
    let arg2 = +program[cursor+2]
    if (modeA2 === 0) {
      arg2 = +program[arg2]
    }
    let dest = +program[cursor+3]
    program[dest] =
      opCode === 1 ? arg1 + arg2
      : opCode === 2 ? arg1 * arg2
      : opCode === 7 && arg1 < arg2 ? 1
      : opCode === 8 && arg1 === arg2 ? 1
      : 0
    // console.dir(opCode + ' '+ arg1 + ' ' + arg2 + ' => ' + program[dest])
    return intCodeB(id, program, cursor + 4, inputs, outputs)
  } else if (opCode === 3 || opCode === 4) {
    let arg1 = program[cursor+1]
    if (opCode === 3) {
      const input = inputs[0]
      if (input === undefined) {
        LOGS && console.dir(id+' Waiting for input')
        return { program, cursor, outputs, running: true }
      } else {
        LOGS && console.dir(id+' Input: '+input)
        program[arg1] = input
        return intCodeB(id, program, cursor + 2, inputs.slice(1), outputs)
      }
    } else {
      if (modeA1 === 0) {
        arg1 = program[arg1]
      }
      LOGS && console.dir(id+' Output: '+arg1)
      //return arg1
      return intCodeB(id, program, cursor + 2, inputs.slice(1), [...outputs, arg1])
    }
  } else if (opCode === 5 || opCode === 6) {
    let arg1 = program[cursor+1]
    if (modeA1 === 0) {
      arg1 = program[arg1]
    }
    let arg2 = program[cursor+2]
    if (modeA2 === 0) {
      arg2 = program[arg2]
    }
    //console.dir(opCode + ' ' + arg1 + ' ' + arg2)
    if ((opCode === 5 && arg1 !== 0) || (opCode === 6 && arg1 === 0)) {
      return intCodeB(id, program, arg2, inputs, outputs)
    } else {
      return intCodeB(id, program, cursor+3, inputs, outputs)
    }
  } else {
    console.dir(id+' Unknown op: '+opCode)
    console.dir(program[cursor])
  }
}

function day7b(src, expected) {
  function testSettings(n) {
    const seq = (''+n).split('').map(n => +n)

    let amps = seq.map( (conf, i) => ({
      id: i,
      program: src.split(',').map(n => +n),
      cursor: 0,
      inputs: i === 0 ? [conf, 0] : [conf],
      outputs: [],
      running: true,
    }))

    let curActive = 0
    while (amps[curActive].running) {
      const prevAmp = curActive === 0 ? 4 : curActive - 1
      const cur = amps[curActive]
      const nextState = intCodeB(cur.id, cur.program, cur.cursor, [...cur.inputs, ...amps[prevAmp].outputs], cur.outputs)
      amps[curActive] = {
        ...cur,
        program: nextState.program,
        cursor: nextState.cursor,
        outputs: nextState.outputs,
        inputs: [],
        running: nextState.running,
      }
      amps[prevAmp] = { ...amps[prevAmp], outputs: [] }
      curActive = (curActive + 1) % 5
    }
    return amps[4].outputs.slice(-1)[0]
  }

  const allowed = new Set(['5', '6', '7', '8', '9'])
  const thrustTests = ArrayOps
    .init(100000-55555)
    .map(i => i + 55555)
    .filter(i => (''+i).split('').find(d => !allowed.has(d)) === undefined)
    .filter(singles)

  const thrustResults = thrustTests
    .map(i => ({ i, thrust: +testSettings(i) }) )
    .sort((a,b) => b.thrust - a.thrust)

  console.dir(thrustResults[0])
  if (expected !== undefined) {
    console.dir(' * --- * ')
    console.dir(expected+' => '+testSettings(expected))
  }
}

day7a(input)
//day7a('3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0', 43210)
//day7a('3,23,3,24,1002,24,10,24,1002,23,-1,23,101,5,23,23,1,24,23,23,4,23,99,0,0', 1234)

day7b(input)
//day7b('3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5', 98765)
//day7b('3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10', 97856)
