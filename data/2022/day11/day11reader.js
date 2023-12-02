import nReadlines from 'n-readlines';

// Split into stacks and instructions
class Monkey {
  constructor(startingItems, operation, test) {
    this.startingItems = startingItems;
    this.operation = operation;
    this.test = test;
    this.inspectCount = 0;
  }
}

export const reader = (AOCData, verbose) => {
  
  const dataLines = new nReadlines(AOCData);
  let line;
  let lineNumber = 1;

  let monkeys = [];

  let items = [];

  let operation;
  let operationString = [];
  const addOperation = (y) => {
    return y === 'old'
      ? (x) => x + x
      : (x) => x + y;
  }
  const multOperation = (y) => {
    return y === 'old'
      ? (x) =>  x * x
      : (x) =>  x * y;
  }

  let testVal = 0;
  let testIfTrue = 0;
  let testIfFalse = 0;
  
  while (line = dataLines.next()) {
    line = line.toString().trim().split(":");

    if (line[0] === ("Starting items")) {
      for (let item of line[1].split(",")) {
        items.push(parseInt(item));
      }
    }

    if (line[0] === ("Operation")) {
      operationString = line[1].split(" ");
      operation = operationString[4] === '+'
        ? addOperation(operationString[5] === 'old' ? 'old' : parseInt(operationString[5]))
        : multOperation(operationString[5] === 'old' ? 'old' : parseInt(operationString[5]));
    }

    if (line[0] === ("Test")) {
      testVal = parseInt(line[1].split(" ")[3]);
    }
    if (line[0] === "If true") {
      testIfTrue = parseInt(line[1].split(" ")[4]);
    }
    if (line[0] === "If false") {
      testIfFalse = parseInt(line[1].split(" ")[4]);
    }

    lineNumber++;
    if (lineNumber % 7 === 0) {
      monkeys.push(new Monkey(items, operation, {val: testVal, ifTrue: testIfTrue, ifFalse: testIfFalse}));
      items = [];
    }
  }

  const used = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(`Took approximately ${Math.round(used * 100) / 100} MB of memory to read the data from ${AOCData}.`);
  
  return monkeys; 
}