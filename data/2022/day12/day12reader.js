import nReadlines from 'n-readlines';

export const reader = (AOCData, verbose) => {
  
  const dataLines = new nReadlines(AOCData);
  let line;
  let lineNumber = 1;

  const grid = [];

  while (line = dataLines.next()) {
    line = line.toString();
    const row = [];
    for (let letter of line) {
      switch(letter) {
        case 'S': 
          row.push({
            val: 'START',
            found: true,
          });
          break;
        case 'E': 
          row.push('END')
          break;
        default:
          row.push({
            val: letter.charCodeAt(0) - 96,
            found: false,
          })
      }
    }
    grid.push(row);
    lineNumber++;
  }

  const used = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(`Took approximately ${Math.round(used * 100) / 100} MB of memory to read the data from ${AOCData}.`);
  
  return grid; 
}