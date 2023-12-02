////////// Day1 Functions
const getStrongestElf = (elves) => {
  const totals = [];
  elves.forEach((elf) => {
    (elf.length > 1)
      ? totals.push(elf.reduce((a, b) => parseInt(a) + parseInt(b)))
      : totals.push(parseInt(elf[0]));
  })

  return Math.max(...totals);
}

const getTopThreeElves = (elves) => {
  const totals = [];

  elves.forEach((elf) => {
    (elf.length > 1)
      ? totals.push(elf.reduce((a, b) => parseInt(a) + parseInt(b)))
      : totals.push(parseInt(elf[0]));
  })
  totals.sort((a, b) => b - a);

  return totals.slice(0,3).reduce((a, b) => a + b);
}

const findThoseStrongElves = (data, part) => {
  return part === 1 ? getStrongestElf(data) : getTopThreeElves(data);
}


//////////  Base Functions for Solver.js
export const solveExample = (exampleData, part) => {
  return findThoseStrongElves(exampleData, part);
}

export const solve = (currentDayData, part) => {
  return findThoseStrongElves(currentDayData, part);
}
