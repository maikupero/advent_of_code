const moveHead = (headX, headY, dir) => {
  dir === 'U' && headY++;
  dir === 'D' && headY--;
  dir === 'L' && headX--;
  dir === 'R' && headX++;

  return [headX, headY];
}

const adjustTail = (headX, headY, tailX, tailY, trackedPositions, track) => {
  let diffX = headX - tailX;
  let diffY = headY - tailY;

  if (Math.abs(diffX) > 1) {
    tailX += diffX / 2;
    if (diffY) {
      tailY += diffY < 0 ? -1 : 1;
    }
  } else if (Math.abs(diffY) > 1) {
    tailY += diffY / 2;
    if (diffX) {
      tailX += diffX < 0 ? -1 : 1;
    }
  }

  if (track) {
    let coords = `${tailX}, ${tailY}`;
    trackedPositions.add(coords);
  }

  return [tailX, tailY];
}

const trackTail = (path, part) => {
  let body = [];
  let bodySize = part === 1 ? 2 : 10;
  for (let i = 0; i < bodySize; i++) {
    body.push({x: 0, y: 0});
  } 

  let trackedPositions = new Set();
  trackedPositions.add(`0, 0`);

  for (let move of path) {
    for (let step = 0; step < move.val; step++) {
      [body[0].x, body[0].y] = moveHead(body[0].x, body[0].y, move.direction);
      for (let i = 1; i < body.length; i++) {
        [body[i].x, body[i].y] = adjustTail(body[i-1].x, body[i-1].y, body[i].x, body[i].y, trackedPositions, i === bodySize - 1)  
      }
    }
  }
  
  return trackedPositions.size;
}
////////////  Base Functions for Solver.js                     
export const solveExample = (exampleData, part) => {
  return trackTail(exampleData, part);
}

export const solve = (currentDayData, part) => {
  return trackTail(currentDayData, part);
}