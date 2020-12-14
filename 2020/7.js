const input = require('./7.input.js')

function readRule(rule) {
  //console.dir(rule)
  const [ parentStr, childrenStr ] = rule.split(' contain ')
  const parent = parentStr.split(' bags')[0]
  const children = childrenStr
    .split(', ')
    .map(l => l.split(' bag')[0])
  const childrenMap = children.reduce( (acc,r) => {
    const [ qt, adj, color ] = r.split(' ')
    if (color == undefined) {
      return acc
    } else {
      return { ...acc, [adj + ' ' + color]: +qt }
    }
  }, {})
  return [parent, childrenMap]
}

function dayA(src, exp) {
  let rules = src
    .split('\n')
    .map(readRule)
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {})

  let hasChanged = true
  while (hasChanged) {
    //console.dir(rules)
    hasChanged = false
    for (key in rules) {
      if (Object.keys(rules[key]).length === 0 && key !== 'shiny gold') {
        hasChanged = true
        delete rules[key]
      }
    }
    for (key in rules) {
      for (subKey in rules[key]) {
        if (rules[subKey] == undefined && subKey !== 'shiny gold') {
          hasChanged = true
          delete rules[key][subKey]
        }
      }
    }
  }
  //console.dir(rules)

  const res = Object.keys(rules).length - 1


  console.log(`Expected ${exp} - Got ${res}`)
}

function dayB(src, exp) {
  let rules = src
    .split('\n')
    .map(readRule)
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {})
  //console.dir(rules)

  let buffer = { 'shiny gold': 1 }
  let res = -1

  while (Object.keys(buffer).length > 0) {
    //console.dir(buffer)
    let newBuffer = {}
    for (key in buffer) {
      const v = buffer[key]
      const children = rules[key]
      res += v
      for (color in children) {
        if (newBuffer[color]) {
          newBuffer[color] += children[color] * v
        } else {
          newBuffer[color] = children[color] * v
        }
      }
    }
    buffer = newBuffer
  }

  //const res = 'TODO'

  console.log(`Expected ${exp} - Got ${res}`)
}

const test = `light red bags contain 1 bright white bag, 2 muted yellow bags.
dark orange bags contain 3 bright white bags, 4 muted yellow bags.
bright white bags contain 1 shiny gold bag.
muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
dark olive bags contain 3 faded blue bags, 4 dotted black bags.
vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
faded blue bags contain no other bags.
dotted black bags contain no other bags.`

console.dir('PART A')
dayA(test, 4)
dayA(input, 289)

const test2 = `shiny gold bags contain 2 dark red bags.
dark red bags contain 2 dark orange bags.
dark orange bags contain 2 dark yellow bags.
dark yellow bags contain 2 dark green bags.
dark green bags contain 2 dark blue bags.
dark blue bags contain 2 dark violet bags.
dark violet bags contain no other bags.`

console.dir('PART B')
dayB(test, 32)
dayB(test2, 126)
dayB(input, 30055)
