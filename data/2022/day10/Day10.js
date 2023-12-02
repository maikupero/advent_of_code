const signalStrengths = (instructions, part) => {
  let x = 1;
  let cycle = 0;

  let getSumIntervals = [20, 60, 100, 140, 180, 220];
  let sum = [];

  for (let i = 0; i < instructions.length; i++) {
    cycle = i+1;
    if (getSumIntervals.includes(cycle)) {
      sum.push(x * cycle);
    }
    if (typeof instructions[i] === 'number') {
      x += instructions[i];
    }
  }

  return sum.reduce((a, b) => a + b);
}

const renderSprites = (instructions) => {
  let acceptablePixels = [];
  let x = 1;
  let cycle = 0;
  let screen = [];
  let row = "";

  for (let crt = 0; crt < instructions.length; crt++) {
    cycle = crt+1;
    acceptablePixels = [x-1, x, x+1];

    row += acceptablePixels.includes(row.length) 
      ? "#"
      : ".";
    if (row.length === 40) {
      screen.push(row);
      row = "";
    }

    if (typeof instructions[crt] === 'number') {
      x += instructions[crt];
    }
  }

  console.log(screen);
}

////////////  Base Functions for Solver.js                     
export const solveExample = (exampleData, part) => {
  return part === 1
    ? signalStrengths(exampleData)
    : renderSprites(exampleData);
}

export const solve = (currentDayData, part) => {
  return part === 1
    ? signalStrengths(currentDayData)
    : renderSprites(currentDayData);
}