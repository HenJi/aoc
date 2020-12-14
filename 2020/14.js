const input = require('./14.input.js')
const ArrayOps = require('../utils/arrayOps')
const StringOps = require('../utils/stringOps')

// https://stackoverflow.com/questions/9939760/how-do-i-convert-an-integer-to-binary-in-javascript
function dec2bin(dec){
  return (dec >>> 0).toString(2)
}

// Mask is already reversed
function maskOnNum(mask, num) {
  const numBits = dec2bin(num).split('')
  numBits.reverse()
  const numWithMask = mask.map((v, i) => {
    if (i >= numBits.length) {
      return v === 'X' ? 0 : v
    } else {
      return v === 'X' ? numBits[i] : v
    }
  })
  //console.log(`${mask.join('')}\n${numBits.join('')}\n${numWithMask.join('')}`)
  numWithMask.reverse()
  return parseInt(numWithMask.join(''), 2)
}

function dayA(src, exp) {
  let instructions = src.split('\n')
  let memory = {}
  let mask = ''

  instructions.forEach(line => {
    if (line.startsWith('mask')) {
      mask = line.split(' = ')[1].split('')
      mask.reverse()
    } else if (line.startsWith('mem')) {
      const [a,b] = line.split(' = ')

      const adr = a.split('[')[1].split(']')[0]
      const resNum = maskOnNum(mask, +b)
      memory[adr] = resNum

    } else {
      console.dir(line)
    }
  })

  let res = ArrayOps.sum(Object.values(memory))

  console.log(`Expected ${exp} - Got ${res}`)
}

// Mask is already reversed
function maskOnAddr(mask, num) {
  const numBits = dec2bin(num).split('')
  numBits.reverse()
  const numWithMask = mask.map((v, i) => {
    if (i >= numBits.length) {
      return v
    } else {
      return v === '0' ? numBits[i] : v
    }
  })
  //console.log(`${mask.join('')}\n${numBits.join('')}\n${numWithMask.join('')}`)
  //numWithMask.reverse()

  //console.dir('---')

  const xs = StringOps.occurrences(numWithMask.join(''), 'X')
  const resAddresses = ArrayOps.init(Math.pow(2, xs)).map( (_,i) => {
    const binI = dec2bin(i).split('')
    binI.reverse()
    let idxI = 0
    const addr = numWithMask.map(vv => {
      if (vv !== 'X') return vv
      else {
        const added = binI[idxI] || '0'
        idxI++
        return added
      }
    })
    //console.log(addr.join(''))
    addr.reverse()
    //console.log(parseInt(addr.join(''), 2))
    return parseInt(addr.join(''), 2)
  })
  //console.dir(resAddresses)

  return resAddresses
}

function dayB(src, exp) {
  let instructions = src.split('\n')
  let memory = {}
  let mask = ''

  instructions.forEach(line => {
    if (line.startsWith('mask')) {
      mask = line.split(' = ')[1].split('')
      mask.reverse()
    } else if (line.startsWith('mem')) {
      const [a,b] = line.split(' = ')

      const adr = a.split('[')[1].split(']')[0]
      const addresses = maskOnAddr(mask, adr)

      const resNum = +b

      addresses.forEach(a => memory[a] = resNum)
    } else {
      console.error(line)
    }
  })

  //console.dir(memory)
  let res = ArrayOps.sum(Object.values(memory))

  console.log(`Expected ${exp} - Got ${res}`)
}

const test = `mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X
mem[8] = 11
mem[7] = 101
mem[8] = 0`

console.dir('PART A')
//dayA(test, 165)
//dayA(input, 9967721333886)
// not 8811505151102

const testB = `mask = 000000000000000000000000000000X1001X
mem[42] = 100
mask = 00000000000000000000000000000000X0XX
mem[26] = 1`

console.dir('PART B')
dayB(testB, 208)
dayB(input)
// not 1855863045748415
