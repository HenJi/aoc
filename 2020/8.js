const input = require('./8.input.js')
const ArrayOps = require('../utils/arrayOps')

function runProgramA(instructions) {
  let acc = 0
  let inst = 0
  let visited = new Set()

  while (!visited.has(inst)) {
    //console.dir(inst)
    visited.add(inst)
    const [act, nb] = instructions[inst]
    //console.dir([act, nb])
    if (act == 'acc') {
      acc += nb
      inst += 1
    } else if (act == 'nop') {
      inst += 1
    } else if (act == 'jmp') {
      inst += nb
    }
  }
  return acc
}

function dayA(src, exp) {
  const instructions = src.split('\n').map(l => {
    const [op, nb] = l.split(' ')
    return [op, Number(nb)]
  })

  const res = runProgramA(instructions)

  console.log(`Expected ${exp} - Got ${res}`)
}

function runProgramB(instructions) {
  let acc = 0
  let inst = 0
  let visited = new Set()
  let res = undefined

  while (!visited.has(inst)) {
    //console.dir(inst)
    visited.add(inst)
    const raw = instructions[inst]
    if (raw === undefined) {
      res = acc
      visited.add(0)
    } else {
      const [act, nb] = raw
      //console.dir([act, nb])
      if (act == 'acc') {
        acc += nb
        inst += 1
      } else if (act == 'nop') {
        inst += 1
      } else if (act == 'jmp') {
        inst += nb
      }
    }
  }

  return res
}

function dayB(src, exp) {
  const instructions = src.split('\n').map(l => {
    const [op, nb] = l.split(' ')
    return [op, Number(nb)]
  })

  let res = undefined
  instructions.forEach( ([act, nb], i) => {
    const alt =
      act === 'jmp' ? 'nop'
      : act === 'nop' ? 'jmp'
      : undefined
    if (alt !== undefined && res === undefined) {
      const newInstructions = instructions.map((inst, j) => j === i ? [alt, nb] : inst)
      //console.dir(newInstructions)
      res = runProgramB(newInstructions)
    }
  })

  console.log(`Expected ${exp} - Got ${res}`)
}

const test = `nop +0
acc +1
jmp +4
acc +3
jmp -3
acc -99
acc +1
jmp -4
acc +6`

console.dir('PART A')
dayA(test, 5)
dayA(input, 1930)

console.dir('PART B')
dayB(test, 8)
dayB(input, 1688)
