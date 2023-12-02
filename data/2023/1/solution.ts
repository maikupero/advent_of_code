const numericSubstrings = {
  one: '1',
  two: '2',
  three: '3',
  four: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  nine: '9',
};

const reverseNumericSubstrings = {
  eno: '1',
  owt: '2',
  eerht: '3',
  ruof: '4',
  evif: '5',
  xis: '6',
  neves: '7',
  thgie: '8',
  enin: '9',
}

const findDigits = (
  line: string, 
  lineNumber: number, 
  showLogs: boolean
) => {
  const onlyDigits: RegExp = /\d/g;
  const match: RegExpMatchArray | null = line.match(onlyDigits);
  if (match) {
    const firstDigit: string = match[0];
    const lastDigit: string = match[match.length - 1];
    if (showLogs) {
      console.log(`${lineNumber}: ${line} -- ${firstDigit} and ${lastDigit} for ${firstDigit}${lastDigit}`);
    }
    return parseInt(firstDigit + lastDigit);
  } else {
    throw `No digit found in line number ${lineNumber}:\n${line}`
  }
}

const search = (line: string, fromRight = false, showLogs: boolean) => {
  line = fromRight 
    ? line.split('').reverse().join('')
    : line;
  showLogs && console.log(line);

  for (let i = 0; i < line.length; i++) {
    let start: string = line[i];
    if (parseInt(start)) return start;

    // below should really just be a separate function but ¯\_(ツ)_/¯
    if (fromRight) {
      for (let substring of Object.keys(reverseNumericSubstrings)) {
        let check = start;
        let j = i + 1;
        while (substring.startsWith(check)) {
          showLogs && console.log(check);
          // If we find a number just return that
          if (substring === check) return reverseNumericSubstrings[check];
          if (parseInt(line[i])) return line[i];
          check += line[j];
          j++;
        }
      }
    } else {
      for (let substring of Object.keys(numericSubstrings)) {
        let check = start;
        let j = i + 1;
        while (substring.startsWith(check)) {
          showLogs && console.log(check);
          // If we find a number just return that
          if (substring === check) return numericSubstrings[check];
          if (parseInt(line[j])) return line[j];
          check += line[j];
          j++;
        }
      }
    }
  }
}

const findDigitsPartDeux = (
  line: string, 
  lineNumber: number, 
  showLogs: boolean
) => {
  const firstDigit: string = search(line, false, showLogs);
  const lastDigit: string = search(line, true, showLogs);
  if (showLogs) {
    console.log(`${lineNumber}: ${line} -- ${firstDigit} and ${lastDigit} for ${firstDigit}${lastDigit}`);
  }
  return parseInt(firstDigit + lastDigit);
}

export const solve = (
  data: string[], 
  part: number, 
  showLogs: boolean,
) => {
  let calibrationSum: number = 0;
  data.forEach((line: string, lineNumber: number) => {
    calibrationSum += part === 1
      ? findDigits(line, lineNumber, showLogs)
      : findDigitsPartDeux(line, lineNumber, showLogs);
  })
  return calibrationSum
}