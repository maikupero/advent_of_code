import { coordsAreLegal } from "../../../util.js";

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
// followPipe(start: Coords, pipe: Pipe)


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


// TYPES 
interface Coords {
  y: number,
  x: number,
}
interface Pipe {
  type: PipeType,
  location: Coords,
}
interface Path {
  current: Pipe,
  next: Pipe,
  distance: number,
}
type PipeType = '|' | '-' | 'L' | 'J' | '7' | 'F' | string
type PipeNavigation = Map<PipeType, Function>;
const PipeTypes: PipeType[] = ['|', '-', 'L', 'J', '7', 'F'];

const handleVertical = (path: Path, grid: string[][]): Pipe => {
  return path.current.location.y < path.next.location.y
    ? {type: grid[path.current.location.y + 2][path.current.location.x], location: {y: path.current.location.y + 2, x: path.current.location.x}} // south
    : {type: grid[path.current.location.y - 2][path.current.location.x], location: {y: path.current.location.y - 2, x: path.current.location.x}} // north
  
}
const handleHorizontal = (path: Path, grid: string[][]): Pipe => {
  return path.current.location.x < path.next.location.x
    ? {type: grid[path.current.location.y][path.current.location.x + 2], location: {y: path.current.location.y, x: path.current.location.x + 2}} // east
    : {type: grid[path.current.location.y][path.current.location.x - 2], location: {y: path.current.location.y, x: path.current.location.x - 2}} // west
}
const handleL = (path: Path, grid: string[][]): Pipe => {
  return path.current.location.y === path.next.location.y
    ? {type: grid[path.current.location.y - 1][path.current.location.x - 1], location: {y: path.current.location.y - 1, x: path.current.location.x - 1}} // northwest
    : {type: grid[path.current.location.y + 1][path.current.location.x + 1], location: {y: path.current.location.y + 1, x: path.current.location.x + 1}} // southeast
}
const handleJ = (path: Path, grid: string[][]): Pipe => {
  console.log(path.current.location, path.next.location);
  return path.current.location.y === path.next.location.y
  ? {type: grid[path.current.location.y - 1][path.current.location.x + 1], location: {y: path.current.location.y - 1, x: path.current.location.x + 1}} // northeast
  : {type: grid[path.current.location.y + 1][path.current.location.x - 1], location: {y: path.current.location.y + 1, x: path.current.location.x - 1}} // southwest
}
const handle7 = (path: Path, grid: string[][]): Pipe => {
  return path.current.location.y === path.next.location.y
  ? {type: grid[path.current.location.y + 1][path.current.location.x + 1], location: {y: path.current.location.y + 1, x: path.current.location.x + 1}} // southeast
  : {type: grid[path.current.location.y - 1][path.current.location.x - 1], location: {y: path.current.location.y - 1, x: path.current.location.x - 1}} // southwest
}
const handleF = (path: Path, grid: string[][]): Pipe => {
  return path.current.location.y === path.next.location.y
  ? {type: grid[path.current.location.y + 1][path.current.location.x - 1], location: {y: path.current.location.y + 1, x: path.current.location.x - 1}} // southwest
  : {type: grid[path.current.location.y - 1][path.current.location.x + 1], location: {y: path.current.location.y - 1, x: path.current.location.x + 1}} // northeast
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
const moveAlong = (path: Path, grid: string[][]) => {
  const handlerToCall: Function = Guide.get(path.next.type)!;
  console.log(handlerToCall);
  const newNext: Pipe = handlerToCall(path, grid);
  console.log(newNext)
  path.current.location.x = path.next.location.x;
  path.current.location.y = path.next.location.y; // next -> current
  path.current.type = path.next.type; 
  path.next.location.x = newNext.location.x;
  path.next.location.y = newNext.location.y; // new next -> next
  path.next.type = newNext.type;
  path.distance++;
  
  
  // [path.current.location.x, path.current.location.y, path.current.type] = [path.next.location.x, path.next.location.y, path.next.type]; // next -> current
  // [path.next.location.x, path.next.location.y, path.next.type] = [newNext.location.x, newNext.location.y, newNext.type]; // new next -> next
  
  // TODO implement some kind of prev, current, next functionality for this. 
  // both paths should be finding the next, but curr still as S. 
  // moveAlong should call the handler, so it will need the next locations data. 
  // curr is S, next is |. 
  // so handler returns curr is |, next is L. 
  // so handler returns curr is L next is J..
}

const checkEndCondition = (path1: Path, path2: Path) => {
  return (
    path1.distance > 0 &&
    path1.current.location.x === path2.current.location.x &&
    path1.current.location.y === path2.current.location.y
  )
}


// Starts us off
const findStart = (grid: string[][]) => {
  let start = {x: 0, y: 0};
  grid.forEach((col, y) => {
    col.forEach((row, x) => {
      if (grid[y][x] === 'S') {
        start = {y, x};
      }
    })
  });
  return start;
}

const findStartingPath = (grid: string[][], start: Coords, alreadyFound?: Coords): Path => {
  const result: Path = {
    current: {
      type: 'S',
      location: {
        y: start.y,
        x: start.x,
      },
    },
    next: {
      type: 'S',
      location: {
        y: start.y,
        x: start.x,
      },
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
      coordsAreLegal(adjacent.y, adjacent.x, grid) && // make sure it's in bounds first
      (
        !alreadyFound || 
        !(adjacent.y === alreadyFound.y && adjacent.x === alreadyFound.x)
      )
    ) {
      if (adjacent.legal.includes(grid[adjacent.y][adjacent.x])) {
        result.next.type = grid[adjacent.y][adjacent.x];
        result.next.location.y = adjacent.y;
        result.next.location.x = adjacent.x;
        return result;
      }
    }
  }
  return result;
}


// PART 2 STUFF

// Data is read into a simple string[] and sent in here to format for specific prompts
export const solve = (
  data: string[], 
  part: number, 
  showLogs: boolean,
) => {
  console.log(":)")
  const grid: string[][] = data.map((line: string) => line.split(''));
  console.log(grid)
  let start: Coords = findStart(grid);
  console.log('Start:', start);

  let oneDirection: Path = findStartingPath(grid, start);
  console.log('oneDirection', oneDirection)
  let otherDirection: Path = findStartingPath(grid, start, oneDirection.next.location)
  console.log('otherDirection', otherDirection)

  while (!checkEndCondition(oneDirection, otherDirection)) {
    console.log(oneDirection.distance);
    moveAlong(oneDirection, grid);
    console.log(oneDirection.current);
    moveAlong(otherDirection, grid);
    console.log(otherDirection.current);
  }

  return oneDirection.distance;
}