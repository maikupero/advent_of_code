import { GridXY, coordsAreLegal, coordsMatch, printGrid } from "../../../util.js"

// TYPES 
interface Block {
  location: GridXY,
  heatLoss: number,
}

interface Path {
  steps: GridXY[],
  current: GridXY,
  heatLost: number,
  movementLimit: number,
  enteredFrom: Direction,
}
type Direction = 'up' | 'down' | 'left' | 'right';
type CrucibleDirection = 'straight' | 'left' | 'right';
type City = Block[][];

function createUpdatedPath(pathToCopy: Path, nextBlock: Block, city: City) {
  const copiedSteps: GridXY[] = [];
  pathToCopy.steps.forEach((step: GridXY) => {
    copiedSteps.push({...step});
  })
  const res = {
    ...pathToCopy,
    steps: copiedSteps,
    current: {...pathToCopy.current},
  }
  return res;
}

function cityAt(coords: GridXY, city: City): Block {
  return city[coords.y][coords.x]
}

function getNextCoords(current: GridXY, cameFrom: Direction, going: CrucibleDirection): GridXY {
  switch (cameFrom) {
    case 'left':
      switch (going) {
        case 'straight': 
          return {y: current.y, x: current.x + 1};
        case 'left': 
          return {y: current.y - 1, x: current.x};
        case 'right': 
          return {y: current.y + 1, x: current.x};
      }
    case 'right': 
      switch (going) {
        case 'straight': 
          return {y: current.y, x: current.x - 1};
        case 'left': 
          return {y: current.y + 1, x: current.x};
        case 'right': 
          return {y: current.y - 1, x: current.x};
      }
    case 'up':
      switch (going) {
        case 'straight': 
          return {y: current.y + 1, x: current.x};
        case 'left': 
          return {y: current.y, x: current.x + 1};
        case 'right': 
          return {y: current.y, x: current.x - 1};
      }
    case 'down':
      switch (going) {
        case 'straight': 
          return {y: current.y - 1, x: current.x};
        case 'left': 
          return {y: current.y, x: current.x - 1};
        case 'right': 
          return {y: current.y, x: current.x + 1};
      }
  }
}

// READ THE DATA
function convertDataIntoBlocks(data: string[]): City {
  const res: City = [];
  data.forEach((line: string, y: number) => {
    const lineOfBlocks: Block[] = [];
    line.split("").forEach((char: string, x: number) => {
      lineOfBlocks.push({
        location: {y, x},
        heatLoss: parseInt(char),
      })
    })
    res.push(lineOfBlocks);
  })
  return res;
}
// USEFUL INFO

// PART 1 STUFF
function pathfind(path: Path, city: City, allPaths: Path[]) {
  if (coordsMatch(path.current, {y: city.length, x: city[0].length})) {
    allPaths.push(path); // break condition - path has reached the end.
    return;
  }
  if (path.movementLimit < 3) { // only check paths going straight if we haven't moved 3 before turning yet.
    const pathGoingStraight: Path | undefined = updatePath(path, 'straight', city);
    pathGoingStraight && pathfind(pathGoingStraight, city, allPaths);
  }
  const pathGoingLeft: Path | undefined = updatePath(path, 'left', city);
  pathGoingLeft && pathfind(pathGoingLeft, city, allPaths);
  const pathGoingRight: Path | undefined = updatePath(path, 'right', city);
  pathGoingRight && pathfind(pathGoingRight, city, allPaths);
}

function updatePath(path: Path, direction: CrucibleDirection, city: City): Path | undefined {
  const nextCoords: GridXY = getNextCoords(path.current, path.enteredFrom, direction);
  if (!coordsAreLegal(nextCoords, city)) return undefined; // this potential path goes out of bounds
  const updatedPath: Path = createUpdatedPath(path, nextCoords, city);
  return updatedPath;
}
// PART 2 STUFF

// Data is read into a simple string[] and sent in here to format for specific prompts
export const solve = (
  data: string[], 
  part: number, 
  showLogs: boolean,
) => {
  console.log(":)")

  const city: City = convertDataIntoBlocks([...data]);
  printGrid(city, 'heatLoss')

  const START = {y: 0, x: 0};
  const initialPath: Path = {
    steps: [],
    current: {...START},
    heatLost: 0, // you don't incur heat loss from the first block unless you return to it..? which we will not. 
    movementLimit: 0, // starting at 0, 0, didn't move to there.
    enteredFrom: 'left',
  }

  const allPossiblePaths: Path[] = [];
  pathfind(initialPath, city, allPossiblePaths);
  return allPossiblePaths.reduce((a: number, b: Path) => a + b.heatLost, 0)
}