const calculateMonkeyBusiness = (monkeys, part) => {
  let worryLevel = 0;
  let rounds = part === 1 ? 20 : 10000;

  let reducer = 1;
  for (let monkey of monkeys) {
    reducer *= monkey.test.val;
  }

  for (let round = 1; round < rounds + 1; round++) {
    for (let monkey of monkeys) {
      for (let item of monkey.startingItems) {
        worryLevel = part === 1 
          ? Math.floor(monkey.operation(item) / 3) 
          : monkey.operation(item) % reducer;
        worryLevel % monkey.test.val === 0 
          ? monkeys[monkey.test.ifTrue].startingItems.push(worryLevel)
          : monkeys[monkey.test.ifFalse].startingItems.push(worryLevel);
        monkey.inspectCount++;
      }
      monkey.startingItems = [];
    }
  }

  let inspectCounts = [];
  for (let monkey in monkeys) {
    inspectCounts.push(monkeys[monkey].inspectCount);
  }
  inspectCounts.sort((a, b) => b - a)
  return inspectCounts[0] * inspectCounts[1]
}

////////////  Base Functions for Solver.js                     
export const solveExample = (exampleData, part) => {
  return calculateMonkeyBusiness(exampleData, part)
}

export const solve = (currentDayData, part) => {
  return calculateMonkeyBusiness(currentDayData, part)
}