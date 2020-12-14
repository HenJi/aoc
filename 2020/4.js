const input = require('./4.input.js')
const ArrayOps = require('../utils/arrayOps')

function dayA(src) {
  const required = [
    'byr', // (Birth Year)
    'iyr', // (Issue Year)
    'eyr', // (Expiration Year)
    'hgt', // (Height)
    'hcl', // (Hair Color)
    'ecl', // (Eye Color)
    'pid', // (Passport ID)
    //'cid', // (Country ID)
  ]
  function isValid(psp) {
    const entries = ArrayOps.flatten(psp.split('\n').map(l => l.split(' ')))
    const keys = new Set(entries.map(e => e.split(':')[0]))
    const tests = required.map(k => keys.has(k))
    //console.dir(tests)
    return tests.indexOf(false) < 0
  }

  const passports = src.split('\n\n')
  const res = passports.filter(isValid)
  console.log(res.length)
}

function dayB(src) {
  const required = [
    'byr', // (Birth Year)
    'iyr', // (Issue Year)
    'eyr', // (Expiration Year)
    'hgt', // (Height)
    'hcl', // (Hair Color)
    'ecl', // (Eye Color)
    'pid', // (Passport ID)
    //'cid', // (Country ID)
  ]
  const entryRules = {
    // four digits; at least 1920 and at most 2002.
    byr: v => { const n = Number(v); return n >= 1920 && n <= 2002 },

    // four digits; at least 2010 and at most 2020.
    iyr: v => { const n = Number(v); return n >= 2010 && n <= 2020 },

    // four digits; at least 2020 and at most 2030.
    eyr: v => { const n = Number(v); return n >= 2020 && n <= 2030 },

    hgt: v => {
      // A number followed by either cm or in:
      if (/^[0-9]{3}cm$/i.test(v)) {
        // If cm, the number must be at least 150 and at most 193.
        const n =  Number(v.substring(0,3))
        return n >= 150 && n <= 193
      } else if (/^[0-9]{2}in$/i.test(v)) {
        // If in, the number must be at least 59 and at most 76.
        const n =  Number(v.substring(0,2))
        return n >= 59 && n <= 76
      } else return false
    },

    // a # followed by exactly six characters 0-9 or a-f.
    hcl: v => /^#[0-9A-F]{6}$/i.test(v),

    // exactly one of: amb blu brn gry grn hzl oth.
    ecl: v => ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl',  'oth'].indexOf(v) >= 0,

    // a nine-digit number, including leading zeroes.
    pid: v => /^[0-9]{9}$/i.test(v),

    //cid (Country ID) - ignored, missing or not.
  }
  function isValid(psp) {
    const entries = ArrayOps.flatten(psp.split('\n').map(l => l.split(' ')))
    let values = {}
    const keys = new Set(entries.map(e => {
      const [k, v] = e.split(':')
      values = { ...values, [k]: v }
      return k
    }))
    //console.dir(values)
    const results = required.map(k => {
      if (keys.has(k)) {
        //console.dir(k+' '+values[k])
        return entryRules[k](values[k])
      } else return false
    })
    //console.dir(results)
    return results.indexOf(false) < 0
  }

  const passports = src.split('\n\n')
  const res = passports.filter(isValid)
  console.log(res.length)
}

const test = `ecl:gry pid:860033327 eyr:2020 hcl:#fffffd
byr:1937 iyr:2017 cid:147 hgt:183cm

iyr:2013 ecl:amb cid:350 eyr:2023 pid:028048884
hcl:#cfa07d byr:1929

hcl:#ae17e1 iyr:2013
eyr:2024
ecl:brn pid:760753108 byr:1931
hgt:179cm

hcl:#cfa07d eyr:2025 pid:166559648
iyr:2011 ecl:brn hgt:59in`

//dayA(test, 2)
//dayA(input, 242)

const testB1 = `pid:087499704 hgt:74in ecl:grn iyr:2012 eyr:2030 byr:1980
hcl:#623a2f

eyr:2029 ecl:blu cid:129 byr:1989
iyr:2014 pid:896056539 hcl:#a97842 hgt:165cm

hcl:#888785
hgt:164cm byr:2001 iyr:2015 cid:88
pid:545766238 ecl:hzl
eyr:2022

iyr:2010 hgt:158cm hcl:#b6652a ecl:blu byr:1944 eyr:2021 pid:093154719`

const testB2 = `eyr:1972 cid:100
hcl:#18171d ecl:amb hgt:170 pid:186cm iyr:2018 byr:1926

iyr:2019
hcl:#602927 eyr:1967 hgt:170cm
ecl:grn pid:012533040 byr:1946

hcl:dab227 iyr:2012
ecl:brn hgt:182cm pid:021572410 eyr:2020 byr:1992 cid:277

hgt:59cm ecl:zzz
eyr:2038 hcl:74454a iyr:2023
pid:3556412378 byr:2007`

dayB(testB1, 4)
dayB(testB2, 0)
dayB(input, 186)
