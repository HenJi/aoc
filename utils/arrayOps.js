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

module.exports = {
  init, uniques, flatten
}
