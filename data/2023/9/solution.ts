// Oasis And Sand Instability Sensor!!

// READ THE DATA
const dataIntoArrays = (data: string[]) => {
  return data.map((line: string) => line.split(" ").map(((num) => parseInt(num))));
}

// PART 1 STUFF
const addNextSequence = (parent: number[][], currentSequence: number[]) => {
  const nextSequence: number[] = [];
  for (let i = 0; i < currentSequence.length - 1; i++) {
    nextSequence.push(currentSequence[i + 1] - currentSequence[i]);
  }
  parent.push([...nextSequence]);
}
const stepForward = (history: number[]) => {
  const parent: number[][] = [[...history]];
  while (!!parent[parent.length - 1].some((num: number) => num !== 0)) {
    addNextSequence(parent, parent[parent.length - 1]);
  }
  let nextNum: number = 0;
  for (let i = parent.length - 1; i > 0; i--) {
    let lastIdx = parent[i].length - 1;
    nextNum += parent[i][lastIdx]
  }
  history.push(history[history.length - 1] + nextNum);
  return history
}

// PART 2 STUFF
const regressBackward = (history: number[]) => {
  const parent: number[][] = [[...history]];
  while (!!parent[parent.length - 1].some((num: number) => num !== 0)) {
    addNextSequence(parent, parent[parent.length - 1]);
  }
  let nextNum: number = 0;
  for (let i = parent.length - 1; i > -1; i--) {
    nextNum = parent[i][0] - nextNum;
  }
  history.unshift(nextNum);
  return history
}

// Data is read into a simple string[] and sent in here to format for specific prompts
export const solve = (
  data: string[], 
  part: number, 
  showLogs: boolean,
) => {
  console.log(":)")
  const formattedData: number[][] = dataIntoArrays([...data]);
  const historiesExtended: number[][] = formattedData.map((history: number[]) => {
    return part === 1
      ? stepForward(history)
      : regressBackward(history)
  });
  return historiesExtended.reduce((a,b) => 
    part === 1
      ? a + b[b.length-1]
      : a + b[0]  
    , 0)
}