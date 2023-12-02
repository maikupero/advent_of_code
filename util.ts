import { getDayInput } from "./constants/values.js";
import readline from "readline";
import nReadlines from 'n-readlines';

export const parseData = (AOCData: string, verbose = false) => {  
  const dataLines = new nReadlines(AOCData);
  let line;
  let lineNumber = 1;
  const res: string[] = [];

  while (line = dataLines.next()) {
    res.push(line.toString());
    lineNumber++;
  }

  return res;
}

export const timeDiff = (startTime) => {
  const endTime = Date.now();
  return endTime - startTime;
}

const getUserInput = (query) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise(resolve => rl.question(query, ans => {
    rl.close();
    resolve(ans);
  }))
}

export const retrieveCurrentDayFromUser = async () => {
  let dayInput: number = 0;
  while (dayInput < 1 || dayInput > 25) {
    const userInput = await getUserInput(getDayInput) as string;
    dayInput = parseInt(userInput);
  }
  return dayInput;
}

// https://stackoverflow.com/questions/18193953/waiting-for-user-to-enter-input-in-node-js
// https://www.npmjs.com/package/cli-interact