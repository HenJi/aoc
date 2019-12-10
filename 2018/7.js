const input = require('./7.input.js')
const ArrayOps = require('../utils/arrayOps')

const testInput = `Step C must be finished before step A can begin.
Step C must be finished before step F can begin.
Step A must be finished before step B can begin.
Step A must be finished before step D can begin.
Step B must be finished before step E can begin.
Step D must be finished before step E can begin.
Step F must be finished before step E can begin.`

const LOGS = false

function parseStep(line) {
  const spl = line.split(' ')
  return { step: spl[1], req: spl[7] }
}

function day7a(src) {
  const instructions = src.split('\n').map(parseStep)

  let unlockMap = {} // step -> unlocked
  instructions.forEach(i => {
    unlockMap[i.step] = (unlockMap[i.step] || []).concat(i.req)
  })

  let reqMap = {} // step -> required
  instructions.forEach(i => {
    reqMap[i.req] = (reqMap[i.req] || []).concat(i.step)
  })
  function allReqMet(str, step) {
    const requires = reqMap[step] || []
    return requires.reduce((res, r) => res && str.indexOf(r) >= 0, true)
  }

  LOGS && console.dir(unlockMap)
  const steps = new Set(instructions.map(i => i.step))
  const required = new Set(instructions.map(i => i.req))
  const noRequirement = [ ...steps.values() ].filter(s => !required.has(s))
  //console.dir(noRequirement)

  let available = noRequirement.sort()
  let res = ''
  while (available.length > 0) {
    const next = available[0]
    res = res + next
    available = (available.slice(1))
      .concat(unlockMap[next] || [])
      .sort()
    available = available
      .filter(l => res.indexOf(l) < 0)
      .filter(l => allReqMet(res, l))
  }
  console.dir(res)
}

function day7b(nbWorkers, baseTime, src) {
  function getDuration(step) {
    return baseTime + 1 + step.charCodeAt(0) - 'A'.charCodeAt(0)
  }

  const instructions = src.split('\n').map(parseStep)
  let possibleSteps = new Set(ArrayOps.flatten(instructions.map(i => [i.step, i.req])))

  let unlockMap = {} // step -> unlocked
  instructions.forEach(i => {
    unlockMap[i.step] = (unlockMap[i.step] || []).concat(i.req)
  })

  let reqMap = {} // step -> required
  instructions.forEach(i => {
    reqMap[i.req] = (reqMap[i.req] || []).concat(i.step)
  })
  function allReqMet(str, step) {
    const requires = reqMap[step] || []
    return requires.reduce((res, r) => res && str.indexOf(r) >= 0, true)
  }

  LOGS && console.dir(unlockMap)
  const steps = new Set(instructions.map(i => i.step))
  const required = new Set(instructions.map(i => i.req))
  const noRequirement = [ ...steps.values() ].filter(s => !required.has(s))

  let workers = ArrayOps.init(nbWorkers).map(id => ({ id, task: undefined, progress: 0 }))
  console.dir(workers)

  let tick = -1
  let available = noRequirement
  let done = ''
  console.dir('S '+workers.map(w => w.id).join(' ')+' DONE')
  console.dir('--'+workers.map(w => '--').join('')+'----')
  while (done.length < possibleSteps.size) {
    tick >= 0 && console.dir(tick+' '+workers.map(w => w.task || '.').join(' ')+' '+done)

    let finishedThisRound = []
    workers = workers.map( w => {
      let task = w.task
      if (task && w.progress === getDuration(task)) {
        done += task
        finishedThisRound.push(task)
        task = undefined
      }
      return { ...w, task, progress: w.progress+1 }
    })

    available = (available.filter(a => finishedThisRound.indexOf(a) < 0))
    finishedThisRound.forEach(t => available = available.concat(unlockMap[t]))
    available = ArrayOps.uniques(available)
      .filter(l => done.indexOf(l) < 0)
      .filter(l => allReqMet(done, l))

    workers = workers.map( w => {
      if (w.task === undefined) {
        let newTask = available[0]
        available = available.slice(1)
        return { ...w, task: newTask, progress: 1 }
      } else {
        return w
      }
    })
    tick++
  }
  console.dir(tick)
}

day7a(input)
// day7a(testInput)

day7b(5, 60, input)
//day7b(2, 0, testInput)
