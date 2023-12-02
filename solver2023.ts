import { bigAsteriskDivider, reverseAsteriskDivider } from './constants/formatting.js';
import { parseData, retrieveCurrentDayFromUser } from './util.js';
import { LASTCOMPLETEDAY } from './constants/values.js';


const args = process.argv;

const currentDay = args.length < 3 
  ? await retrieveCurrentDayFromUser()
  : parseInt(args[2]); 

// TODO
// const whatToRun = await askUserWhatToRun();

const answerFormatter = (currentDay) => {
  if (1 > currentDay || currentDay > LASTCOMPLETEDAY) {
    console.error("Invalid day! Or incomplete, sorry.");
    return;
  }

  const example1Path = `./data/2023/${currentDay}/example1.txt`;
  const example2Path = `./data/2023/${currentDay}/example2.txt`;
  const inputPath = `./data/2023/${currentDay}/input.txt`;
  const solutionPath = `./data/2023/${currentDay}/solution.ts`;

  import(solutionPath)
  .then((solution) => {
    console.log(bigAsteriskDivider);
    const example1Data: string[] = parseData(example1Path);
    const example2Data: string[] = parseData(example2Path);
    const inputData: string[] = parseData(inputPath);

    console.log(example1Data);
    console.log(example2Data);
    console.log("Example 1:", solution.solve(example1Data, 1, true));
    console.log("   Part 1:", solution.solve(inputData, 1, false));
    if (example2Data.length) {
      console.log("------------------")
      console.log("Example 2:", solution.solve(example2Data, 2, true));
      console.log("   Part 2:", solution.solve(inputData, 2, false));
    }

    console.log(reverseAsteriskDivider);
  })
}

answerFormatter(currentDay);