const checkSlice = (arr, incrVal) => {
  let l = [arr[0]];
  for (let r = 1; r < incrVal + 1; r++) {
    if (r === incrVal) {
      return r
    } else if (l.indexOf(arr[r]) === -1) {
      l.push(arr[r]);
    } else {
      return l.indexOf(arr[r]) + 1
    }
  }
}

const findMarker = (datastream, part) => {
  let marker = 0;
  let incrVal = part === 1 ? 4 : 14;
  let curr = incrVal;
  
  while (true) {
    marker += checkSlice(datastream.slice(marker, curr), incrVal);
    if (marker === curr) return marker;
    curr = marker + incrVal;
  }
}

////////////  Base Functions for Solver.js                     
export const solveExample = (exampleData, part) => {
  return findMarker(exampleData, part)
}

export const solve = (currentDayData, part) => {
  return findMarker(currentDayData, part)
}