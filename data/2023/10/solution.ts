import { GridXY, coordsAlreadyFound, coordsAreLegal, getAdjacentCoords, printGrid } from "../../../util.js";

// USEFUL INFO
// | is a vertical pipe connecting north and south.
// - is a horizontal pipe connecting east and west.
// L is a 90-degree bend connecting north and east.
// J is a 90-degree bend connecting north and west.
// 7 is a 90-degree bend connecting south and west.
// F is a 90-degree bend connecting south and east.
// . is ground; there is no pipe in this tile.
// S is the starting position of the animal; there is a pipe on this tile, but your sketch doesn't show what shape the pipe has.
// findStarts = () => {

// }
// followPipe(start: Coord, pipe: Pipe)


// First, get a map of the loop in some way. 
// Change the grid? Mark part of loop as I explore the loop?
//        7-F7-                ..F7.
//  Go    .FJ|7       ->       .FJ|.    to
//  from  SJLL7                SJ.L7
//  this  |F--J       ->       |F--J    this
//        LJ.LJ                LJ...

// Then find the tile that would take the longest number of steps along the loop to reach from the starting point
// regardless of which way around the loop the animal went.
// So, not by direct distance. Also, means I only have go one way, since it's a loop.
// Like this:
//   .....        .....             ..F7.        ..45.
//   .S-7.   ->   .012.             .FJ|.   ->   .236.
//   .|.|.        .1.3.     and     SJ.L7        01.78
//   .L-J.   ->   .234.             |F--J   ->   14567
//   .....        .....             LJ...        23...

// PART 2 STUFF
// Any tile that isn't part of the main loop can count as being enclosed by the loop.
// there doesn't even need to be a full tile path to the outside for tiles to count as outside the loop..
// - squeezing between pipes is also allowed! Here, I is still within the loop and O is still outside the loop:
//      ..........
//      .S------7.
//      .|F----7|.
//      .||OOOO||.
//      .||OOOO||.
//      .|L-7F-J|.
//      .|II||II|.
//      .L--JL--J.
//      ..........

// TYPES 
interface Pipe {
  type: PipeType,
  location: GridXY,
  onPath?: boolean
}
interface Path {
  current: Pipe,
  next: Pipe,
  distance: number,
}
type PipeType = '|' | '-' | 'L' | 'J' | '7' | 'F' | string
type PipeNavigation = Map<PipeType, Function>;
const PipeTypes: PipeType[] = ['|', '-', 'L', 'J', '7', 'F'];

const handleVertical = (path: Path, grid: Pipe[][]): Pipe => {
  return path.current.location.y < path.next.location.y
    ? {type: grid[path.current.location.y + 2][path.current.location.x].type, location: {y: path.current.location.y + 2, x: path.current.location.x}} // south
    : {type: grid[path.current.location.y - 2][path.current.location.x].type, location: {y: path.current.location.y - 2, x: path.current.location.x}} // north 
}
const handleHorizontal = (path: Path, grid: Pipe[][]): Pipe => {
  return path.current.location.x < path.next.location.x
    ? {type: grid[path.current.location.y][path.current.location.x + 2].type, location: {y: path.current.location.y, x: path.current.location.x + 2}} // east
    : {type: grid[path.current.location.y][path.current.location.x - 2].type, location: {y: path.current.location.y, x: path.current.location.x - 2}} // west
}
const handleL = (path: Path, grid: Pipe[][]): Pipe => {
  return path.current.location.y === path.next.location.y
    ? {type: grid[path.current.location.y - 1][path.current.location.x - 1].type, location: {y: path.current.location.y - 1, x: path.current.location.x - 1}} // northwest
    : {type: grid[path.current.location.y + 1][path.current.location.x + 1].type, location: {y: path.current.location.y + 1, x: path.current.location.x + 1}} // southeast
}
const handleJ = (path: Path, grid: Pipe[][]): Pipe => {
  return path.current.location.y === path.next.location.y
  ? {type: grid[path.current.location.y - 1][path.current.location.x + 1].type, location: {y: path.current.location.y - 1, x: path.current.location.x + 1}} // northeast
  : {type: grid[path.current.location.y + 1][path.current.location.x - 1].type, location: {y: path.current.location.y + 1, x: path.current.location.x - 1}} // southwest
}
const handle7 = (path: Path, grid: Pipe[][]): Pipe => {
  return path.current.location.y === path.next.location.y
  ? {type: grid[path.current.location.y + 1][path.current.location.x + 1].type, location: {y: path.current.location.y + 1, x: path.current.location.x + 1}} // southeast
  : {type: grid[path.current.location.y - 1][path.current.location.x - 1].type, location: {y: path.current.location.y - 1, x: path.current.location.x - 1}} // southwest
}
const handleF = (path: Path, grid: Pipe[][]): Pipe => {
  return path.current.location.y === path.next.location.y
  ? {type: grid[path.current.location.y + 1][path.current.location.x - 1].type, location: {y: path.current.location.y + 1, x: path.current.location.x - 1}} // southwest
  : {type: grid[path.current.location.y - 1][path.current.location.x + 1].type, location: {y: path.current.location.y - 1, x: path.current.location.x + 1}} // northeast
}
const Guide: PipeNavigation = new Map([
  ['|', handleVertical],
  ['-', handleHorizontal],
  ['L', handleL],
  ['J', handleJ],
  ['7', handle7],
  ['F', handleF],
]);

// PART 1 STUFF
const moveAlong = (path: Path, grid: Pipe[][], pathCoords: GridXY[], part: number) => {
  console.log(path);
  const handlerToCall: Function = Guide.get(path.next.type)!;
  const newNext: Pipe = handlerToCall(path, grid);
  path.current.location.x = path.next.location.x;
  path.current.location.y = path.next.location.y; // next -> current
  path.current.type = path.next.type; 
  path.next.location.x = newNext.location.x;
  path.next.location.y = newNext.location.y; // new next -> next
  path.next.type = newNext.type;
  grid[newNext.location.y][newNext.location.x].onPath = true;
  path.next.onPath = true;
  path.distance++;

  if (
    part === 2 &&  // dont need to do this on part 1
    !coordsAlreadyFound(pathCoords, path.current.location.y, path.current.location.x)
  ) {
    pathCoords.push({y: path.current.location.y, x: path.current.location.x});
  }
  // some kind of prev, current, next functionality for this. 
  // moveAlong should call the handler, so it will need the next locations data. 
  // curr is S, next is |. 
  // so handler updates curr as |, next as L. 
  // so handler updates curr as L, next as J..
}

const checkEndCondition = (path1: Path, path2: Path) => {
  return (
    path1.distance > 0 &&
    path1.current.location.x === path2.current.location.x &&
    path1.current.location.y === path2.current.location.y
  )
}

// Starts us off
const findStart = (grid: Pipe[][]) => {
  let start = {x: 0, y: 0};
  grid.forEach((col, y) => {
    col.forEach((row, x) => {
      if (grid[y][x].type === 'S') {
        start = {y, x};
      }
    })
  });
  grid[start.y][start.x].onPath = true;
  return start;
}

const findStartingPath = (grid: Pipe[][], start: GridXY, alreadyFound?: GridXY): Path => {
  const result: Path = {
    current: {
      type: 'S',
      location: {
        y: start.y,
        x: start.x,
      },
      onPath: true,
    },
    next: {
      type: 'S',
      location: {
        y: start.y,
        x: start.x,
      },
      onPath: true,
    },
    distance: 0,
  }
  const coordsToCheck: any[] = [ // im not bothering with types cause only for this case you need to check 
    {y: start.y - 1, x: start.x, legal: ['|', '7', 'F']},  // specific pipes that can or can not branch off start depending on direction.
    {y: start.y + 1, x: start.x, legal: ['|', 'L', 'J']}, 
    {y: start.y, x: start.x - 1, legal: ['-', 'L', 'F']}, 
    {y: start.y, x: start.x + 1, legal: ['-', '7', 'J']}, 
  ]; 
  for (let adjacent of coordsToCheck) {
    if (
      coordsAreLegal({y: adjacent.y, x: adjacent.x}, grid) && // make sure it's in bounds first
      (
        !alreadyFound || 
        !(adjacent.y === alreadyFound.y && adjacent.x === alreadyFound.x)
      )
    ) {
      if (adjacent.legal.includes(grid[adjacent.y][adjacent.x].type)) {
        result.next.type = grid[adjacent.y][adjacent.x].type;
        result.next.location.y = adjacent.y;
        result.next.location.x = adjacent.x;
        grid[adjacent.y][adjacent.x].onPath = true;
        return result;
      }
    }
  }
  console.log(result);
  return result;
}


// PART 2 STUFF
// Any tile that isn't part of the main loop can count as being enclosed by the loop.
// there doesn't even need to be a full tile path to the outside for tiles to count as outside the loop..
// - squeezing between pipes is also allowed! Here, I is still within the loop and O is still outside the loop:
//      ..........
//      .S------7.
//      .|F----7|.
//      .||OOOO||.
//      .||OOOO||.
//      .|L-7F-J|.
//      .|II||II|.
//      .L--JL--J.
//      ..........
// 
//  so we should be able to imagine each point has.. 
//                    8 different paths that can leak. based on the 8 numbers surrounding it. 
//          # # #     a leak being the gap between two. 
//          # • #     so check each gap (compare two points). 
//          # # #     if check horizontal pair, check they don't connect. 
//                    if check vertical pair, check they don't connect.  
// horizontal: if one is -, 
//  if checking from below: if left is L or if right is J
//  if checking from above: if left is F or if right is 7
// vertical: if one is |,
//  if checking from right: if down is F or if up is L
//  if checking from left: if down is J is F or if up is 7
// it should carry a leakPath (two points, check comparison). 
// that should carry a direction it came from. 
//
//      # #   if topleft + topmiddle of previous chart allow a leak, those are the new bottom two.
//      # #   since it came from down, check left gap, up gap, right gap. 
//            pass that direction through too. 
// thinking through it, it's possible a leak could go back to the original enclosure.
// in that case, we return false, leak impossible. 

const verticalPassageIsBlocked = (left: Pipe, right: Pipe, grid: Pipe[][]) => {
  return (
    left.type === '-' || right.type === '-' || 
    left.type === 'F' || left.type === 'L' ||
    right.type === 'J' || right.type === '7'
  )
}

const horizontalPassageIsBlocked = (up: Pipe, down: Pipe, grid: Pipe[][]) => {
  return (
    down.type === '|' || up.type === '|' || 
    down.type === 'J' || down.type === 'L' ||
    up.type === 'F' || up.type === '7'
  )
}

const followLeak = (a: GridXY, b: GridXY, from: string, grid, enclosureArea) => {
  if (
    !coordsAreLegal(a, grid) || 
    !coordsAreLegal(b, grid) 
  ) return true; // we are at the edge (or already marked pipes that connect to the edge)
  // check if it could squeeze between these two pipes coming from its previous pipe.

  if (from === 'down' || from === 'up') {
    if (verticalPassageIsBlocked(grid[a.y][a.x], grid[b.y][b.x], grid)) return false;
  }
  if (from === 'left' || from === 'right') {
    if (horizontalPassageIsBlocked(grid[a.y][a.x], grid[b.y][b.x], grid)) return false;
  }
  
  // now we can assume we can pass through, so check the next 2 we're faced with.
  if (    
    coordsAlreadyFound(enclosureArea, a.y, a.x) ||
    coordsAlreadyFound(enclosureArea, b.y, b.x)
  ) return false; // we followed a leak back through to the enclosure area.

  if (
    grid[a.y][a.x] === '#' ||
    grid[b.y][b.x] === '#' 
  ) return true;
  
  if (from === 'down') {
    if (followLeak(a, {y: b.y - 1, x: b.x - 1}, 'right', grid, enclosureArea)) return true;
    if (followLeak({y: a.y - 1, x: a.x}, {y: b.y - 1, x: b.x}, 'down', grid, enclosureArea)) return true;
    if (followLeak({y: a.y - 1, x: a.x + 1}, b, 'left', grid, enclosureArea)) return true;
  }
  if (from === 'left') {  
    if (followLeak(a, {y: b.y - 1, x: b.x + 1}, 'down', grid, enclosureArea)) return true;
    if (followLeak({y: a.y, x: a.x + 1}, {y: b.y, x: b.x + 1}, 'left', grid, enclosureArea)) return true;
    if (followLeak({y: a.y + 1, x: a.x + 1}, b, 'up', grid, enclosureArea)) return true;
  }
  // for these two, we have to flip. follow a is left, and b is right, but rotating perspective. 
  if (from === 'up') { // here a is right, b is left.
    if (followLeak({y: b.y + 1, x: b.x + 1}, a, 'right', grid, enclosureArea)) return true;
    if (followLeak({y: b.y + 1, x: b.x}, {y: a.y + 1, x: a.x}, 'up', grid, enclosureArea)) return true;
    if (followLeak(b, {y: a.y + 1, x: a.x - 1}, 'left', grid, enclosureArea)) return true;
  }
  if (from === 'right') { // here a is down, b is up. 
    if (followLeak({y: b.y + 1, x: b.x - 1}, a, 'up', grid, enclosureArea)) return true;
    if (followLeak({y: b.y, x: a.x - 1}, {y: a.y, x: a.x - 1}, 'right', grid, enclosureArea)) return true;
    if (followLeak(b, {y: a.y - 1, x: a.x - 1}, 'down', grid, enclosureArea)) return true;
  }
  return false
}

const canLeak = (current: Pipe, grid: Pipe[][], enclosureArea) => {
  const upLeft = {y: current.location.y - 1, x: current.location.x - 1};
  const up = {y: current.location.y - 1, x: current.location.x};
  const upRight = {y: current.location.y - 1, x: current.location.x + 1};
  const right = {y: current.location.y, x: current.location.x + 1};
  const downRight = {y: current.location.y + 1, x: current.location.x + 1};
  const down = {y: current.location.y, x: current.location.x + 1};
  const downLeft = {y: current.location.y + 1, x: current.location.x - 1};
  const left = {y: current.location.y, x: current.location.x - 1};

  if (followLeak(upLeft, up, 'down', grid, enclosureArea)) return true;
  if (followLeak(up, upRight, 'down', grid, enclosureArea)) return true;
  if (followLeak(upRight, right, 'left', grid, enclosureArea)) return true;
  if (followLeak(right, downRight, 'left', grid, enclosureArea)) return true;
  if (followLeak(downRight, down, 'up', grid, enclosureArea)) return true;
  if (followLeak(down, downLeft, 'up', grid, enclosureArea)) return true;
  if (followLeak(downLeft, left, 'right', grid, enclosureArea)) return true;
  if (followLeak(left, upLeft, 'right', grid, enclosureArea)) return true;

  return false
}

const checkForLeaks = (enclosureArea: Pipe[], grid: Pipe[][]) => {
  return canLeak(enclosureArea[0], grid, enclosureArea)
}

const upLeftConnects = (next: GridXY, grid: Pipe[][]) => {
  const legalUp = ['|', 'L', 'F'];
  const legalLeft = ['-', '7', 'F'];
  return (legalUp.includes(grid[next.y][next.x + 1].type) && legalLeft.includes(grid[next.y + 1][next.x].type))
}
const upRightConnects = (next: GridXY, grid: Pipe[][]) => {
  const legalUp = ['|', 'J', '7'];
  const legalRight = ['-', 'F', '7'];
  return (legalUp.includes(grid[next.y][next.x - 1].type) && legalRight.includes(grid[next.y + 1][next.x].type))
}
const downLeftConnects = (next: GridXY, grid: Pipe[][]) => {
  const legalDown = ['|', 'F', 'L'];
  const legalLeft = ['-', 'J', 'L'];
  return (legalDown.includes(grid[next.y][next.x + 1].type) && legalLeft.includes(grid[next.y - 1][next.x].type))
}
const downRightConnects = (next: GridXY, grid: Pipe[][]) => {
  const legalDown = ['|', 'F', 'J'];
  const legalRight = ['-', 'L', 'J'];
  return (legalDown.includes(grid[next.y][next.x - 1].type) && legalRight.includes(grid[next.y - 1][next.x].type))
}

const addDiags = (current: GridXY, grid: Pipe[][], parentArr: GridXY[]) => {
  const upLeft = {y: current.y - 1, x: current.x - 1};
  coordsAreLegal(upLeft, grid) && upLeftConnects(upLeft, grid) && parentArr.push(upLeft);
  const upRight = {y: current.y - 1, x: current.x + 1};
  coordsAreLegal(upRight, grid) && upRightConnects(upRight, grid) && parentArr.push(upRight);
  const downLeft = {y: current.y + 1, x: current.x - 1};
  coordsAreLegal(downLeft, grid) && downLeftConnects(downLeft, grid) && parentArr.push(downLeft);
  const downRight = {y: current.y + 1, x: current.x + 1};
  coordsAreLegal(downRight, grid) && downRightConnects(downRight, grid) && parentArr.push(downRight);
}

const checkAdjacent = (current: GridXY, enclosureArea: Pipe[], grid: Pipe[][], lookForLeaks: boolean) => {
  if (grid[current.y][current.x].onPath || grid[current.y][current.x].type === '#') {
    return;
  }
  if (!lookForLeaks) { // part 1 and precursory behavior
    if (!grid[current.y][current.x].onPath) {
      grid[current.y][current.x].type = '#'
    }
  } else {
    if (coordsAlreadyFound(enclosureArea.map((pipe) => pipe.location), current.y, current.x)) {
      return;
    }
    if (
      grid[current.y][current.x].type !== '#' && 
      !grid[current.y][current.x].onPath
    ) {
      enclosureArea.push({...grid[current.y][current.x]});
    }
  }
  const legalAdjacentCoords: GridXY[] = getAdjacentCoords(current, grid);
  addDiags(current, grid, legalAdjacentCoords); // since we should only add diag if it follows problem-specific rules
  legalAdjacentCoords.forEach((coord) => checkAdjacent(coord, enclosureArea, grid, lookForLeaks));
}

// From the outside edges in, cause these are a give-in. 
const expandBorder = (grid: Pipe[][]) => {
  const yEdge = grid.length - 1;
  const xEdge = grid[0].length - 1;
  for (let x = 0; x < grid[0].length; x++) {
    if (grid[0][x].type !== '#' && !grid[0][x].onPath) {
      checkAdjacent({y: 0, x}, [grid[0][x]], grid, false);
    }
    if (grid[yEdge][x].type !== '#' && !grid[yEdge][x].onPath) {
      checkAdjacent({y: yEdge, x}, [grid[yEdge][x]], grid, false);
    }
  }
  for (let y = 0; y < grid.length; y++) {
    if (grid[y][0].type !== '#' && !grid[y][0].onPath) {
      checkAdjacent({y, x: 0}, [grid[y][0]], grid, false);
    }
    if (grid[y][xEdge].type !== '#' && !grid[y][xEdge].onPath) {
      checkAdjacent({y, x: xEdge}, [grid[y][xEdge]], grid, false);
    }
  }
}

const markEnclosures = (grid: Pipe[][]) => {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x].type !== '#' && !grid[y][x].onPath) {
        const enclosureArea: Pipe[] = [];
        checkAdjacent({y, x}, enclosureArea, grid, true);
        console.log(enclosureArea);
        const foundALeak: boolean = checkForLeaks(enclosureArea, grid);
        if (foundALeak) {
          enclosureArea.forEach((pipe: Pipe) => {
            grid[pipe.location.y][pipe.location.x].type = '#'
          })
        } else {
          enclosureArea.forEach((pipe) => {
            grid[pipe.location.y][pipe.location.x].type = '*'
          })
        }
      }
    }
  }
}
const leaksOut = (a: GridXY, b: GridXY, from: string, grid: Pipe[][], lookedAt: GridXY[]) => {
  // one or both are past the edge  
  if (!coordsAreLegal(a, grid) || !coordsAreLegal(b, grid)) {
    if (coordsAreLegal(a, grid) && !grid[a.x][a.y].onPath) {
      canEscape(grid[a.y][a.x], grid, lookedAt, ) // next to edge
    } 
    if (coordsAreLegal(b, grid) && !grid[b.x][b.y].onPath) {
      grid[b.x][b.y].type = '#' // next to edge
    }
    return true;
  }  
  // from now on we can assume both points are on the grid.
  
  // if it connects with another # 
  if (grid[a.x][a.y].type === '#' || grid[b.x][b.y].type === '#') {
    return true;
  }

  // if it connects with another *
  if (grid[a.x][a.y].type === '*' || grid[b.x][b.y].type === '*') {
    return false;
  }

  if (from === 'down' || from === 'up') {
    if (verticalPassageIsBlocked(grid[a.y][a.x], grid[b.y][b.x], grid)) return false;
  }
  if (from === 'left' || from === 'right') {
    if (horizontalPassageIsBlocked(grid[a.y][a.x], grid[b.y][b.x], grid)) return false;
  }
  
  // now we can assume we can pass through, so check the next 2 we're faced with.
  
  // if (from === 'down') {
  //   if (followLeak(a, {y: b.y - 1, x: b.x - 1}, 'right', grid, enclosureArea)) return true;
  //   if (followLeak({y: a.y - 1, x: a.x}, {y: b.y - 1, x: b.x}, 'down', grid, enclosureArea)) return true;
  //   if (followLeak({y: a.y - 1, x: a.x + 1}, b, 'left', grid, enclosureArea)) return true;
  // }
  // if (from === 'left') {  
  //   if (followLeak(a, {y: b.y - 1, x: b.x + 1}, 'down', grid, enclosureArea)) return true;
  //   if (followLeak({y: a.y, x: a.x + 1}, {y: b.y, x: b.x + 1}, 'left', grid, enclosureArea)) return true;
  //   if (followLeak({y: a.y + 1, x: a.x + 1}, b, 'up', grid, enclosureArea)) return true;
  // }
  // // for these two, we have to flip. follow a is left, and b is right, but rotating perspective. 
  // if (from === 'up') { // here a is right, b is left.
  //   if (followLeak({y: b.y + 1, x: b.x + 1}, a, 'right', grid, enclosureArea)) return true;
  //   if (followLeak({y: b.y + 1, x: b.x}, {y: a.y + 1, x: a.x}, 'up', grid, enclosureArea)) return true;
  //   if (followLeak(b, {y: a.y + 1, x: a.x - 1}, 'left', grid, enclosureArea)) return true;
  // }
  // if (from === 'right') { // here a is down, b is up. 
  //   if (followLeak({y: b.y + 1, x: b.x - 1}, a, 'up', grid, enclosureArea)) return true;
  //   if (followLeak({y: b.y, x: a.x - 1}, {y: a.y, x: a.x - 1}, 'right', grid, enclosureArea)) return true;
  //   if (followLeak(b, {y: a.y - 1, x: a.x - 1}, 'down', grid, enclosureArea)) return true;
  // }
  return false
}

const canEscape = (pipe: Pipe, grid: Pipe[][], lookedAt: GridXY[]) => {
  // other brainstorming.. take any point. 
  // send it left (or any direction) till it meets path or the edge. 
  // if it meets the edge without crossing the path, it's guaranteed out of the loop. 
  // if it meets the path, mark the start, and follow the loop wall. 
  // note anything on your side of the wall
  // when we get back to the start, retrace footsteps and head the other way. 
  // hit path, turn around and go the other way. if we reach the edge. 
  // this would require some way of keeping track of what side of the loop. you're on. 
  const upLeft = {y: pipe.location.y - 1, x: pipe.location.x - 1};
  const up = {y: pipe.location.y - 1, x: pipe.location.x};
  const upRight = {y: pipe.location.y - 1, x: pipe.location.x + 1};
  const right = {y: pipe.location.y, x: pipe.location.x + 1};
  const downRight = {y: pipe.location.y + 1, x: pipe.location.x + 1};
  const down = {y: pipe.location.y, x: pipe.location.x + 1};
  const downLeft = {y: pipe.location.y + 1, x: pipe.location.x - 1};
  const left = {y: pipe.location.y, x: pipe.location.x - 1};

  const adjacent = [up, right, down, left];
  adjacent.forEach((adj) => {
    if (
        adj.y === -1 || adj.y === grid.length ||
        adj.x === -1 || adj.x === grid[0].length ||
        grid[adj.y][adj.x].type === '#'
    ) {
      grid[adj.y][adj.x].type = '#';
      return true;
    }
    if (!grid[adj.y][adj.x].onPath && !coordsAlreadyFound(lookedAt, adj.y, adj.x)) {
      if (canEscape(grid[adj.y][adj.x], grid, lookedAt)) {
        grid[adj.y][adj.x].type = '*';
        return false;
      } else {
        grid[adj.y][adj.x].type = '#';
        return true;
      }
    }
  })
  
  // otherwise, we need to look for leaks.
  if (
    leaksOut(upLeft, up, 'down', grid, lookedAt) ||
    leaksOut(up, upRight, 'down', grid, lookedAt) ||
    leaksOut(upRight, right, 'left', grid, lookedAt) ||
    leaksOut(right, downRight, 'left', grid, lookedAt) ||
    leaksOut(downRight, down, 'up', grid, lookedAt) ||
    leaksOut(down, downLeft, 'up', grid, lookedAt) ||
    leaksOut(downLeft, left, 'right', grid, lookedAt) ||
    leaksOut(left, upLeft, 'right', grid, lookedAt)
  ) {
    grid[pipe.location.y][pipe.location.x].type = '#';
    return true;
  }

  grid[pipe.location.y][pipe.location.x].type = '*';
  return false;
}

const searchForPath = (pipe: Pipe, grid: Pipe[][], history: GridXY[]) => {
  let findPath = {y: pipe.location.y, x: pipe.location.x};
  while (findPath.x < grid[0].length && !grid[goLeft.y][goLeft.x].onPath) {
    findPath.x += 1;
  }
  history

  let goLeft = {y: pipe.location.y, x: pipe.location.x};
  while (goLeft.x > - 1 && !grid[goLeft.y][goLeft.x].onPath) {
    goLeft.x -= 1;
    history.push({goLeft.y, goLeft.x});
  }
  
  let goLeft = {y: pipe.location.y, x: pipe.location.x};
  while (goLeft.x > - 1 && !grid[goLeft.y][goLeft.x].onPath) {
    goLeft.x -= 1;
    history.push({goLeft.y, goLeft.x});
  }
}
// Data is read into a simple string[] and sent in here to format for specific prompts
export const solve = (
  data: string[], 
  part: number, 
  showLogs: boolean,
) => {
  console.log(":)")
  interface Pipe {
    type: PipeType,
    location: GridXY,
    onPath?: boolean
  }
  const grid: Pipe[][] = 
    data
    .map((line: string, y: number) => 
      line
        .split('')
        .map((type: string, x: number) => {
          return {type: type, location: {y, x}, onPath: false}
      }));
  let startCoords: GridXY = findStart(grid);
  let oneDirection: Path = findStartingPath(grid, startCoords); // not the boy band
  let otherDirection: Path = findStartingPath(grid, startCoords, oneDirection.next.location)
  const pathCoords: GridXY[] = [{...startCoords}];
  while (!checkEndCondition(oneDirection, otherDirection)) {
    moveAlong(oneDirection, grid, pathCoords, part);
    moveAlong(otherDirection, grid, pathCoords, part);
  }

  if (part === 1) {
    return oneDirection.distance;
  }
  if (part === 2) {
    console.log("GRID ORIGINALE");
    grid.forEach((line) => console.log(...line.map((pipe) => pipe.type)))

    // for testing, just so i can see where the path actually is
    console.log("PATH");
    grid.forEach((line) => 
      console.log(...line.map((pipe) => 
        pipe.onPath ? pipe.type : ' ')))

    //   first, go along the edges and basically squeeze in on the path, expand the border.
    //   can do that with standard grid exploration (just treat path as a wall, no need to check for gaps yet).
    expandBorder(grid);

    // grid.forEach((line) => 
    //   line.forEach((pipe) => {
    //     if (pipe.type !== '#' && pipe.type !== '*' && !pipe.onPath) {
    //       canEscape(pipe, grid);
    //     }
    //   })
    // )
    console.log("GRID WITH BORDERS SQUEEZED");
    grid.forEach((line) =>
      line.forEach((pipe) => {
        if (pipe.type !== '#' && pipe.type !== '*' && !pipe.onPath) {
          searchForPath(pipe, grid, []);
        }
      })
    )
    printGrid(grid, 'type');
    // grid.forEach((line) => 
    //   console.log(...line.map((pipe) => 
    //     pipe.type === '#' ? '#' :
    //       pipe.onPath 
    //         ? pipe.type 
    //         : ' '
    // )))
    // markEnclosures(grid);
    // console.log("Enclosures marked");
    // printGrid(grid, 'type');
    // then, iterate through the grid. every time we find a non-path pipe, call checkEnclosed. 
    // that should find an area, THEN check if it's enclosed. 
    // that will need to use standard grid exploration (check adjacents with the same function)
    // but ALSO use a different rule to explore gaps between pipes that lead out to the edge. 
    // if that area is enclosed (never reaches an edge), mark it with *.
    // if it reaches an edge, or a previously marked boundary pipe, mark it also the same. 
    // let enclosedPipes = 0;
    // grid.forEach((line) => 
    //   line.forEach((pipe) => 
    //     (pipe.type === '*') && enclosedPipes++
    // ))
    return grid.reduce((gridCount: number, b: Pipe[]) => 
      gridCount + b.reduce((lineCount: number, b: Pipe) => lineCount + (b.type === '*' ? 1 : 0), 0),
      0);
  }
}