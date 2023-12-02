import nReadlines from 'n-readlines';

// readDataIntoArrays
export const reader = (AOCData, verbose) => {
  if (!verbose) {
    console.log("--- Skipping the log for the *big* data...");
  }
  
  const dataLines = new nReadlines(AOCData);

  let line;
  let lineNumber = 1;

  const res = [];
  let dataGroup = [];

  while (line = dataLines.next()) {
    if (line.toString() === '') {
      console.log("Chunk: ", dataGroup);
      res.push(dataGroup);
      dataGroup = [];
    } else {
      dataGroup.push(line.toString())
    }
    lineNumber++;
  }

  const used = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(`Took approximately ${Math.round(used * 100) / 100} MB of memory to read the data from ${AOCData}.`);

  return res;
}

// https://nodejs.org/api/readline.html#readline_example_read_file_stream_line_by_line
// https://geshan.com.np/blog/2021/10/nodejs-read-file-line-by-line/