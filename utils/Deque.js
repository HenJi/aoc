function Deque() {
  this.Node = null
  this.count = 0
  this.head = null
}

Deque.prototype.rotate = function(value) {
  if (value > 0) {
    for (let i = 0; i < value; i++) {
      this.head = this.head.next
    }
  } else {
    for (let i = 0; i < -value; i++) {
      this.head = this.head.prev
    }
  }
}

Deque.prototype.append = function(value) {
  if (this.count === 0) {
    this.head = {}
    this.head.value = value
    this.head.next = this.head
    this.head.prev = this.head
  } else {
    const node = {
      value: value,
      next: this.head,
      prev: this.head.prev,
    }
    this.head.prev.next = node
    this.head.prev = node
    this.head = node

  }
  this.count++
}

Deque.prototype.pop = function() {
  if (this.count === 0) {
    return undefined
  } else {
    const res = this.head.value
    this.head.next.prev = this.head.prev
    this.head.prev.next = this.head.next
    const nextHead = this.head.next
    delete this.head
    this.head = nextHead
    this.count--
    return res
  }
}

Deque.prototype.print = function() {
  const ref = this.head
  let res = pad(this.head.value)
  this.rotate(1)
  while (this.head !== ref) {
    res += pad(this.head.value)
    this.rotate(1)
  }
  console.dir(res)
}

Deque.prototype.getSize = function () {
  return this.count
}

module.exports = Deque
