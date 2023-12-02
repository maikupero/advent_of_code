const choicePoints = {
  'X': 1,
  'Y': 2,
  'Z': 3
}

const comparePoints = {
  "A Y": 6,
  "B Z": 6,
  "C X": 6,
  "A X": 3,
  "B Y": 3,
  "C Z": 3,
  "A Z": 0,
  "B X": 0,
  "C Y": 0
}

const rulesPart2 = {
  "X": "lose",
  "Y": "draw",
  "Z": "win"
}
const winningPointsPart2 = {
  "A": 6 + choicePoints["Y"],
  "B": 6 + choicePoints["Z"],
  "C": 6 + choicePoints["X"]
}
const drawPointsPart2 = {
  "A": 3 + choicePoints["X"],
  "B": 3 + choicePoints["Y"],
  "C": 3 + choicePoints["Z"]
}
const losePointsPart2 ={
  "A": choicePoints["Z"],
  "B": choicePoints["X"],
  "C": choicePoints["Y"]
}
const comparePointsPart2 = {
  "win": winningPointsPart2,
  "draw": drawPointsPart2,
  "lose": losePointsPart2
}

const getRoundPoints = (data, part) => {
  let points = 0;

  if (part === 1) {
    for (let round of data) {
      points += choicePoints[round[2]];
      points += comparePoints[round];
    }
  }

  if (part === 2) {
    for (let round of data) {
      let outcome = rulesPart2[round[2]];
      points += comparePointsPart2[outcome][round[0]];
    }
  }
  return points;
}

//////////////  Base Functions for Solver.js  
export const solveExample = (exampleData, part) => {
  return getRoundPoints(exampleData, part);
}

export const solve = (currentDayData, part) => {
  return getRoundPoints(currentDayData, part);
}