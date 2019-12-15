const input = require('./14.input.js')

const LOGS = false
const LOGS2 = false

function readReaction(line) {
  const [insText, out] = line.split(' => ')
  const [outNb, outName] = out.split(' ')
  const ins = insText.split(', ').reduce(
    (acc, e) => {
      const [nb, name] = e.split(' ')
      return { ...acc, [name]: +nb }
    }, {}
  )
  return {
    out: outName,
    nb: +outNb,
    reqs: ins,
  }
}

function recycleWastedOre(reactions, extra) {
  let found = true
  let res = { ...extra }
  LOGS && console.dir('Checking wasted ORE')
  while (found) {
    found = false
    LOGS && console.dir(res)
    let nextExtra = []
    Object.entries(res).forEach( ([i, qt]) => {
      if (qt === 0) {
        nextExtra[i] = (nextExtra[i] || 0)
        return
      }
      let react = reactions.find(r => r.out === i)
      if (react !== undefined && qt >= react.nb) {
        found = true
        let mult = 1
        while ( (mult+1)*react.nb < qt ) { mult++ }
        nextExtra[i] = (nextExtra[i] || 0) + qt - (mult*react.nb)
        Object.entries(react.reqs).forEach( ([ei, eqt]) => {
          nextExtra[ei] = (nextExtra[ei] || 0) + mult*eqt
        })
      } else {
        nextExtra[i] = (nextExtra[i] || 0) + qt
      }
    })
    res = nextExtra
  }
  return res
}

function computeRequiredOre(reactions, stock = {}) {
  let extra = { ...stock }
  let req = { FUEL: 1 }

  let i = 0
  while (req.ORE === undefined || Object.keys(req).length > 1) {
    LOGS && console.dir(req)
    let nextReq = { }
    Object.entries(req).forEach(([ingredient, nb]) => {
      let extras = extra[ingredient] || 0
      let react = reactions.find(r => r.out === ingredient)
      if (react === undefined) {
        // Pass through - should only be ore
        nextReq[ingredient] = (nextReq[ingredient] || 0) + nb
      } else if (nb < extras) {
        // highly unlikely
        extra[ingredient] -= nb
      } else {
        let mult = 1
        while (extras + (mult * react.nb) < nb) {
          mult++
        }
        const produced = extras + (mult * react.nb)
        extra[ingredient] = produced - nb
        Object.entries(react.reqs).forEach(([nextI, qtyNeeded]) => {
          nextReq[nextI] = (nextReq[nextI] || 0) + qtyNeeded * mult
        })
      }
    })
    req = nextReq
    i++
  }

  return { required: req.ORE, extra }
}

function day14a(src, exp) {
  const reactions = src.split('\n').map(readReaction)

  let { required, extra } = computeRequiredOre(reactions)
  extra = recycleWastedOre(reactions, extra)

  LOGS && console.dir(extra)
  const oresFor1 = required - (extra.ORE || 0)

  if (exp) {
    console.dir(oresFor1)
    console.dir(exp)
  }
  return { oresFor1, extra: { ...extra, ORE: 0 } }
}

function day14b(src, exp) {
  let ores = 1000000000000
  const reactions = src.split('\n').map(readReaction)
  const { oresFor1, extra } = day14a(src, undefined)
  LOGS2 && console.dir({ oresFor1 })

  let res = 0
  let remain = ores
  let wasted = {}

/*
  let res = Math.floor(ores / oresFor1)
  const added = res
  let wasted = {}
  Object.keys(extra).map( k => wasted[k] = extra[k] * added )
  let remain = ores % oresFor1
*/

  while (remain > oresFor1) {
    LOGS2 && console.dir(`${res} fuel crafted`)
    LOGS2 && console.dir(`${remain} ore remaining`)

    const added = Math.floor(remain / oresFor1)
    res += added
    Object.keys(extra).map( k => wasted[k] = (wasted[k] || 0) + extra[k] * added )
    remain = remain - (oresFor1 * added)

    wasted = recycleWastedOre(reactions, wasted)
    remain += wasted.ORE
    wasted = { ...wasted, ORE: 0 }
  }

  LOGS2 && console.dir(`${remain} ore remaining`)
  // Check if we have enough to make an extra fuel
  let last = computeRequiredOre(reactions, wasted)
  let additional = last.required < remain ? 1 : 0

  console.dir(res + additional)
  exp && console.dir(exp)
}

const testA = false
const testB = true

//day14a(input, 198984)
//day14b(input, 7659732)

if (testA) {
  day14a(`9 ORE => 2 A
8 ORE => 3 B
7 ORE => 5 C
3 A, 4 B => 1 AB
5 B, 7 C => 1 BC
4 C, 1 A => 1 CA
2 AB, 3 BC, 4 CA => 1 FUEL`, 165)

  day14a(`2 VPVL, 7 FWMGM, 2 CXFTF, 11 MNCFX => 1 STKFG
17 NVRVD, 3 JNWZP => 8 VPVL
53 STKFG, 6 MNCFX, 46 VJHF, 81 HVMC, 68 CXFTF, 25 GNMV => 1 FUEL
22 VJHF, 37 MNCFX => 5 FWMGM
139 ORE => 4 NVRVD
144 ORE => 7 JNWZP
5 MNCFX, 7 RFSQX, 2 FWMGM, 2 VPVL, 19 CXFTF => 3 HVMC
5 VJHF, 7 MNCFX, 9 VPVL, 37 CXFTF => 6 GNMV
145 ORE => 6 MNCFX
1 NVRVD => 8 CXFTF
1 VJHF, 6 MNCFX => 4 RFSQX
176 ORE => 6 VJHF`, 180697)

  day14a(`157 ORE => 5 N
165 ORE => 6 D
44 X, 5 K, 1 Q, 29 N, 9 G, 48 H => 1 FUEL
12 H, 1 G, 8 P => 9 Q
179 ORE => 7 P
177 ORE => 5 H
7 D, 7 P => 2 X
165 ORE => 2 G
3 D, 7 N, 5 H, 10 P => 8 K`, 13312)

  day14a(`171 ORE => 8 CNZTR
7 ZLQW, 3 BMBT, 9 XCVML, 26 XMNCP, 1 WPTQ, 2 MZWV, 1 RJRHP => 4 PLWSL
114 ORE => 4 BHXH
14 VRPVC => 6 BMBT
6 BHXH, 18 KTJDG, 12 WPTQ, 7 PLWSL, 31 FHTLT, 37 ZDVW => 1 FUEL
6 WPTQ, 2 BMBT, 8 ZLQW, 18 KTJDG, 1 XMNCP, 6 MZWV, 1 RJRHP => 6 FHTLT
15 XDBXC, 2 LTCX, 1 VRPVC => 6 ZLQW
13 WPTQ, 10 LTCX, 3 RJRHP, 14 XMNCP, 2 MZWV, 1 ZLQW => 1 ZDVW
5 BMBT => 4 WPTQ
189 ORE => 9 KTJDG
1 MZWV, 17 XDBXC, 3 XCVML => 2 XMNCP
12 VRPVC, 27 CNZTR => 2 XDBXC
15 KTJDG, 12 BHXH => 5 XCVML
3 BHXH, 2 VRPVC => 7 MZWV
121 ORE => 7 VRPVC
7 XCVML => 6 RJRHP
5 BHXH, 4 VRPVC => 5 LTCX`, 2210736)
}

if (testB) {
  day14b(`157 ORE => 5 N
165 ORE => 6 D
44 X, 5 K, 1 Q, 29 N, 9 G, 48 H => 1 FUEL
12 H, 1 G, 8 P => 9 Q
179 ORE => 7 P
177 ORE => 5 H
7 D, 7 P => 2 X
165 ORE => 2 G
3 D, 7 N, 5 H, 10 P => 8 K`, 82892753)

  day14b(`2 VPVL, 7 FWMGM, 2 CXFTF, 11 MNCFX => 1 STKFG
17 NVRVD, 3 JNWZP => 8 VPVL
53 STKFG, 6 MNCFX, 46 VJHF, 81 HVMC, 68 CXFTF, 25 GNMV => 1 FUEL
22 VJHF, 37 MNCFX => 5 FWMGM
139 ORE => 4 NVRVD
144 ORE => 7 JNWZP
5 MNCFX, 7 RFSQX, 2 FWMGM, 2 VPVL, 19 CXFTF => 3 HVMC
5 VJHF, 7 MNCFX, 9 VPVL, 37 CXFTF => 6 GNMV
145 ORE => 6 MNCFX
1 NVRVD => 8 CXFTF
1 VJHF, 6 MNCFX => 4 RFSQX
176 ORE => 6 VJHF`, 5586022)

  day14b(`171 ORE => 8 CNZTR
7 ZLQW, 3 BMBT, 9 XCVML, 26 XMNCP, 1 WPTQ, 2 MZWV, 1 RJRHP => 4 PLWSL
114 ORE => 4 BHXH
14 VRPVC => 6 BMBT
6 BHXH, 18 KTJDG, 12 WPTQ, 7 PLWSL, 31 FHTLT, 37 ZDVW => 1 FUEL
6 WPTQ, 2 BMBT, 8 ZLQW, 18 KTJDG, 1 XMNCP, 6 MZWV, 1 RJRHP => 6 FHTLT
15 XDBXC, 2 LTCX, 1 VRPVC => 6 ZLQW
13 WPTQ, 10 LTCX, 3 RJRHP, 14 XMNCP, 2 MZWV, 1 ZLQW => 1 ZDVW
5 BMBT => 4 WPTQ
189 ORE => 9 KTJDG
1 MZWV, 17 XDBXC, 3 XCVML => 2 XMNCP
12 VRPVC, 27 CNZTR => 2 XDBXC
15 KTJDG, 12 BHXH => 5 XCVML
3 BHXH, 2 VRPVC => 7 MZWV
121 ORE => 7 VRPVC
7 XCVML => 6 RJRHP
5 BHXH, 4 VRPVC => 5 LTCX`, 460664)
}
