const input = `14222596
4057428`

const ArrayOps = require('../utils/arrayOps')

function transformSubject(subject, loop) {
  let res = 1
  for (let i = 0; i < loop; i++) {
    res = res * subject
    res = res % 20201227
  }
  return res
}

function dayA(src, exp) {
  const pKey1 = +(src.split('\n')[0])
  const pKey = +(src.split('\n')[1])

  let loops = 1
  let tmp = transformSubject(7, loops)
  while (tmp !== pKey) {
    loops++
    tmp = tmp * 7
    tmp = tmp % 20201227
    //console.dir(loops + ': '+tmp)
  }

  console.dir(transformSubject(pKey, 11))
  let res = transformSubject(pKey1, loops)

  console.log(`Expected ${exp} - Got ${res} - ${exp == res}`)
}

function dayB(src, exp) {

  let res = undefined

  console.log(`Expected ${exp} - Got ${res} - ${exp == res}`)
}

const test = `17807724
5764801`

console.dir('PART A')
//dayA(test, 14897079)
dayA(input)

console.dir('PART B')
//dayB(test)
//dayB(input)
