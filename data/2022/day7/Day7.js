class Directory {
  constructor(name, contents, children, size) { 
    this.name = name;
    this.children = children;
    this.contents = contents;
    this.size = size;
  }
}

const updateDirectorySizes = (directory, size) => {
  for (let child of directory.children) {
    size += updateDirectorySizes(child, 0);
  }
  for (let content of directory.contents) {
    size += content.fileSize;
  }
  directory.size = size;
  return size;
}

const changeDirectory = (root, destination) => {
  for (let child of root.children) {
    if (child.name === destination) {
      return child
    }
  }
}

const createFileSystem = (data, logs) => {
  const root = new Directory("/", [], [], 0);
  let currentDirectory = root;
  let path = [root];
  
  for (let line of data.slice(1)) {
    if (line[0] !== '$') {
      line[0] === 'dir'
        ? currentDirectory.children.push(new Directory(line[1], [], [], 0))
        : currentDirectory.contents.push({fileName: line[1], fileSize: parseInt(line[0])});
    }
    if (line[1] === 'cd') {
      line[2] === '..'
        ? path.pop()
        : path.push(changeDirectory(currentDirectory, line[2]));
      currentDirectory = path[path.length-1];
    }
  }

  return root;
}

const sumOfDeletables = (directory, DELETE_MAX_SIZE, sum) => {
  for (let child of directory.children) {
    sum += sumOfDeletables(child, DELETE_MAX_SIZE, 0);
  }
  if (0 < directory.size && directory.size <= DELETE_MAX_SIZE) {
    sum += directory.size;
  }

  return sum;
}

const findBigBoyCandidates = (directory, candidates, MIN_SIZE_TO_DELETE) => {
  if (directory.size >= MIN_SIZE_TO_DELETE) {
    candidates.push(directory.size);
  }
  for (let child of directory.children) {
    findBigBoyCandidates(child, candidates, MIN_SIZE_TO_DELETE)
  }
}

const freeUpEnoughSpace = (fileSystem) => {
  const MIN_SIZE_TO_DELETE = 30000000 - (70000000 - fileSystem.size);
  const candidates = [];
  findBigBoyCandidates(fileSystem, candidates, MIN_SIZE_TO_DELETE);
  
  return candidates.sort((a, b) => a - b)[0];
}

const findDeleteCandidates = (data, part) => {
  const DELETE_MAX_SIZE = 100000;
  const fileSystem = createFileSystem(data, false);
  updateDirectorySizes(fileSystem, 0);
  
  return part === 1 
    ? sumOfDeletables(fileSystem, DELETE_MAX_SIZE, 0)
    : freeUpEnoughSpace(fileSystem);
}



////////////  Base Functions for Solver.js                     
export const solveExample = (exampleData, part) => {
  return findDeleteCandidates(exampleData, part);
}

export const solve = (currentDayData, part) => {
  return findDeleteCandidates(currentDayData, part);
}