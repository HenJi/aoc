const input = require('./21.input.js')
const ArrayOps = require('../utils/arrayOps')

Object.size = function(obj) {
  var size = 0, key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
}

function dayA(src, exp) {
  let allIngredients = new Set()
  let occurences = new Map()
  const lst = src
    .split('\n')
    .map(line => {
      let [ingredients, allergens] = line.split(' (contains ')
      ingredients = ingredients.split(' ')
      ingredients.forEach(allIngredients.add, allIngredients)
      ingredients.forEach(i => { occurences.set(i, 1 + (occurences.get(i) || 0)) })
      allergens = allergens || ''
      allergens = allergens.split(')')[0].split(', ').filter(a => a !== '')
      return { allergens, ingredients }
    })

  let alMatch = {}
  lst.forEach(({ allergens, ingredients }) => {
    allergens.forEach((al) => {
      if (alMatch[al] === undefined) {
        alMatch[al] = ingredients
      } else {
        alMatch[al] = alMatch[al].filter(a => ingredients.indexOf(a) >= 0)
      }
    })
  })
  //console.dir(alMatch)
  //console.dir(allIngredients)

  let resMatch = {}
  let withAllergens = new Set()
  let size = 1
  while (Object.size(alMatch) > 0) {
    let next = {}
    for (let [key, value] of Object.entries(alMatch)) {
      if (value.length === size) {
        resMatch[key] = value
        delete alMatch[key]
      }
      if (value.length === 1) {
        withAllergens.add(value[0])
      }
    }
    let found = Object.keys(resMatch)
    for (let [key, value] of Object.entries(alMatch)) {
      if (resMatch[key] === undefined) {
        next[key] = value.filter(i => !withAllergens.has(i))
      }
    }
    alMatch = next
  }
  console.dir(resMatch)

  let res = 0
  allIngredients.forEach(i => {
    if (!withAllergens.has(i)) {
      res += occurences.get(i)
    }
  })

  console.log(`Expected ${exp} - Got ${res} - ${exp == res}`)
}

function dayB(src, exp) {
  let allIngredients = new Set()
  let occurences = new Map()
  const lst = src
    .split('\n')
    .map(line => {
      let [ingredients, allergens] = line.split(' (contains ')
      ingredients = ingredients.split(' ')
      ingredients.forEach(allIngredients.add, allIngredients)
      ingredients.forEach(i => { occurences.set(i, 1 + (occurences.get(i) || 0)) })
      allergens = allergens || ''
      allergens = allergens.split(')')[0].split(', ').filter(a => a !== '')
      return { allergens, ingredients }
    })

  let alMatch = {}
  lst.forEach(({ allergens, ingredients }) => {
    allergens.forEach((al) => {
      if (alMatch[al] === undefined) {
        alMatch[al] = ingredients
      } else {
        alMatch[al] = alMatch[al].filter(a => ingredients.indexOf(a) >= 0)
      }
    })
  })
  //console.dir(alMatch)
  //console.dir(allIngredients)

  let resMatch = {}
  let withAllergens = new Set()
  while (Object.size(alMatch) > 0) {
    let next = {}
    for (let [key, value] of Object.entries(alMatch)) {
      if (value.length === 1) {
        resMatch[key] = value
        withAllergens.add(value[0])
      }
    }
    let found = Object.keys(resMatch)
    for (let [key, value] of Object.entries(alMatch)) {
      if (resMatch[key] === undefined) {
        next[key] = value.filter(i => !withAllergens.has(i))
      }
    }
    alMatch = next
  }
  console.dir(resMatch)

  let dangerous = Object.entries(resMatch)
  dangerous.sort(([a1,i1], [a2,i2]) => a1.localeCompare(a2))

  let res = dangerous.map(([a,i]) => i).join(',')

  console.log(`Expected ${exp} - Got ${res} - ${exp == res}`)
}

const test = `mxmxvkd kfcds sqjhc nhms (contains dairy, fish)
trh fvjkl sbzzf mxmxvkd (contains dairy)
sqjhc fvjkl (contains soy)
sqjhc mxmxvkd sbzzf (contains fish)`

console.dir('PART A')
//dayA(test, 5)
//dayA(input, 2287)

console.dir('PART B')
dayB(test, 'mxmxvkd,sqjhc,fvjkl')
dayB(input, 'fntg,gtqfrp,xlvrggj,rlsr,xpbxbv,jtjtrd,fvjkp,zhszc')
