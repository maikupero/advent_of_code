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
// READ THE DATA

// USEFUL INFO
  // > Only count each pair once; order within the pair doesn't matter. 
  // > For each pair, find any shortest path between the two galaxies 
  // > using only steps that move up, down, left, or right exactly one . or # at a time.
  // > The shortest path between two galaxies is allowed to pass through another galaxy.

  // so.. every galaxy will have one closest 
// PART 1 STUFF
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

function expandUniverse(universe: Universe): void {
  // assume all rows and cols in the universe are empty
  const colIdxsToDuplicate: Set<number> = new Set(Array(universe[0].length).keys())
  const rowIdxsToDuplicate: Set<number> = new Set(Array(universe.length).keys());

  // then whenever we find a galaxy, note the row/col idxs to duplicate
  universe.forEach((col: Point[], y: number) => {
    col.forEach((row: Point, x: number) => {
      if (universe[y][x].id > -1) {
        colIdxsToDuplicate.delete(x);
        rowIdxsToDuplicate.delete(y);
      }
    })
  })

  // of the remaining cols, rows, of empty space, duplicate them inplace with splice.
  let colsInserted: number = 0;
  colIdxsToDuplicate.forEach((colIdx: number) => {
    universe.forEach((col: Point[], y: number) => {
      universe[y].splice( // insert a -1 Point on every row (empty space row)
        colIdx + colsInserted, 
        0, 
        {
          location: {y, x: colIdx}, 
          id: -1, 
          pathsToRest: []
        },
      )
    })
    colsInserted++;
  });
  let rowsInserted: number = 0;
  rowIdxsToDuplicate.forEach((rowIdx: number) => {
    const newRow: Point[] = []; // make a row of empty Point objects, then insert the row.
    for (let i = 0; i < universe[0].length; i++) {
      newRow.push({
        location: {y: rowIdx, x: i}, 
        id: -1, 
        pathsToRest: []
      })
    }
    universe.splice(rowIdx + rowsInserted, 0, newRow)
    rowsInserted++;
  })
}

function navigationOfTheUniverse(universe: Universe): Point[] {
  const galaxies: Point[] = universe.reduce((a: Point[], b: Point[]) => {
    b.filter((point) => point.id > -1).forEach((galaxy) => a.push(galaxy));
    return a;
  }, []);
  galaxies.forEach((currentGalaxy: Point, i: number) => {
    galaxies.forEach((targetGalaxy: Point, j: number) => {
      if (i !== j) {
        if (i < j) { // find a new route.
          currentGalaxy.pathsToRest.push(navigate(currentGalaxy.location, targetGalaxy.location, universe))
        } else { // if at galaxy 2, looking at galaxy 1, we would have already found the path from 1 to 2, so retrieve that.
          // let previouslyFoundPathIdx: number = 0;
          // const previouslyFoundPath = galaxies[j].pathsToRest.find((path, i) => {
          //   if (
          //     path.destination.y === currentGalaxy.location.y &&
          //     path.destination.x === currentGalaxy.location.x
          //   ) {
          //     previouslyFoundPathIdx = i;
          //     return true;
          //   }
          // })!
          // currentGalaxy.pathsToRest.push({
          //   ...previouslyFoundPath,
          //   start: {...previouslyFoundPath.destination},
          //   destination: {...previouslyFoundPath.start},
          // });
        }
      }
    })
  })
  return galaxies;
}

function navigate(a: GridXY, b: GridXY, universe: Universe) { // to check if this path was already found 
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


// PART 2 STUFF

// Data is read into a simple string[] and sent in here to format for specific prompts
export const solve = (
  data: string[], 
  part: number, 
  showLogs: boolean,
) => {
  // redo this to expand universe then convert it to points so galaxy location is preserved
  console.log('expanded universe')
  const expandedUniverse: string[][] = expandUniverse(...data);
  printGrid(expandedUniverse);

  console.log('universe as points')
  const universe: Universe = convertUniverseToPointsInSpace([...data.map((line) => line.split(""))]);
  printGrid(universe, 'id', {convert: -1, to: '.'});

  // redo this to update each galaxy with paths to each other galaxy, but return here the list of all unique paths. 
  const galaxyNavigation: Path[] = navigationOfTheUniverse(universe);
  // galaxies.forEach((galaxy) => console.log(galaxy.id, ...galaxy.pathsToRest))

  return galaxyNavigation.reduce((a,b) => 
    a + b.distance,
    0
  );
}