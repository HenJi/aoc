function init(size) {
  return (new Array(size)).fill(0).map((_, i) => i)
}

function uniques(arr) {
  return [...new Set(arr)]
}

module.exports = {
  init, uniques
}
