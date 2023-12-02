import nReadlines from 'n-readlines';

// Split into stacks and instructions
export const reader = (AOCData, verbose) => {
  
  const dataLines = new nReadlines(AOCData);
  let line;
  let lineNumber = 1;

  let grid = [];

  while (line = dataLines.next()) {
    let row = line.toString().split("");
    row.forEach((num, i) => row[i] = {val: parseInt(num), seen: false});
    grid.push(row);
    lineNumber++;
  }

  const used = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(`Took approximately ${Math.round(used * 100) / 100} MB of memory to read the data from ${AOCData}.`);
  
  verbose && console.log(grid);
  return grid; 
}