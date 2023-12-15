import { GridXY, printGrid } from "../../../util.js"

// TYPES 
interface Point {
  location: GridXY,
  id: number, // id -1 = empty space. id > -1 = galaxy. 
  pathsToRest: Path[],
}
interface Path {
  start: GridXY,
  destination: GridXY,
  distance: number,
}
type Universe = Point[][];

// USEFUL INFO
  // > Only count each pair once; order within the pair doesn't matter. 
  // > For each pair, find any shortest path between the two galaxies 
  // > using only steps that move up, down, left, or right exactly one . or # at a time.
  // > The shortest path between two galaxies is allowed to pass through another galaxy.

  // so.. every galaxy will have one closest? 
  // ah i see now its just find every unique path. not find smallest paths. 

// PART 1 STUFF
function expandUniverse(universe: string[][]): string[][] {
  // assume all rows and cols in the universe are empty
  const colIdxsToDuplicate: Set<number> = new Set(Array(universe[0].length).keys())
  const rowIdxsToDuplicate: Set<number> = new Set(Array(universe.length).keys());

  // then whenever we find a galaxy, note the row/col idxs to duplicate
  universe.forEach((col: string[], y: number) => {
    col.forEach((row: string, x: number) => {
      if (universe[y][x] === '#') {
        colIdxsToDuplicate.delete(x);
        rowIdxsToDuplicate.delete(y);
      }
    })
  })

  // of the remaining cols, rows, of empty space, duplicate them inplace with splice.
  let colsInserted: number = 0;
  colIdxsToDuplicate.forEach((colIdx: number) => {
    universe.forEach((col: string[], y: number) => {
      universe[y].splice(colIdx + colsInserted, 0, '.')
    })
    colsInserted++;
  });
  let rowsInserted: number = 0;
  rowIdxsToDuplicate.forEach((rowIdx: number) => {
    const newRow: string[] = new Array(universe[0].length).fill('.'); // make a row of empty Point objects, then insert the row.
    universe.splice(rowIdx + rowsInserted, 0, newRow)
    rowsInserted++;
  })

  return universe;
}

function convertUniverseToPointsInSpace(data: string[][]): Point[][] {
  const res: Point[][] = [];
  let universeId = 1;
  data.forEach((line: string[], y: number) => {
    const row: Point[] = [];
    line.forEach((point: string, x: number) => {
      row.push({
        location: {y, x},
        id: point === '#' ? universeId : -1,
        pathsToRest: [],
      })
      point === '#' && universeId++;
    })
    res.push(row)
  })
  return res;
}



function navigationOfTheUniverse(
  universe: Universe, 
  useCommonSense = false, 
  expandColIdxs?: Set<number>, 
  expandRowIdxs?: Set<number>
): Path[] {
  const galaxyTraversal: Path[] = [];
  const galaxies: Point[] = universe.reduce((a: Point[], b: Point[]) => {
    b.filter((point) => point.id > -1).forEach((galaxy) => a.push(galaxy));
    return a;
  }, []);
  galaxies.forEach((currentGalaxy: Point, i: number) => {
    galaxies.forEach((targetGalaxy: Point, j: number) => {
      if (i !== j) { // dont need to find the path to itself.
        if (i < j) { // find a new route.
          const newPath: Path = 
            useCommonSense 
              ? autoPilot(currentGalaxy.location, targetGalaxy.location, expandColIdxs!, expandRowIdxs!)
              : navigate(currentGalaxy.location, targetGalaxy.location)
          currentGalaxy.pathsToRest.push(newPath)
          galaxyTraversal.push(newPath)
        } else { // if at galaxy 2, looking at galaxy 1, we would have already found the path from 1 to 2, so retrieve that.
          const previouslyFoundPath = galaxies[j].pathsToRest.find((path, i) => {
            if (
              path.destination.y === currentGalaxy.location.y &&
              path.destination.x === currentGalaxy.location.x
            ) {
              return true;
            }
          })!
          currentGalaxy.pathsToRest.push({
            ...previouslyFoundPath,
            start: {...previouslyFoundPath.destination},
            destination: {...previouslyFoundPath.start},
          });
        }
      }
    })
  })
  return galaxyTraversal;
}

function navigate(a: GridXY, b: GridXY): Path { // to check if this path was already found 
  let distance: number = 0;
  let y: number = a.y;
  let x: number = a.x;
  while (y < b.y) {
    y++;
    distance++;
  }
  while (y > b.y) {
    y--;
    distance++;
  }  
  while (x < b.x) {
    x++;
    distance++;
  }  
  while (x > b.x) {
    x--;
    distance++;
  }
  return {
    start: {...a},
    distance,
    destination: {...b},
  }
}

function autoPilot(a: GridXY, b: GridXY, expandColIdxs: Set<number>, expandRowIdxs: Set<number>): Path { // to check if this path was already found 
  const EXPANSION_RATE = 1000000; // could pass this in if a variable, etc. but just hardcoding it for part 2
  let distance: number = 0;
  let y: number = a.y;
  let x: number = a.x;
  while (y < b.y) {
    // if its a col that should be expanded, assume we're moving across all those expanded cols.
    // pass cols when moving with x, pass rows when moving with y.
    y++;
    distance += expandRowIdxs.has(y) ? EXPANSION_RATE : 1;
  }
  while (y > b.y) {
    y--;
    distance += expandRowIdxs.has(y) ? EXPANSION_RATE : 1;
  }  
  while (x < b.x) {
    x++;
    distance += expandColIdxs.has(x) ? EXPANSION_RATE : 1;
  }  
  while (x > b.x) {
    x--;
    distance += expandColIdxs.has(x) ? EXPANSION_RATE : 1;
  }
  return {
    start: {...a},
    distance,
    destination: {...b},
  }
}


// PART 2 STUFF
// man I had this feeling before, that there was no need to actually expand the universe
// just count more when navigating across a row/col that should be expanded.
// I just wanted to do it the simple way for the cool-sounding function names and graphically representational console logs
function findExpansesInUniverse(universe: string[][]) {
  const expandedColIdxs: Set<number> = new Set(Array(universe[0].length).keys())
  const expandedRowIdxs: Set<number> = new Set(Array(universe.length).keys());
  universe.forEach((col: string[], y: number) => {
    col.forEach((row: string, x: number) => {
      if (universe[y][x] === '#') {
        expandedColIdxs.delete(x);
        expandedRowIdxs.delete(y);
      }
    })
  })
  return {expandedColIdxs, expandedRowIdxs}
}



// Data is read into a simple string[] and sent in here to format for specific prompts
export const solve = (
  data: string[], 
  part: number, 
  showLogs: boolean,
) => {
  if (part === 1) {
    showLogs && console.log('expanded universe')
    const expandedUniverse: string[][] = expandUniverse(data.map((line) => line.split("")));
    showLogs && printGrid(expandedUniverse);
  
    showLogs && console.log('universe as points')
    const universe: Universe = convertUniverseToPointsInSpace(expandedUniverse);
    showLogs && printGrid(universe, 'id', {convert: -1, to: '.'});
    
    const galaxyTraversal: Path[] = navigationOfTheUniverse(universe);
    return galaxyTraversal.reduce((a,b) => 
      a + b.distance,
      0
    );
  }
  if (part === 2) {
    const universeDivided: string[][] = data.map((line) => line.split(""))
    const {
      expandedColIdxs,
      expandedRowIdxs,
    } = findExpansesInUniverse(universeDivided)
    const universe: Universe = convertUniverseToPointsInSpace(universeDivided);
    const moreReasonableGalaxyTraversal: Path[] = navigationOfTheUniverse(universe, true, expandedColIdxs, expandedRowIdxs);
    return moreReasonableGalaxyTraversal.reduce((a,b) => 
      a + b.distance,
      0
    );
  }
}