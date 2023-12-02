import nReadlines from 'n-readlines';

// ParseDay3Data
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

    res.push(line.toString());

    lineNumber++;
  }

  const used = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(`Took approximately ${Math.round(used * 100) / 100} MB of memory to read the data from ${AOCData}.`);

  return res;
}