class Pair {
  constructor(elf1, elf2) {
    this.elf1 = elf1;
    this.elf2 = elf2
  }
}

export const getPairs = (elf1, elf2) => {
  const [splitElf1, splitElf2] = [elf1.split("-"), elf2.split("-")];
  const [start1, end1] = [parseInt(splitElf1[0]), parseInt(splitElf1[1])];
  const [start2, end2] = [parseInt(splitElf2[0]), parseInt(splitElf2[1])];

  return new Pair({start: start1, end: end1}, 
                  {start: start2, end: end2})
}

const checkForContain = (pair) => {
  const elf1IsPapi = (pair.elf1.start <= pair.elf2.start) && (pair.elf1.end >= pair.elf2.end);
  const elf2IsPapi = (pair.elf2.start <= pair.elf1.start) && (pair.elf2.end >= pair.elf1.end);
  return elf1IsPapi || elf2IsPapi
}

const checkForOverlap = (pair) => {
  return ((pair.elf1.start <= pair.elf2.end) && (pair.elf1.start >= pair.elf2.start)) || 
         ((pair.elf2.start <= pair.elf1.end) && (pair.elf2.start >= pair.elf1.start))
}

const countOverlappingPairs = (pairs, part) => {
  let count = 0;
  if (part === 1) {
    for (let pair of pairs) {
      if (checkForContain(pair)) {
        count++;
      }
    }
  }
  if (part === 2) {
    for (let pair of pairs) {
      if (checkForOverlap(pair)) {
        count++;
      }
    }
  }

  return count
}


////////////  Base Functions for Solver.js                     
export const solveExample = (exampleData, part) => {
  return countOverlappingPairs(exampleData, part);
}

export const solve = (currentDayData, part) => {
  return countOverlappingPairs(currentDayData, part);
}