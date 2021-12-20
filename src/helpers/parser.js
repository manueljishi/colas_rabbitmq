const csv = require('csv-parser');
const fs = require('fs');
const db = require('../services/mongo.js');
const fileService = require('../services/writeJSON.js');
const { Logger } = require('../helpers/logger.js');
require('dotenv').config();

const storePath = process.env.STORE_PATH;
const winston = new Logger();

function parseFile(path, cols, date, cb){
  let obj;
  fs.createReadStream(path)
  .pipe(csv())
  .on('data',(row) => {
      obj = JSON.parse(row.data);
      //Renombrar el campo id a trafico_id
      obj.forEach(element => {
          element.trafico_id = element.id;
          delete element.id
      });
      
    })
    .on('end', async ()=>{
    let mongoErr = await db.insertData(obj[0], cols);
    let fsError = fileService.addToFile(`${storePath}${date}.json`, obj[0]);
    handleErrors(mongoErr, fsError, cb, path);
  })
  .on('error', (err)=>{
    winston.logger.error(`Error reading file ${path}`)
  })
}


function handleErrors(mongoErr, fsErr, cb, path){
  if(typeof(cb) === 'function'){
    if(mongoErr){
      console.log(mongoErr);
      winston.logger.error(`Error with MongoDB ${error.message}`);
      process.exit(1);
    }
    if(fsErr){
      winston.logger.error(`Problem with file ${path}, errCount: ${fsErr.errCount}` )
      //If we have had more than 3 errors writing to file, better to close the process and perform a sanity check
      if(fsErr.errCount > 3){
        process.exit(1);
      }
    }
    cb();
  }
}


exports.parseFile = parseFile;
