const input = require('./9.input.js')

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

let loop = 0
function intCode(id, program, base, cursor, inputs, outputs, resetLoop) {
  if (resetLoop) {
    loop = 0
  }
  loop++
  if (loop === 2000) {
    return { program, base, cursor, inputs, outputs, running: true }
  }
  function readArg(mode, offset) {
    const baseArg = +program[cursor+offset]
    if (mode === 0) {
      // address mode
      return +program[baseArg] || 0
    } else if (mode === 1) {
      // Immediate mode
      return baseArg
    } else if (mode === 2) {
      // Relative mode
      return +program[base+baseArg] || 0
    }
  }

  if (LOGS && cursor === 0 && false) {
    console.dir(id+' Start instance')
    console.dir(program.join(",")+ '::' + inputs.join(','))
  }
  if (program[cursor] === undefined) {
    console.dir(id+' No more instruction')
    return { program, cursor, outputs, running: false }
  }

  const fullOp = ("0000"+program[cursor]).slice(-5)
  const modeA3 = +(fullOp[0])
  if (modeA3 === 1) {
    console.dir(id+' Something is wrong')
  }

  const modeA2 = +(fullOp[1])
  const modeA1 = +(fullOp[2])
  const opCode = +(fullOp.slice(-2))
  LOGS && console.dir(fullOp+' '+opCodeNames[opCode])

  if (opCode === 99) {
    LOGS && console.dir(id+' End program')
    return { program, base, cursor, inputs, outputs, running: false }
  } else if (opCode === 1 || opCode === 2 || opCode === 7 || opCode === 8) {
    let arg1 = readArg(modeA1, 1)
    let arg2 = readArg(modeA2, 2)
    let dest = +program[cursor+3]
    if (modeA3 === 2) { dest = base + dest }
    program[dest] =
      opCode === 1 ? arg1 + arg2
      : opCode === 2 ? arg1 * arg2
      : opCode === 7 && arg1 < arg2 ? 1
      : opCode === 8 && arg1 === arg2 ? 1
      : 0
    LOGS && console.dir(opCode + ' '+ arg1 + ' ' + arg2 + ' => ' + program[dest] + ' (' + dest + ')')
    return intCode(id, program, base, cursor + 4, inputs, outputs)
  } else if (opCode === 3 || opCode === 4) {
    //let arg1 = program[cursor+1]
    if (opCode === 3) {
      let arg1 = program[cursor+1]
      if (modeA1 === 2) { arg1 = base + arg1 }
      const input = inputs[0]
      if (input === undefined) {
        LOGS && console.dir(id+' Waiting for input')
        return { program, base, cursor, inputs, outputs, running: true }
      } else {
        LOGS && console.dir(id+' Input: '+input)
        program[arg1] = input
        return intCode(id, program, base, cursor + 2, inputs.slice(1), outputs)
      }
    } else {
      let arg1 = readArg(modeA1, 1)
      LOGS && console.dir(id+' Output: '+arg1)
      //return arg1
      return intCode(id, program, base, cursor + 2, inputs.slice(1), [...outputs, arg1])
    }
  } else if (opCode === 5 || opCode === 6) {
    let arg1 = readArg(modeA1, 1)
    let arg2 = readArg(modeA2, 2)
    //console.dir(opCode + ' ' + arg1 + ' ' + arg2)
    if ((opCode === 5 && arg1 !== 0) || (opCode === 6 && arg1 === 0)) {
      return intCode(id, program, base, arg2, inputs, outputs)
    } else {
      return intCode(id, program, base, cursor+3, inputs, outputs)
    }
  } else if (opCode === 9) {
    let arg1 = readArg(modeA1, 1)
    return intCode(id, program, base+arg1, cursor+2, inputs, outputs)
  } else {
    console.dir(id+' Unknown op: '+opCode)
    console.dir(program[cursor])
    return { program, base, cursor, inputs, outputs, running: false }
  }
}

function day9a(src) {
  const programList = src.split(',').map(x => +x)
  const program = programList.reduce((acc, inst, i) => ({ ...acc, [i]: inst}), {})
  const inputs = [1]

  const res = intCode(0, program, 0, 0, inputs, [], true)
  console.dir(res.outputs)
}

function day9b(src) {
  const programList = src.split(',').map(x => +x)
  let program = programList.reduce((acc, inst, i) => ({ ...acc, [i]: inst}), {})
  let inputs = [2]
  let outputs = []
  let base = 0
  let cursor = 0
  let running = true
  let res = {}
  while (running) {
    // JS has no tail rec optimization so its stack limit is reached
    // This is a hack to circumvent this limit
    res = intCode(0, program, base, cursor, inputs, outputs, true)
    program = res.program
    base = res.base
    cursor = res.cursor
    inputs = res.inputs
    outputs = res.outputs
    running = res.running
  }
  console.dir(res.outputs)
}

// day9a(`109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99`)
// day9a('1102,34915192,34915192,7,4,7,99,0')
// day9a('104,1125899906842624,99')
day9a(input)

day9b(input)
