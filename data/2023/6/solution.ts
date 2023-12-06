// TYPES 
interface Race {
  timeLimit: number;
  recordDistance: number;
}

// READ THE DATA
const formatData = (data: string[]) => {
  const races: Race[] = [];
  const times: string[] = data[0].split(":")[1].replace(/\s+/g, ' ').trim().split(" ");
  const recordDistances: string[] = data[1].split(":")[1].replace(/\s+/g, ' ').trim().split(" ");
  for (let i = 0; i < times.length; i++) {
    races.push({
      timeLimit: parseInt(times[i]),
      recordDistance: parseInt(recordDistances[i]),
    })
  }
  return races;
}
const formatDataPart2 = (data: string[]) => {
  const times: string[] = data[0].split(":")[1].replace(/\s+/g, ' ').trim().split(" ");
  const recordDistances: string[] = data[1].split(":")[1].replace(/\s+/g, ' ').trim().split(" ");
  return {
    timeLimit: parseInt(times.join("")),
    recordDistance: parseInt(recordDistances.join("")),
  }
}

// USEFUL
const distanceForTimeHeld = (timeHeld: number, timeLimit: number) => {
  if (timeHeld === 0 || timeHeld === timeLimit) {
    return 0;
  }
  let speed: number = timeHeld;
  return speed * (timeLimit - timeHeld)
} 

// PART 1 SOLVER
const countWaysToWin = (race: Race): number => {
  let waysToWin: number = 0;
  for (let timeHeld = 1; timeHeld < race.timeLimit; timeHeld++ ) {
    let distanceTravelled: number = distanceForTimeHeld(timeHeld, race.timeLimit);
    if (distanceTravelled > race.recordDistance) {
      waysToWin++;
    }
  }

  return waysToWin
}

// PART 2 STUFF
const isNewRecord = (timeHeld: number, race: Race): boolean => {
  return distanceForTimeHeld(timeHeld, race.timeLimit) > race.recordDistance;
}

const smallestNewRecordTime = (timeHeld: number, race: Race): boolean => {
  return !isNewRecord(timeHeld - 1, race) && isNewRecord(timeHeld, race)
}

// LESS EFFICIENTLY -___________________________________-
const countWaysToWinMoreEfficiently = (race: Race): number => {
  let mostMarginalNewRecord: number = Math.floor(race.timeLimit / 4);
  let counter = 0;
  while (!smallestNewRecordTime(mostMarginalNewRecord, race)) {
    if (isNewRecord(mostMarginalNewRecord, race)) {
      // Well I wanted to do this like a binary search but I GUESS NOT
      // mostMarginalNewRecord = Math.floor(mostMarginalNewRecord / 2);
      mostMarginalNewRecord--
    } else {
      // mostMarginalNewRecord = Math.ceil((mostMarginalNewRecord + mostMarginalNewRecord * 2) / 2);
      mostMarginalNewRecord++
    }
    counter++;
  }
  
  // Now we have our minimal time held, use that to get our maximal time held, then return difference
  let rightmostMarginalNewRecord = race.timeLimit - mostMarginalNewRecord;
  return isNewRecord(rightmostMarginalNewRecord, race) 
    ? rightmostMarginalNewRecord + 1 - mostMarginalNewRecord
    : rightmostMarginalNewRecord - mostMarginalNewRecord
}

// I read the data into just a simple string[] and send it in here
export const solve = (
  data: string[], 
  part: number, 
  showLogs: boolean,
) => {
  if (part === 1) {
    const races: Race[] = formatData(data);
    const waysToWin: number[] = races.map((race) => countWaysToWin(race));
    return waysToWin.reduce((a,b) => a * b, 1);
  }
  if (part === 2) {
    const theOneRace: any = formatDataPart2(data);
    return countWaysToWinMoreEfficiently(theOneRace);
  }
}