import { GridXY, coordsAreLegal, printGrid } from "../../../util.js"


// TYPES 
interface Tile {
  energized: boolean;
  location: GridXY;
  thing: string;
}

interface Beam {
  current: Tile;
  enteredFrom: Direction;
  starts: GridXY[]; // todo: handle loops that could start at every | - traversal.
}

type Direction = 'up' | 'down' | 'left' | 'right';

function getNextFromUp(beam: Beam, grid: Tile[][]): void {
  switch (beam.current.thing) {
    case '.':
    case '|':
      if (coordsAreLegal({y: beam.current.location.y + 1, x: beam.current.location.x}, grid)) {
        traceBeam({...beam, current: grid[beam.current.location.y + 1][beam.current.location.x], enteredFrom: 'up'}, grid);
      }
      break;
    case '-': // in this case, we start two new beams that could be circular. 
      if (coordsAreLegal({y: beam.current.location.y, x: beam.current.location.x - 1}, grid)) {
        traceBeam({
          start: {y: beam.current.location.y, x: beam.current.location.x}, 
          current: grid[beam.current.location.y][beam.current.location.x - 1], 
          enteredFrom: 'right'
        }, grid);
      }
      if (coordsAreLegal({y: beam.current.location.y, x: beam.current.location.x + 1}, grid)) {
        traceBeam({
          start: {y: beam.current.location.y, x: beam.current.location.x}, 
          current: grid[beam.current.location.y][beam.current.location.x + 1], 
          enteredFrom: 'left'
        }, grid);
      }
      break;
    case '\\':
      if (coordsAreLegal({y: beam.current.location.y, x: beam.current.location.x + 1}, grid)) {
        traceBeam({...beam, current: grid[beam.current.location.y][beam.current.location.x + 1], enteredFrom: 'left'}, grid);
      }
      break;
    case '/':
      if (coordsAreLegal({y: beam.current.location.y, x: beam.current.location.x - 1}, grid)) {
        traceBeam({...beam, current: grid[beam.current.location.y][beam.current.location.x - 1], enteredFrom: 'right'}, grid);
      }
      break;
  }
}
function getNextFromDown(beam: Beam, grid: Tile[][]): void {
  switch (beam.current.thing) {
    case '.':
    case '|':
      if (coordsAreLegal({y: beam.current.location.y - 1, x: beam.current.location.x}, grid)) {
        traceBeam({...beam, current: grid[beam.current.location.y - 1][beam.current.location.x], enteredFrom: 'down'}, grid);
      }
      break;
    case '-': // in this case, we start two new beams that could be circular. 
      if (coordsAreLegal({y: beam.current.location.y, x: beam.current.location.x - 1}, grid)) {
        traceBeam({
          start: {y: beam.current.location.y, x: beam.current.location.x},
          current: grid[beam.current.location.y][beam.current.location.x - 1], 
          enteredFrom: 'right'
        }, grid);
      }
      if (coordsAreLegal({y: beam.current.location.y, x: beam.current.location.x + 1}, grid)) {
        traceBeam({
          start: {y: beam.current.location.y, x: beam.current.location.x},
          current: grid[beam.current.location.y][beam.current.location.x + 1],
          enteredFrom: 'left'
        }, grid);
      }
      break;
    case '\\':
      if (coordsAreLegal({y: beam.current.location.y, x: beam.current.location.x - 1}, grid)) {
        traceBeam({...beam, current: grid[beam.current.location.y][beam.current.location.x - 1], enteredFrom: 'right'}, grid);
      }
      break;
    case '/':
      if (coordsAreLegal({y: beam.current.location.y, x: beam.current.location.x + 1}, grid)) {
        traceBeam({...beam, current: grid[beam.current.location.y][beam.current.location.x + 1], enteredFrom: 'left'}, grid);
      }
      break;
  }
}
function getNextFromLeft(beam: Beam, grid: Tile[][]): void {
  switch (beam.current.thing) {
    case '.':
    case '-':
      if (coordsAreLegal({y: beam.current.location.y, x: beam.current.location.x + 1}, grid)) {
        traceBeam({...beam, current: grid[beam.current.location.y][beam.current.location.x + 1], enteredFrom: 'left'}, grid);
      }
      break;
    case '|': // in this case, we start two new beams that could be circular. 
      if (coordsAreLegal({y: beam.current.location.y - 1, x: beam.current.location.x}, grid)) {
        traceBeam({
          start: {y: beam.current.location.y, x: beam.current.location.x}, 
          current: grid[beam.current.location.y - 1][beam.current.location.x], 
          enteredFrom: 'down'
        }, grid);
      }
      if (coordsAreLegal({y: beam.current.location.y + 1, x: beam.current.location.x}, grid)) {
        traceBeam({
          start: {y: beam.current.location.y, x: beam.current.location.x}, 
          current: grid[beam.current.location.y + 1][beam.current.location.x], 
          enteredFrom: 'up'
        }, grid);
      }
      break;
    case '\\':
      if (coordsAreLegal({y: beam.current.location.y + 1, x: beam.current.location.x}, grid)) {
        traceBeam({...beam, current: grid[beam.current.location.y + 1][beam.current.location.x], enteredFrom: 'up'}, grid);
      }
      break;
    case '/':
      if (coordsAreLegal({y: beam.current.location.y - 1, x: beam.current.location.x}, grid)) {
        traceBeam({...beam, current: grid[beam.current.location.y - 1][beam.current.location.x], enteredFrom: 'down'}, grid);
      }
      break;
  }
}
function getNextFromRight(beam: Beam, grid: Tile[][]): void {
  switch (beam.current.thing) {
    case '.':
    case '-':
      if (coordsAreLegal({y: beam.current.location.y, x: beam.current.location.x - 1}, grid)) {
        traceBeam({...beam, current: grid[beam.current.location.y][beam.current.location.x - 1], enteredFrom: 'right'}, grid);
      }
      break;
    case '|': // in this case, we start two new beams that could be circular. 
      if (coordsAreLegal({y: beam.current.location.y - 1, x: beam.current.location.x}, grid)) {
        traceBeam({
          start: {y: beam.current.location.y, x: beam.current.location.x}, 
          current: grid[beam.current.location.y - 1][beam.current.location.x], 
          enteredFrom: 'down'
        }, grid);
      }
      if (coordsAreLegal({y: beam.current.location.y + 1, x: beam.current.location.x}, grid)) {
        traceBeam({
          start: {y: beam.current.location.y, x: beam.current.location.x}, 
          current: grid[beam.current.location.y + 1][beam.current.location.x], 
          enteredFrom: 'up'
        }, grid);
      }
      break;
    case '\\':
      if (coordsAreLegal({y: beam.current.location.y - 1, x: beam.current.location.x}, grid)) {
        traceBeam({...beam, current: grid[beam.current.location.y - 1][beam.current.location.x], enteredFrom: 'down'}, grid);
      }
      break;
    case '/':
      if (coordsAreLegal({y: beam.current.location.y + 1, x: beam.current.location.x}, grid)) {
        traceBeam({...beam, current: grid[beam.current.location.y + 1][beam.current.location.x], enteredFrom: 'up'}, grid);
      }
      break;
  }
}

function traceBeam(beam: Beam, grid: Tile[][]): void {
  console.log(beam.current.location, beam.starts)
  if (beam.starts.length) {
    if (
      beam.starts.find((start) => {
        return (
          start.y === beam.current.location.y &&
          start.x === beam.current.location.x
        )
      })
    ) {
      return;
    }
  } else {
    beam.starts.push({y: beam.current.location.y, x: beam.current.location.x});
  }
  grid[beam.current.location.y][beam.current.location.x].energized = true; // set curr to energized before finding next
  switch (beam.enteredFrom) {
    case 'up': 
      getNextFromUp(beam, grid);
      break;
    case 'down':
      getNextFromDown(beam, grid);
      break;
    case 'left': 
      getNextFromLeft(beam, grid);
      break;
    case 'right':
      getNextFromRight(beam, grid);
      break;
  }
}

// READ THE DATA
function convertToTiles(data: string[]) {
  const tiles: Tile[][] = [];
  data.forEach((line: string, y: number) => {
    const tileRow: Tile[] = [];
    line.split("").forEach((char: string, x: number) => {
      tileRow.push({
        energized: false,
        location: {y, x},
        thing: char,
      })
    })
    tiles.push([...tileRow])
  })
  return tiles;
}
// USEFUL INFO

// PART 1 STUFF

// PART 2 STUFF

// Data is read into a simple string[] and sent in here to format for specific prompts
export const solve = (
  data: string[], 
  part: number, 
  showLogs: boolean,
) => { 
  console.log(":)")
  const tiles: Tile[][] = convertToTiles([...data]);
  printGrid(tiles, 'thing')
  const initialBeam: Beam = {
    current: tiles[0][0],
    enteredFrom: 'left',
    starts: [],
  };
  traceBeam(initialBeam, tiles);

  let energizedTiles: number = 0;
  tiles.forEach((col: Tile[]) => {
    col.forEach((row: Tile) => {
      row.energized && energizedTiles++;
    })
  })
  return energizedTiles;
}