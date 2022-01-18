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
    .on('data', (fileData) => {
      try{
        obj = fileData;
      //Necesario pasar de string a JSON
      obj.data = JSON.parse(obj.data);
      //Renombrar el campo id a trafico_id
      obj.data.forEach(element =>{
        element.trafico_id = element.id;
        delete element.id;
      })
      }catch(e){
        console.log('there was an error');
        //console.log(e);
      }
    })
    .on('end', async () => {
      let mongoErr = await db.insertData(obj, collection);
      let fsError = await fileService.addToFile(`${storePath}${date}.json`, obj);
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
    }
    if (fsErr) {
      winston.logger.error(`Problem with file ${fileDir}, ${fsErr}`);
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
