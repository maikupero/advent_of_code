import { getLeastCommonMultiple } from "../../../util.js";

// TYPES 
type NodeMap = Map<string, Node>;
interface Node {
  R: string,
  L: string,
}
type NodeMapWithPathsToTrack = {
  nodeMap: NodeMap,
  paths: PathInfo[],
}
interface PathInfo {
  startingNode: string;
  currentNode: string;
  stepsToZ: number;
}

const START_NODE = 'AAA';
const END_NODE = 'ZZZ';

// READ THE DATA
const createNodeMapping = (data: string[]) => {
  const nodeMap = new Map();
  data.forEach((line: string) => {
    const [nodeKey, nodeDirections] = line.split(" = ");
    const [left, right] = nodeDirections.slice(1, nodeDirections.length - 1).split(", ");
    nodeMap.set(nodeKey, {L: left, R: right});
  })
  return nodeMap;
}
// USEFUL

// PART 1 STUFF
const pathToZZZ = (instructions, map: NodeMap) => {
  let steps: number = 0;

  let current_node: string = START_NODE;
  let current_instruction: number = 0;
  while(current_node !== END_NODE) {
    let direction: 'L' | 'R' = instructions[current_instruction];
    const paths: Node = map.get(current_node)!;
    current_node = paths[direction];
    steps++;
    current_instruction = current_instruction === instructions.length - 1
      ? 0
      : current_instruction + 1;
  }
  return steps
}

// PART 2 STUFF
const createNodeMapping2 = (data: string[]) => {
  const nodeMap = new Map();
  const paths: PathInfo[] = [];
  data.forEach((line: string) => {
    const [nodeKey, nodeDirections] = line.split(" = ");
    const [left, right] = nodeDirections.slice(1, nodeDirections.length - 1).split(", ");
    nodeMap.set(nodeKey, {L: left, R: right});
    if (nodeKey[2] === 'A') {
      paths.push({
        startingNode: nodeKey,
        currentNode: nodeKey,
        stepsToZ: 0,
      });
    }
  })
  return {
    nodeMap,
    paths,
  };
}

const getPathToZs = (instructions, map: NodeMapWithPathsToTrack) => {
  let steps: number = 0;
  let current_instruction: number = 0;
  while(!allFoundZ(map.paths)) {
    let direction: 'L' | 'R' = instructions[current_instruction];
    map.paths.forEach((path: PathInfo) => {
      if (path.stepsToZ === 0) { // only check a path till it finds steps to Z
        path.currentNode = map.nodeMap.get(path.currentNode)![direction];
        if (path.currentNode[2] === 'Z') {
          if (path.stepsToZ === 0) {
            path.stepsToZ = steps + 1;
          }
        }
      }
    })
    steps++;
    current_instruction = current_instruction === instructions.length - 1
      ? 0
      : current_instruction + 1;
  }
}
const allFoundZ = (paths: PathInfo[]) => {
  return paths.every((path: PathInfo) => path.stepsToZ !== 0)
}


// Data is read into a simple string[] and sent in here to format for specific prompts
export const solve = (
  data: string[], 
  part: number, 
  showLogs: boolean,
) => {
  console.log(":)")
  const instructions: string = data[0].trim();
  if (part === 1) {
    const maps: NodeMap = createNodeMapping(data.slice(2));
    return pathToZZZ(instructions, maps);
  }
  const mapsWithPaths: NodeMapWithPathsToTrack = createNodeMapping2(data.slice(2));
  getPathToZs(instructions, mapsWithPaths);
  return getLeastCommonMultiple(...mapsWithPaths.paths.map((path) => path.stepsToZ));
}
//Added these to util.ts
// export function greatestCommonDenominator(x: number, y: number): number {
//   return (!y ? x : greatestCommonDenominator(y, x % y));
// }
// export function leastCommonDenominator(x: number, y: number): number {
//   return (x * y) / greatestCommonDenominator(x, y);
// }
// export function getLeastCommonMultiple(...nums: number[]): number {
//   return [...nums].reduce((a, b) => leastCommonDenominator(a, b));
// }