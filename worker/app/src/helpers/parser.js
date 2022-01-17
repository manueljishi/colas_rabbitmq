const csv = require('csv-parser');
const fs = require('fs');
const mv = require('mv');
const db = require('../services/mongo.js');
const path = require('path');
const fileService = require('../services/writeJSON.js');
const { Logger } = require('./logger.js');
require('dotenv').config();

const storePath = process.env.STORE_PATH;
const winston = new Logger();
let count = 0;

function parseFile(fileDir, collection, date, cb) {
  let obj;
  fs.createReadStream(fileDir)
    .pipe(csv())
    .on('data', (row) => {
      obj = JSON.parse(row.data);
      //Renombrar el campo id a trafico_id
      obj.forEach(element => {
        element.trafico_id = element.id;
        delete element.id
      });

    })
    .on('end', async () => {
      let mongoErr = await db.insertData(obj[0], collection);
      let fsError = fileService.addToFile(`${storePath}${date}.json`, obj[0]);
      handleErrors(mongoErr, fsError, cb, fileDir);
    })
    .on('error', (err) => {
      winston.logger.error(`Error reading file ${fileDir}`)
    })
}


function handleErrors(mongoErr, fsErr, cb, fileDir) {
  if (typeof (cb) === 'function') {
    if (mongoErr) {
      winston.logger.error(`Error with MongoDB ${error.message}`);
      process.exit(1);
    }
    if (fsErr) {
      winston.logger.error(`Problem with file ${fileDir}, errCount: ${fsErr.errCount}`);
      //If we have had more than 3 errors writing to file, better to close the process and perform a sanity check
      if (fsErr.errCount > 3) {
        process.exit(1);
      }
    }
    updateModified(fileDir);
    cb();
  }
}

function updateModified(fileDir) {
  mv(fileDir, path.join('/tmp/usedFiles', `updated${count}.csv`), (err) => { 
    
    fs.unlink(fileDir, ()=>{});
  });
  count++;
}


exports.parseFile = parseFile;
