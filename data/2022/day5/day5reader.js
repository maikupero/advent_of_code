import nReadlines from 'n-readlines';

// Split into stacks and instructions
export const reader = (AOCData, verbose) => {
  
  const dataLines = new nReadlines(AOCData);
  let line;
  let lineNumber = 1;

  const stacks = {};
  const instructions = [];
  let lookingAtStacks = true;

  while (line = dataLines.next()) {
    line = line.toString();

    if (!lookingAtStacks) {
      line = line.split(" ");
      instructions.push({
        'move': parseInt(line[1]), 
        'from': parseInt(line[3]), 
        'to': parseInt(line[5])
      })
    } 

    if (lookingAtStacks && line[1] === '1') { // So we don't hit those weird ones where { move: '1', ... }
      lookingAtStacks = false;
    }

    if (lookingAtStacks) {
      for (let i = 1, stack = 1; i < line.length; i += 4, stack++) {
        if (line[i] !== " ") {
          if (stacks[stack]) {
            stacks[stack].unshift(line[i]) 
          } else {
            stacks[stack] = [line[i]];
          }
        }
      }
    }
  
    lineNumber++;
  }

  const used = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(`Took approximately ${Math.round(used * 100) / 100} MB of memory to read the data from ${AOCData}.`);
  
  verbose && console.log(stacks, instructions.slice(1));
  return {stacks: stacks, instructions: instructions.slice(1)}; 
}
