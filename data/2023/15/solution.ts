// TYPES 
interface Step {
  hash: number;
  lens: Lens;
  operation: '=' | '-';
}
interface Lens {
  label: string;
  focalLength: number;
}

// USEFUL INFO PART 1
// The HASH algorithm is a way to turn any string of characters into a single number in the range 0 to 255. To run the HASH algorithm on a string, start with a current value of 0. Then, for each character in the string starting from the beginning:

// Determine the ASCII code for the current character of the string.
// Increase the current value by the ASCII code you just determined.
// Set the current value to itself multiplied by 17.
// Set the current value to the remainder of dividing itself by 256. That's the output.

// USEFUL INFO PART 2

// Each step begins with a sequence of letters that indicate the label of the lens on which the step operates. 
// The result of running the HASH algorithm on the label indicates the correct box for that step.
// The label will be immediately followed by a character that indicates the operation to perform: either an equals sign (=) or a dash (-).
  // If the operation character is a dash (-), go to the relevant box and remove the lens with the given label if it is present in the box. 
    // Then, move any remaining lenses as far forward in the box as they can go without changing their order, 
    // filling any space made by removing the indicated lens. (If no lens in that box has the given label, nothing happens.)
  // If the operation character is an equals sign (=), it will be followed by a number indicating the focal length of the lens that needs to go into the relevant box; 
  // be sure to use the label maker to mark the lens with the label given in the beginning of the step so you can find it later. There are two possible situations:
      // If there is already a lens in the box with the same label, replace the old lens with the new lens: 
        // remove the old lens and put the new lens in its place, not moving any other lenses in the box.
      // If there is not already a lens in the box with the same label, add the lens to the box immediately behind any lenses already in the box. 
      // Don't move any of the other lenses when you do this. If there aren't any lenses in the box, the new lens goes all the way to the front of the box.

// PART 1 STUFF
function runHash(step: string): number  {
  let hashValue: number = 0;
  for (let i = 0; i < step.length; i++) {
    const asciiCode: number = step.charCodeAt(i)
    hashValue += asciiCode;
    hashValue *= 17;
    hashValue = hashValue % 256;
  }
  return hashValue;
}

// PART 2 STUFF
let boxMap: Map<number, Lens[]> = new Map();

function breakdownStep(step: string): Step {
  const stepDivided: string[] = step.split(/([-=])/);
  const [label, operation, focalLength] = stepDivided;
  const hash: number = runHash(label);
  if (!boxMap.has(hash)) {
    boxMap.set(hash, []);
  }
  return {
    hash,
    lens: {
      label,
      focalLength: !!parseInt(focalLength) ? parseInt(focalLength) : 0,
    },
    operation: operation as '=' | '-',
  }
}

// Data is read into a simple string[] and sent in here to format for specific prompts
export const solve = (
  data: string[], 
  part: number, 
  showLogs: boolean,
) => {
  console.log(":)")
  boxMap = new Map();
  const steps: string[] = data[0].split(",")
  
  if (part === 1) {
    let sum = 0;
    steps.forEach((step) => sum += runHash(step));
    return sum;
  }
  if (part === 2) {
    steps.forEach((step: string) => {
      const {hash, lens, operation} = breakdownStep(step);
      const currentBox: Lens[] = boxMap.get(hash)!; // go to the relevant box
      const foundLensIdx: number = currentBox.findIndex((box) => box.label === lens.label)
      if (operation === '-' && foundLensIdx > -1) { //If the operation character is a dash (-), and it is present in the box
        currentBox.splice(foundLensIdx, 1); // remove the lens with the given label 
        // because splice is great and removes in place we dont need to worry about adjusting anything.
      } // (If no lens in that box has the given label, nothing happens.)
      else if (operation === '=') {
        if (foundLensIdx > -1) {  // replace the lens with the new one
          currentBox[foundLensIdx] = {...lens};
        } else {
          currentBox.push(lens); // add the lens to the back
        }
      }
    })
    let sum = 0;
    boxMap.forEach((box, boxNumber) => {
      box.forEach((lens, i) => {
        sum += (boxNumber + 1) * (i + 1) * (lens.focalLength)
      })
    })
    return sum;
  }
}