////////// PART 1 STUFF
const countEdge = (l, h) => {
  return (l * 2) + ((h - 2) * 2)
}

const checkGrid = (grid) => {

  const lookInwards = (start, originSide) => {
    let thisLineCount = 0;
    let curr = 0;
    let prev = 0;

    if (originSide === 'top') {
      for (let y = 1; y < size - 1; y++) {
        curr = grid[y][start].val;
        prev = Math.max(prev, grid[y-1][start].val);
        if (!grid[y][start].seen && curr > prev) {
          grid[y][start].seen = true;
          thisLineCount++;
          if (curr === 9) return thisLineCount;
        }
      }
    }
    if (originSide === 'bottom') {
      for (let y = size - 2; y > 0; y--) {
        curr = grid[y][start].val;
        prev = Math.max(prev, grid[y+1][start].val);
        if (!grid[y][start].seen && curr > prev) {
          grid[y][start].seen = true;
          thisLineCount++;  
          if (curr === 9) return thisLineCount;
        }
      }
    }
    if (originSide === 'left') {
      for (let x = 1; x < size - 1; x++) {
        curr = grid[start][x].val;
        prev = Math.max(prev, grid[start][x-1].val);
        if (!grid[start][x].seen && curr > prev) {
          grid[start][x].seen = true;
          thisLineCount++;
          if (curr === 9) return thisLineCount;
        }
      }
    }
    if (originSide === 'right') {
      for (let x = size - 2; x > 0; x--) {
        curr = grid[start][x].val;
        prev = Math.max(prev, grid[start][x+1].val);
        if (!grid[start][x].seen && curr > prev) {
          grid[start][x].seen = true;
          thisLineCount++;
          if (curr === 9) return thisLineCount;
        }
      }
    }
    
    return thisLineCount;
  }

  let count = 0;
  let size = grid.length;
  for (let start = 1; start < size - 1; start++) {
    count += lookInwards(start, 'top');
    count += lookInwards(start, 'bottom');
    count += lookInwards(start, 'left');
    count += lookInwards(start, 'right');
  }
  return count;
}

const countVisibleTrees = (grid) => {
  const edge = countEdge(grid.length, grid[0].length);
  const inner = checkGrid(grid);
  return edge + inner;
}



////////// PART 2 STUFF
const findTheHippiestHoppiestTreeHouse = (grid) => {
  
  const lookOutwards = (y, x, direction) => {
    let count = 0;
    let start = grid[y][x];
    let curr = 0;

    if (direction === 'up') {
      if (y === 0) return 0;
      for (let check = y - 1; check >= 0; check--) {
        curr = grid[check][x];
        if (start.val > curr.val) {
          count++;
        } else {
          return count + 1
        }
      }
      return count;
    }

    if (direction === 'down') {
      if (y === grid.length - 1) return 0;
      for (let check = y + 1; check < grid.length; check++) {
        curr = grid[check][x];
        if (start.val > curr.val) {
          count++;
        } else {
          return count + 1
        }
      }
      return count;
    }

    if (direction === 'left') {
      if (x === 0) return 0;
      for (let check = x - 1; check >= 0; check--) {
        curr = grid[y][check];
        if (start.val > curr.val) {
          count++;
        } else {
          return count + 1
        }
      }
      return count;
    }

    if (direction === 'right') {
      if (x === grid.length - 1) return 0;
      for (let check = x + 1; check < grid.length; check++) {
        curr = grid[y][check];
        if (start.val > curr.val) {
          count++;
        } else {
          return count + 1
        }
      }
      return count;
    }
  }

  const calculateScore = (y, x) => {
    let up = lookOutwards(y, x, 'up');
    let down = lookOutwards(y, x, 'down');
    let left = lookOutwards(y, x, 'left');
    let right = lookOutwards(y, x, 'right');

    return up * down * left * right;
  } 

  let bestHouse = 0;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid.length; x++) {
      grid[y][x].score = calculateScore(y, x);
      bestHouse = Math.max(bestHouse, grid[y][x].score);
    }
  }
  return bestHouse;
}

////////////  Base Functions for Solver.js                     
export const solveExample = (exampleData, part) => {
  return part === 1
    ? countVisibleTrees(structuredClone(exampleData))
    : findTheHippiestHoppiestTreeHouse(structuredClone(exampleData));
}

export const solve = (currentDayData, part) => {
  return part === 1
    ? countVisibleTrees(structuredClone(currentDayData))
    : findTheHippiestHoppiestTreeHouse(structuredClone(currentDayData));
}