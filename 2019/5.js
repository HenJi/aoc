const input = require('./5.input.js')

function day5a(strSrc) {
  function test(program, cursor) {
    // console.dir(program.join(","))
    if (program[cursor] === undefined) {
      console.dir('No more instruction')
      return
    }

    const fullOp = ("0000"+program[cursor]).slice(-5)
    // console.dir(fullOp)
    const modeA3 = +(fullOp[0])
    if (modeA3 !== 0) {
      console.dir('Something is wrong')
    }

    const modeA2 = +(fullOp[1])
    const modeA1 = +(fullOp[2])
    const opCode = +(fullOp.slice(-2))

    if (opCode === 99) {
      console.dir('End program')
    } else if (opCode === 1 || opCode === 2) {
      let arg1 = program[cursor+1]
      if (modeA1 === 0) {
        arg1 = program[arg1]
      }
      let arg2 = program[cursor+2]
      if (modeA2 === 0) {
        arg2 = program[arg2]
      }
      let dest = program[cursor+3]
      program[dest] = opCode === 1 ? arg1 + arg2 : arg1 * arg2
      return test(program, cursor + 4)
    } else if (opCode === 3 || opCode === 4) {
      let arg1 = program[cursor+1]
      if (opCode === 3) {
        console.dir('Input: 1')
        program[arg1] = 1
      } else {
        console.dir('Output: '+program[arg1])
      }
      return test(program, cursor + 2)
    } else {
      console.dir('Unknown op: '+opCode)
      console.dir(program[cursor])
    }
  }
  test(strSrc.split(',').map(a => +a), 0)
}

function day5b(strSrc) {
  function test(program, cursor) {
    //console.dir(program.join(","))
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
      let arg1 = program[cursor+1]
      if (modeA1 === 0) {
        arg1 = program[arg1]
      }
      let arg2 = program[cursor+2]
      if (modeA2 === 0) {
        arg2 = program[arg2]
      }
      let dest = program[cursor+3]
      program[dest] =
        opCode === 1 ? arg1 + arg2
        : opCode === 2 ? arg1 * arg2
        : opCode === 7 && arg1 < arg2 ? 1
        : opCode === 8 && arg1 === arg2 ? 1
        : 0
      test(program, cursor + 4)
    } else if (opCode === 3 || opCode === 4) {
      let arg1 = program[cursor+1]
      if (opCode === 3) {
        const input = 5
        console.dir('Input: '+input)
        program[arg1] = input
      } else {
        if (modeA1 === 0) {
          arg1 = program[arg1]
        }
        console.dir('Output: '+arg1)
      }
      test(program, cursor + 2)
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
        test(program, arg2)
      } else {
        test(program, cursor+3)
      }
    } else {
      console.dir('Unknown op: '+opCode)
      console.dir(program[cursor])
    }
  }
  test(strSrc.split(',').map(a => +a), 0)
}

console.dir('--- Part 1 ---')
day5a(input)
console.dir('--- Part 2 ---')
day5b(input)
