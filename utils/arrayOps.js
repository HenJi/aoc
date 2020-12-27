function init(size) {
  return (new Array(size)).fill(0).map((_, i) => i)
}

function uniques(arr) {
  return [...new Set(arr)]
}

function flatten(arr) {
  const result = []

  arr.forEach(el => {
    if (el === null || el === undefined) {}
    else if (Array.isArray(el))
      flatten(el).forEach(elt => { if (elt) result.push(elt) })
    else
      result.push(el)
  })
  return result
}

function chunk(lst, size) {
  return init(Math.ceil(lst.length/n))
    .map((x,i) => this.slice(i*n,i*n+n))
}

function sum(lst) {
  return lst.reduce((acc, n) => acc+n, 0)
}
function product(lst) {
  return lst.reduce((acc, n) => acc*n, 1)
}

function reverse(lst) {
  return lst.slice().reverse()
}

module.exports = {
  init, uniques, flatten, chunk, sum, product,
  reverse
}
