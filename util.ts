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

export function isDigit(char: string) {
  return (
    char === '0' ||
    !!parseInt(char)
  )
}

export function isPrime(num: number) {
  //todo
}

export function greatestCommonDenominator(x: number, y: number): number {
  return (!y ? x : greatestCommonDenominator(y, x % y));
}
export function leastCommonDenominator(x: number, y: number): number {
  return (x * y) / greatestCommonDenominator(x, y);
}
export function getLeastCommonMultiple(...nums: number[]): number {
  return [...nums].reduce((a, b) => leastCommonDenominator(a, b));
}

export const timeDiff = (startTime) => {
  const endTime = Date.now();
  return endTime - startTime;
}

export const coordsAreLegal = (y: number, x: number, grid: any[][]) => {
  return (
    y > -1 &&
    x > -1 &&
    y < grid.length &&
    x < grid[0].length
  )
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