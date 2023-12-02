import nReadlines from 'n-readlines';

// Split into stacks and instructions
export const reader = (AOCData, verbose) => {
  
  const dataLines = new nReadlines(AOCData);
  let line;
  let lineNumber = 1;

  let res = [];

  while (line = dataLines.next()) {
    let instructions = line.toString().split(" ");
    res.push(instructions[0]);
    if (instructions[1]) {
      res.push(parseInt(instructions[1]));
    }
    lineNumber++;
  }

  const used = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(`Took approximately ${Math.round(used * 100) / 100} MB of memory to read the data from ${AOCData}.`);
  
  verbose && console.log(res);
  return res; 
}