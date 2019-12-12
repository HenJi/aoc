// https://stackoverflow.com/questions/34953778/calculate-the-lcm-of-two-or-three-numbers-in-javascript
function lcm(numbers) {
  console.dir('Computing lcm, this may be slow ...')
  console.dir(numbers)
  if (numbers.length < 2) return
  first = numbers[0]
  second = numbers[1]
  var i = j = 1
  var mult1 = first * i++
  var mult2 = second * j++
  while (mult1 != mult2) {
    if (mult1 < mult2)
        mult1 = first * i++
    else
        mult2 = second * j++
  }
  if (numbers.length > 2) {
    numbers[1] = mult1
    mult1 = lcm(numbers.splice(1, numbers.length-1))
  }
  return mult1
}

module.exports = {
  lcm,
}
