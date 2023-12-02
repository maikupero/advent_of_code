const bestPath = (grid) => {
  
  // HELPER FUNCTIONS
  const checkAdjacent = (start, end) => {
    if (end[0] < 0 || end[1] < 0 || end[0] >= grid.length || end[1] >= grid[0].length) return false
    let a = grid[start[0]][start[1]];
    let b = grid[end[0]][end[1]];
    if (a === 'START' || b === 'END') return true;
    return (b - a  < 2)
  }

  const explore = (currY, currX, prevY, prevX) => {
    let upCoords = [currY+1, currX];
    let rightCoords = [currY, currX+1];
    let downCoords = [currY-1, currX];
    let leftCoords = [currY, currX-1];
  }
  // All the code we need
  let startX = 0;
  let startY = 0;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x].val === 'START') {
        startY = y;
        startX = x;
      } 
    }
  }

  // const findBestPath =
  
  let currentBestPath = [];
  const paths = [];
  findBestPath(startY, startX, currentBestPath, paths);
  return currentBestPath.length;
}

////////////  Base Functions for Solver.js                     
export const solveExample = (exampleData, part) => {
  return bestPath(exampleData);
}

export const solve = (currentDayData, part) => {
  return 0
}