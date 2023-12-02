import { bigAsteriskDivider, reverseAsteriskDivider } from './constants/formatting.js';
import { timeDiff, retrieveCurrentDayFromUser } from './util.ts';
import { LASTCOMPLETEDAY } from './constants/values.js';


const args = process.argv;
const currentDay = args.length < 3 
  ? await retrieveCurrentDayFromUser()
  : parseInt(args[2]); 

const answerFormatter = (currentDay) => {
  if (1 > currentDay || currentDay > LASTCOMPLETEDAY) {
    console.error("Invalid day! Or incomplete, sorry.");
    return;
  }

  const exampleFileLocation = `./data/2022/day${currentDay}/day${currentDay}ex.txt`;
  const currentDayFileLocation = `./data/2022/day${currentDay}/day${currentDay}.txt`;

  import(`./data/2022/day${currentDay}/day${currentDay}reader.js`)
  .then((reader) => {
    const exampleData = reader.reader(exampleFileLocation, 'v');
    const currentDayData = reader.reader(currentDayFileLocation);
    
    import(`./data/2022/day${currentDay}/Day${currentDay}.js`)
    .then((solvers) => {
      console.log(bigAsteriskDivider);
      console.log("Solving Example One...");
      const startExample1Time = Date.now();
      const solutionExample1 = solvers.solveExample(exampleData, 1);
      console.log(`Ex: ${solutionExample1}   (${timeDiff(startExample1Time)}ms)\n-----`);
      console.log("Solving Part One...");
      const start1Time = Date.now();
      const solution1 = solvers.solve(currentDayData, 1);
      console.log(`1: ${solution1}   (${timeDiff(start1Time)}ms)\n-----`);
      console.log("Solving Example Two...");
      const startExample2Time = Date.now();
      const solutionExample2 = solvers.solveExample(exampleData, 2);
      console.log(`Ex: ${solutionExample2}   (${timeDiff(startExample2Time)}ms)\n-----`);
      console.log("Solving Part Two...");
      const start2Time = Date.now();
      const solution2 = solvers.solve(currentDayData, 2);
      const end2Time = Date.now();
      console.log(`2: ${solution2}   (${timeDiff(start2Time, end2Time)}ms)`);
      console.log(reverseAsteriskDivider);
    })
  })
}

answerFormatter(currentDay);