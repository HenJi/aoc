const input = require('./3.input.js')

function countTrees(src, dx, dy) {
  let posX = 0
  let posY = 0
  let lines = src.split('\n')
  const height = lines.length
  const width = lines[0].length

  let cpt = 0
  while (lines[posY] !== undefined) {
    const content = lines[posY][posX]

    if (content === '#') {
      cpt++
      //lines[posY][posX] = 'X'
    } else {
      //lines[posY][posX] = 'O'
    }
    posX = (posX + dx) % width
    posY = posY + dy
  }
  return cpt
}

function dayA(src) {
  const res = countTrees(src, 3, 1)
  console.log(res)
  //console.log(lines.map(l => l.join('')).join('\n'))
}



function dayB(src) {
  const slopes = [
    [1, 1],
    [3, 1],
    [5, 1],
    [7, 1],
    [1, 2],
  ]
  const res = slopes
    .map(([dx, dy]) => countTrees(src, dx, dy))
    .reduce( (a,b) => a * b )
  console.log(res)
}

const test = `..##.........##.........##.........##.........##.........##.......
#...#...#..#...#...#..#...#...#..#...#...#..#...#...#..#...#...#..
.#....#..#..#....#..#..#....#..#..#....#..#..#....#..#..#....#..#.
..#.#...#.#..#.#...#.#..#.#...#.#..#.#...#.#..#.#...#.#..#.#...#.#
.#...##..#..#...##..#..#...##..#..#...##..#..#...##..#..#...##..#.
..#.##.......#.##.......#.##.......#.##.......#.##.......#.##.....  --->
.#.#.#....#.#.#.#....#.#.#.#....#.#.#.#....#.#.#.#....#.#.#.#....#
.#........#.#........#.#........#.#........#.#........#.#........#
#.##...#...#.##...#...#.##...#...#.##...#...#.##...#...#.##...#...
#...##....##...##....##...##....##...##....##...##....##...##....#
.#..#...#.#.#..#...#.#.#..#...#.#.#..#...#.#.#..#...#.#.#..#...#.#  --->`

//dayA(test, 7)
//dayA(input, 216)

//dayB(test, 336)
dayB(input, 6708199680)
