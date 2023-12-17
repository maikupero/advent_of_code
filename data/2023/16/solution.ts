import { GridXY, coordsAreLegal } from "../../../util.js"

// TYPES 
interface Tile {
  energized: boolean;
  location: GridXY;
  thing: string;
}

interface Beam {
  current: Tile;
  enteredFrom: Direction;
}

type Direction = 'up' | 'down' | 'left' | 'right';

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
          current: grid[beam.current.location.y][beam.current.location.x - 1], 
          enteredFrom: 'right'
        }, grid);
      }
      if (coordsAreLegal({y: beam.current.location.y, x: beam.current.location.x + 1}, grid)) {
        traceBeam({
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
          current: grid[beam.current.location.y][beam.current.location.x - 1], 
          enteredFrom: 'right'
        }, grid);
      }
      if (coordsAreLegal({y: beam.current.location.y, x: beam.current.location.x + 1}, grid)) {
        traceBeam({
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
          current: grid[beam.current.location.y - 1][beam.current.location.x], 
          enteredFrom: 'down'
        }, grid);
      }
      if (coordsAreLegal({y: beam.current.location.y + 1, x: beam.current.location.x}, grid)) {
        traceBeam({
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
          current: grid[beam.current.location.y - 1][beam.current.location.x], 
          enteredFrom: 'down'
        }, grid);
      }
      if (coordsAreLegal({y: beam.current.location.y + 1, x: beam.current.location.x}, grid)) {
        traceBeam({
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
  // realized I don't need to keep track of paths or history or potential loop spots.
  // because if I reach a | or -, and it's energized already, I can return. 
  // if |, if we'd already been there from up or bottom, we would've covered both possible resultant paths 
  // that would have started if we approached it from either side. so just the below, to stop looping. 
  if (
    beam.current.thing === '|' && 
    (beam.enteredFrom === 'left' || beam.enteredFrom === 'right')
  ) {
    if (beam.current.energized) return
  } 
  if (
    beam.current.thing === '-' &&
    (beam.enteredFrom === 'up' || beam.enteredFrom === 'down')
  ) {
    if (beam.current.energized) return;
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

// PART 1 STUFF
function allThePart1Stuff(start: GridXY, enteredFrom: Direction, tiles: Tile[][]): number {
  const initialBeam: Beam = {
    current: tiles[start.y][start.x],
    enteredFrom,
  };
  traceBeam(initialBeam, [...tiles]);

  let energizedTiles: number = 0;
  tiles.forEach((col: Tile[]) => {
    col.forEach((row: Tile) => {
      row.energized && energizedTiles++;
    })
  })
  return energizedTiles;
}

// Data is read into a simple string[] and sent in here to format for specific prompts
export const solve = (
  data: string[], 
  part: number, 
  showLogs: boolean,
) => { 
  console.log(":)")
  const tiles: Tile[][] = convertToTiles([...data]);

  if (part === 1) {
    return allThePart1Stuff({y: 0, x: 0}, 'left', [...tiles])
  }
  
  // i know now you could optimize this by tracking loops. 
  // if you ever enter a loop on a new configuration, just count it. 
  // better  yet, i could just cache results from the helper functions based on direction and start location. 
  if (part === 2) {
    let maxTileCount: number = 0; 
    for (let i = 0; i < tiles[0].length; i++) { 
      maxTileCount = Math.max(
        maxTileCount, allThePart1Stuff({y: 0, x: i}, 'up', convertToTiles([...data]))
      );
    }
    for (let i = 0; i < tiles[0].length; i++) {
      maxTileCount = Math.max(
        maxTileCount, allThePart1Stuff({y: tiles.length - 1, x: i}, 'down', convertToTiles([...data]))
      );
    }
    for (let i = 0; i < tiles.length; i++) {
      maxTileCount = Math.max(
        maxTileCount, allThePart1Stuff({y: i, x: 0}, 'left', convertToTiles([...data]))
      );
    }
    for (let i = 0; i < tiles.length; i++) {
      maxTileCount = Math.max(
        maxTileCount, allThePart1Stuff({y: i, x: tiles[0].length - 1}, 'right', convertToTiles([...data]))
      );
    }
    return maxTileCount
  }
}