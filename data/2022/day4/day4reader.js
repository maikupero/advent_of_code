import nReadlines from 'n-readlines';
import { getPairs } from '../../solvers/Day4.js';

// Split by , 
export const reader = (AOCData, verbose) => {
  if (!verbose) {
    console.log("--- Skipping the log for the *big* data...");
  }
  const dataLines = new nReadlines(AOCData);
  let line;
  let lineNumber = 1;
  const res = [];

  while (line = dataLines.next()) {
    verbose && console.log("Ex: ", line.toString());
    line = line.toString().split(",");
    const pair = getPairs(line[0], line[1]);
    verbose && console.log(pair);
    res.push(pair);
    lineNumber++;
  }

  const used = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(`Took approximately ${Math.round(used * 100) / 100} MB of memory to read the data from ${AOCData}.`);

  return res;
}
