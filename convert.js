'use strict';

// use FileSystem API
var fs = require('fs');

// read file into array and return
function readFile(filename) {
  const contents = fs.readFileSync(filename, 'utf-8');
  const arr = contents.split(/\n/);

  if (arr.length <= 1) {
    console.log("Invalid CSV provided");
    process.exit();
  }

  return arr;
}

// check if string is number for JSON
function formatType(text) {
  return text.trim();
}

// create new Object with keys and values
function createObject(id, headers, data) {
  const obj = {};
  obj["id"] = id;
  headers.forEach((element, index) => {
    obj[element] = formatType(data[index]);
  });
  return obj;
}

// create table of objects from file
function generateTable(fileArr) {
  var table = [];
  const headers = fileArr[0].split(',');
  // loop over file array
  for (let i = 1; i < fileArr.length - 1; i++) {
    if (fileArr[i]) {
      const data = fileArr[i].split(',');
      if (data.length != headers.length) {
        console.log("Invalid data elements found at line " + (i+1));
        process.exit();
      }
      const obj = createObject(i, headers, data);
      table.push(obj);
    }
  }
  return table;
}

// get path from argument passed on CLI
function getPathArg() {
  const args = process.argv.slice(2);
  // check proper args
  if (args.length != 1) {
    console.log("Usage: node convert.js [path to file]");
    process.exit();
  }
  let path = args[0];
  try {
    // check if passed file really exists
    if (fs.existsSync(path)) {
      return path;
    } else {
      console.log("File could not be found");
      process.exit();
    }
  } catch (err) {
    console.log(err);
  }
}

// return just the file name of passed path
function getFileName(path) {
  var replaced = path.replace(/^.*[\\\/]/, '');
  replaced = replaced.substring(0, replaced.lastIndexOf('.')) || replaced;
  return replaced;
}

// stringify table and write to file
function writeToFile(filename, table) {
  // at some point table too large to be string-ified
  // TODO: loop over and write to file sequentially
  const jsonText = JSON.stringify(table, null, 2);
  const filePath = './data/' + filename + '.json';
  fs.writeFileSync(filePath, jsonText, { encoding: 'utf8' });
  console.log('Successfully wrote to file: ' + filePath);
}

// hard code path
// const path = './data/TheBeatlesCleaned.csv';

const path = getPathArg();

const arr = readFile(path);
const table = generateTable(arr);
writeToFile(getFileName(path), table);
