const getSharedItem = (compartmentA, compartmentB) => {
  for (let item of compartmentA) {
    if (compartmentB.match(item)) {
      return item
    }
  }
}

const getSharedItems = (rucksack1, rucksack2) => {
  let matches = [];
  for (let item of rucksack2) {
    if (rucksack1.match(item)) {
      matches.push(item);
    }
  }
  return matches;
}

const getBadge = (threeElves) => {
  threeElves.sort((a, b) => a.length - b.length); // Find matches between the two shortest first.
  let possibleMatches = getSharedItems(threeElves[0], threeElves[1]);
  return getSharedItem(possibleMatches, threeElves[2]);
}

//////////// Day 3 Common Functions
const getPriority = (item) => {
  const isUpper = item.toUpperCase() === item;
  return isUpper ? item.charCodeAt(0) - 38 : item.charCodeAt(0) - 96
}

const rummageThroughRucksack = (rucksacks, part) => {
  let prioritySum = 0;  
  let sharedItem = "";

  if (part === 1) {
    let compartmentA, compartmentB = "";
    for (let rucksack of rucksacks) {
      compartmentA = rucksack.slice(0, rucksack.length/2);
      compartmentB = rucksack.slice(rucksack.length/2);
      sharedItem = getSharedItem(compartmentA, compartmentB);
      prioritySum += getPriority(sharedItem);
    }
  }

  if (part === 2) {
    for (let i = 0; i < rucksacks.length; i += 3) {
      sharedItem = getBadge([rucksacks[i], rucksacks[i+1], rucksacks[i+2]]);
      prioritySum += getPriority(sharedItem);
    }
  }

  return prioritySum
}


////////////  Base Functions for Solver.js                     
export const solveExample = (exampleData, part) => {
  return rummageThroughRucksack(exampleData, part);
}

export const solve = (currentDayData, part) => {
  return rummageThroughRucksack(currentDayData, part);
}