
interface ColorCounts {
  red: number;
  green: number;
  blue: number;
}

const MAX_COLOR_COUNTS = {
  red: 12,
  green: 13,
  blue: 14,
}

const initialCounts: ColorCounts = {
  red: 0,
  green: 0,
  blue: 0,
}

const checkGameLegality = (line: string) => {
  const sets = line.split(":")[1].split(";");
  let isLegal: boolean = true;
  sets.forEach((set) => {
    const splitSet = set.split(",");
    splitSet.forEach((pair) => {
      const [count, color] = pair.trim().split(" ");
      if (MAX_COLOR_COUNTS[color] < count) {
        isLegal = false;
      }
    })
  })
  return isLegal;
}

const getCubePower = (line: string) => {
  const counts = {...initialCounts}
  const sets = line.split(":")[1].split(";");
  sets.forEach((set) => {
    const splitSet = set.split(",");
    splitSet.forEach((pair) => {
      const [count, color] = pair.trim().split(" ");
      if (counts[color] < parseInt(count)) {
        counts[color] = parseInt(count);
      }
    })
  })
  return counts;
}

// Gamecube Power :)
const getGameCubePower = (counts: ColorCounts) => {
  return counts.red * counts.green * counts.blue
}

export const solve = (
  data: string[], 
  part: number, 
  showLogs: boolean,
) => {
  if (part === 1) {
    let gameNumberSum: number = 0;
    data.forEach((line: string, gameNumber: number) => {
      if (checkGameLegality(line)) {
        gameNumberSum += gameNumber + 1;
      }
    })
    return gameNumberSum;
  } else {
    let cubePowerSum: number = 0;
    data.forEach((line: string, gameNumber: number) => {
      const gameCounts: ColorCounts = getCubePower(line);
      const cubePower: number = getGameCubePower(gameCounts);
      cubePowerSum += cubePower;
    })
    return cubePowerSum;
  }
}