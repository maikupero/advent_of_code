// TYPES 
type NodeMap = Map<string, Node>;
interface Node {
  R: string,
  L: string,
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
  let steps: number= 0;

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

// Data is read into a simple string[] and sent in here to format for specific prompts
export const solve = (
  data: string[], 
  part: number, 
  showLogs: boolean,
) => {
  console.log(":)")
  const instructions: string = data[0].trim();
  console.log('instructions', instructions);
  const maps: NodeMap = createNodeMapping(data.slice(2));
  return pathToZZZ(instructions, maps);
}