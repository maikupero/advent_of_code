import nReadlines from 'n-readlines';

// Split into stacks and instructions
export const reader = (AOCData, verbose) => {
  
  const dataLines = new nReadlines(AOCData);
  let line;
  let lineNumber = 1;

  let res = [];

  while (line = dataLines.next()) {
    line = line.toString().split(" ");
    res.push(line);
    lineNumber++;
  }

  const used = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(`Took approximately ${Math.round(used * 100) / 100} MB of memory to read the data from ${AOCData}.`);
  
  verbose && console.log(res);
  return res; 
}

// cd x moves in one level: it looks in the current directory for the directory named x and makes it the current directory.
// cd .. moves out one level: it finds the directory that contains the current directory, then makes that directory the current directory.
// cd / switches the current directory to the outermost directory, /.
// ls is list
// 123 abc means that the current directory contains a file named abc with size 123.
// dir xyz means that the current directory contains a directory named xyz.
// each directory has a total size - sum of the sizes of the files it contains, directly or indirectly
