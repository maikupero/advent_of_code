
const getResultString = (stacks) => {
  let res = "";
  for (let stack of Object.values(stacks)) {
    res += stack[stack.length-1];
  }
  return res;
}

const shiftCratesOneByOne = (stacks, instructions, part) => {
  let crateToMove = "";
  for (let instruction of instructions) {
    for (let moveCount = 0; moveCount < instruction['move']; moveCount++) {
      crateToMove = stacks[instruction['from']].pop();
      stacks[instruction['to']].push(crateToMove);
    }
  }
  return getResultString(stacks);
}

const shiftMultipleCrates = (stacks, instructions) => {
  let cratesToMove;
  for (let instruction of instructions) {
    cratesToMove = stacks[instruction['from']].splice(-instruction['move']);
    stacks[instruction['to']] = [...stacks[instruction['to']], ...cratesToMove];
  }
  return getResultString(stacks);
}

////////////  Base Functions for Solver.js                     
export const solveExample = (exampleData, part) => {
  return part === 1 
    ? shiftCratesOneByOne(structuredClone(exampleData.stacks), exampleData.instructions, part)
    : shiftMultipleCrates(structuredClone(exampleData.stacks), exampleData.instructions, part)
}

export const solve = (currentDayData, part) => {
  return part === 1 
    ? shiftCratesOneByOne(structuredClone(currentDayData.stacks), currentDayData.instructions, part)
    : shiftMultipleCrates(structuredClone(currentDayData.stacks), currentDayData.instructions, part)
}