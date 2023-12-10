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
  distance: number,
}
type PipeType = '|' | '-' | 'L' | 'J' | '7' | 'F' | string
type PipeNavigation = Map<PipeType, Function>;
const PipeTypes: PipeType[] = ['|', '-', 'L', 'J', '7', 'F'];

const handleVertical = (prev: Coords, curr: Pipe, grid: string[][]): Pipe => {
  return prev.y < curr.location.y
    ? {type: grid[prev.y + 2][prev.x], location: {y: prev.y + 2, x: prev.x}} // south
    : {type: grid[prev.y - 2][prev.x], location: {y: prev.y - 2, x: prev.x}} // north
}
const handleHorizontal = (prev: Coords, curr: Pipe, grid: string[][]): Pipe => {
  return prev.x < curr.location.x
    ? {type: grid[prev.y][prev.x + 2], location: {y: prev.y, x: prev.x + 2}} // east
    : {type: grid[prev.y][prev.x - 2], location: {y: prev.y, x: prev.x - 2}} // west
}
const handleL = (prev: Coords, curr: Pipe, grid: string[][]): Pipe => {
  return prev.x === curr.location.x
    ? {type: grid[prev.y - 1][prev.x - 1], location: {y: prev.y - 1, x: prev.x - 1}} // northwest
    : {type: grid[prev.y + 1][prev.x + 1], location: {y: prev.y + 1, x: prev.x + 1}} // southeast
}
const handleJ = (prev: Coords, curr: Pipe, grid: string[][]): Pipe => {
  return prev.x === curr.location.x
  ? {type: grid[prev.y - 1][prev.x + 1], location: {y: prev.y - 1, x: prev.x + 1}} // northeast
  : {type: grid[prev.y + 1][prev.x - 1], location: {y: prev.y + 1, x: prev.x - 1}} // southwest
}
const handle7 = (prev: Coords, curr: Pipe, grid: string[][]): Pipe => {
  return prev.x === curr.location.x
  ? {type: grid[prev.y + 1][prev.x + 1], location: {y: prev.y + 1, x: prev.x + 1}} // southeast
  : {type: grid[prev.y - 1][prev.x - 1], location: {y: prev.y - 1, x: prev.x - 1}} // southwest
}
const handleF = (prev: Coords, curr: Pipe, grid: string[][]): Pipe => {
  return prev.x === curr.location.x
  ? {type: grid[prev.y + 1][prev.x - 1], location: {y: prev.y + 1, x: prev.x - 1}} // southwest
  : {type: grid[prev.y - 1][prev.x + 1], location: {y: prev.y - 1, x: prev.x + 1}} // northeast
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
  const handlerToCall: Function = Guide.get(path.current.type)!;
  // TODO implement some kind of prev, current, next functionality for this. 
  // both paths should be finding the next, but curr still as S. 
  // moveAlong should call the handler, so it will need the next locations data. 
  // curr is S, next is |. 
  // so handler returns curr is |, next is L. 
  // so handler returns curr is L next is J..
}

const checkEndCondition = (path1: Path, path2: Path) => {
  return (
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
    // next: ...  todo
    distance: 0,
  }
  const coordsToCheck: Coords[] = [
    {y: start.y - 1, x: start.x}, 
    {y: start.y + 1, x: start.x}, 
    {y: start.y, x: start.x - 1}, 
    {y: start.y, x: start.x + 1}, 
  ];
  coordsToCheck.forEach((adjacent: Coords) => {
    if (
      coordsAreLegal(adjacent.y, adjacent.x, grid) && // make sure it's in bounds first
      (
        !alreadyFound || 
        adjacent.y !== alreadyFound.y && adjacent.x !== alreadyFound.x
      )
    ) {
      if (PipeTypes.includes(grid[adjacent.y][adjacent.x])) {
        result.current.type = grid[adjacent.y][adjacent.x];
        result.current.location.y = adjacent.y;
        result.current.location.x = adjacent.x;
      }
    }
  })
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
  let otherDirection: Path = findStartingPath(grid, start, oneDirection.current.location)
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