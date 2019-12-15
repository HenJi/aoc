const LOGS = false

const opCodeNames = {
  99: 'End',
  1: 'Add',
  2: 'Mult',
  3: 'Input',
  4: 'Output',
  5: 'Jump if not zero',
  6: 'Jump if zero',
  7: 'Inf',
  8: 'Equal',
  9: 'Set base'
}

let loops = 0
function intCode(params) {
  let { id, program, base, cursor, inputs, outputs } = params

  if (loops > 2000) {
    loops = 0
    return params
  }
  loops++

  const fullOp = ("0000"+program[cursor]).slice(-5)
  const modeA3 = +(fullOp[0])
  const modeA2 = +(fullOp[1])
  const modeA1 = +(fullOp[2])
  const modes = [0, modeA1, modeA2, modeA3]
  const opCode = +(fullOp.slice(-2))
  LOGS && console.dir(fullOp+' '+opCodeNames[opCode])

  function readArg(offset) {
    const baseArg = +program[cursor+offset]
    const mode = modes[offset]
    if (mode === 0) { // address mode
      return +program[baseArg] || 0
    } else if (mode === 1) { // Immediate mode
      return baseArg
    } else if (mode === 2) { // Relative mode
      return +program[base+baseArg] || 0
    }
  }
  function readOut(offset) {
    const baseDest = +program[cursor+offset]
    const mode = modes[offset]
    if (mode === 0) {
      return baseDest
    } else if (mode === 1) {
      console.dir(id+' Something is wrong - Output in mode 1')
      return baseDest
    } else if (mode === 2) {
      return baseDest + base
    }
  }

  if (program[cursor] === undefined) {
    console.dir(id+' No more instruction')
    return { ...params, running: false }
  }

  if (opCode === 99) {
    LOGS && console.dir(id+' End program')
    return { ...params, running: false }
  } else if (opCode === 1 || opCode === 2 || opCode === 7 || opCode === 8) {
    let arg1 = readArg(1)
    let arg2 = readArg(2)
    let dest = readOut(3)
    program[dest] =
      opCode === 1 ? arg1 + arg2
      : opCode === 2 ? arg1 * arg2
      : opCode === 7 && arg1 < arg2 ? 1
      : opCode === 8 && arg1 === arg2 ? 1
      : 0
    LOGS && console.dir(opCode + ' '+ arg1 + ' ' + arg2 + ' => ' + program[dest] + ' (' + dest + ')')
    return intCode({ ...params, program, cursor:cursor+4 })
  } else if (opCode === 3 || opCode === 4) {
    if (opCode === 3) {
      let arg1 = readOut(1)
      const input = inputs[0]
      if (input === undefined) {
        LOGS && console.dir(id+' Waiting for input')
        loops = 0
        return { ...params, waitingInput: true }
      } else {
        LOGS && console.dir(id+' Input: '+input)
        program[arg1] = input
        return intCode({ ...params, program, cursor:cursor+2, inputs:inputs.slice(1) })
      }
    } else {
      let arg1 = readArg(1)
      LOGS && console.dir(id+' Output: '+arg1)
      return intCode({ ...params, cursor: cursor+2, outputs: [...outputs, arg1] })
    }
  } else if (opCode === 5 || opCode === 6) {
    let arg1 = readArg(1)
    let arg2 = readArg(2)
    if ((opCode === 5 && arg1 !== 0) || (opCode === 6 && arg1 === 0)) {
      return intCode({ ...params, cursor: arg2 })
    } else {
      return intCode({ ...params, cursor: cursor+3 })
    }
  } else if (opCode === 9) {
    let arg1 = readArg(1)
    return intCode({ ...params, base:base+arg1, cursor: cursor+2 })
  } else {
    console.dir(id+' Unknown op: '+opCode)
    console.dir(program[cursor])
    return { ...params, running: false }
  }
}

function outerIntCode(params) {
  let local = {
    ...params,
    waitingInput: params.waitingInput && params.inputs.lenth === 0
  }
  while (local.running && !local.waitingInput) {
    local = intCode(local)
  }
  return local
}

module.exports = outerIntCode
