const coordsAreLegal = (y: number, x: number, maxY: number, maxX: number) => {
  return (
    y > -1 &&
    x > -1 &&
    y < maxY &&
    x < maxX
  )
}

const isDigit = (val: string) => {
  return (
    val === '0' ||
    !!parseInt(val)
  )
}

const getListOfUniqueSymbols = (data: string[]) => {
  const res: string[] = [];
  for (let line of data) { 
    for (let c of line) {
      if (
        !isDigit(c) && 
        c !== "." && 
        !res.includes(c)
      ) {
        res.push(c);
      }
    }
  }
  return res;
}

const formatDataToGrid = (data: string[]): string[][] => {
  const res: string[][] = [];
  for (let line of data) {
    res.push(line.split(""));
  }
  return res;
}

const parseSchematicForParts = (schematic: string[][], symbols: string[]) => {
  let partsSum: number = 0;
  for (let y = 0; y < schematic.length; y++) {
    for (let x = 0; x < schematic[0].length; x++) {
      if (symbols.includes(schematic[y][x])) {
        partsSum += findParts(schematic, y, x);
      }
    }
  }
  return partsSum;
}

const findParts = (schematic: string[][], startY: number, startX: number) => {
  let partsSum: number = 0;
  for (let y = startY - 1; y < startY + 2; y++) {
    for (let x = startX - 1; x < startX + 2; x++) {
      if (coordsAreLegal(y, x, schematic.length, schematic[0].length)) {
        if (isDigit(schematic[y][x])) {
          partsSum += recordNumber(schematic, y, x);
        }
      }
    }
  }
  return partsSum
}

const recordNumber = (schematic: string[][], y: number, x: number) => {
  let numString = '';
  let startX = x;
  let endX = x;
  while (
    startX > 0 && 
    isDigit(schematic[y][startX - 1])
  ) {
    startX--;
  }
  while (
    endX < schematic[0].length - 1 &&
    isDigit(schematic[y][endX + 1]) 
  ) {
    endX++;
  }
  while (startX < endX + 1) {
    numString += schematic[y][startX];
    schematic[y][startX] = ".";
    startX++;
  }
  return parseInt(numString);
}


const parseSchematicForGears = (schematic: string[][]) => {
  let gearsSum: number = 0;
  for (let y = 0; y < schematic.length; y++) {
    for (let x = 0; x < schematic[0].length; x++) {
      if (schematic[y][x] === "*") {
        gearsSum += findGears(schematic, y, x);
      }
    }
  }
  return gearsSum;
}

const findGears = (schematic: string[][], startY: number, startX: number) => {
  const numberOfAdjacentParts: number = countAdjacentParts(schematic, startY, startX);
  if (numberOfAdjacentParts === 2) {
    let partsProduct: number = 1;
    for (let y = startY - 1; y < startY + 2; y++) {
      for (let x = startX - 1; x < startX + 2; x++) {
        if (coordsAreLegal(y, x, schematic.length, schematic[0].length)) {
          if (isDigit(schematic[y][x])) {
            partsProduct *= recordNumber(schematic, y, x);
          }
        }
      }
    }
    return partsProduct;
  }
  return 0;
}

const countAdjacentParts = (schematic: string[][], startY: number, startX: number) => {
  let numberOfAdjacentParts: number = 0;
  for (let y = startY - 1; y < startY + 2; y++) {
    let foundNumber: boolean = false;
    for (let x = startX - 1; x < startX + 2; x++) {
      if (coordsAreLegal(y, x, schematic.length, schematic[0].length)) {
        if (isDigit(schematic[y][x])) {
          if (!foundNumber) {
            numberOfAdjacentParts++;
          }
          foundNumber = true;
        } else {
          foundNumber = false;
        }
      }
    }
  }
  return numberOfAdjacentParts;
}

export const solve = (
  data: string[], 
  part: number, 
  showLogs: boolean,
) => {
  const formattedData: string[][] = formatDataToGrid([...data]);
  if (part === 1) {
    const symbolList: string[] = getListOfUniqueSymbols(data);
    return parseSchematicForParts(formattedData, symbolList);
  } else {
    return parseSchematicForGears(formattedData);
  }
}