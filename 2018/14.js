const LOGS = false

function Factory(e0, e1) {
  var node1 = {
    value: e1,
    next: null,
  }
  var node0 = {
    value: e0,
    next: node1,
  }
  this.head = node0
  this.tail = node1
  this.e1 = node0
  this.e2 = node1
  this.count = 2
}

Factory.prototype.append = function(value) {
  const node = {
    value,
    next: null,
  }
  this.tail.next = node
  this.tail = node
  this.count++
}

Factory.prototype.tick = function() {
  const log = `Size ${this.count} - E1 ${this.e1.value} - E2 ${this.e2.value}`
  const next = this.e1.value + this.e2.value
  const added = (''+next).split('').map(n => +n)
  this.append(added[0])
  added[1] !== undefined && this.append(added[1])

  let de1 = this.e1.value + 1
  let de2 = this.e2.value + 1
  for (let i = 0; i < de1; i++) {
    this.e1 = this.e1.next || this.head
  }
  for (let i = 0; i < de2; i++) {
    this.e2 = this.e2.next || this.head
  }

  LOGS && console.dir(`${log} - add ${next}`)
  return (''+next)
}

function day14a(loops, exp) {
  let game = new Factory(3, 7)
  let res = "37"
  while (game.count < loops+10) {
    res = res + game.tick()
  }
  console.dir(res.slice(loops,loops+10))
  exp && console.dir(exp)
}

function day14b(exp, searched) {
  const base = searched.length
  let game = new Factory(3, 7)
  let res = "37"
  let sliced = 0
  while (res.indexOf(searched) < 0) {
    res = res + game.tick()
    const prev = res.length
    res = res.slice(-base-1)
    sliced += prev - res.length
  }
  console.dir(sliced + res.indexOf(searched))
  exp && console.dir(exp)
}

//day14a(047801, '1342316410')
if (false) {
  day14a(5, '0124515891')
  day14a(18, '9251071085')
  day14a(9, '5158916779')
  day14a(2018, '5941429882')
}

day14b(20235230, '047801')
if (false) {
  day14b(5, '0124515891')
  day14b(18, '9251071085')
  day14b(9, '5158916779')
  day14b(2018, '5941429882')
}
