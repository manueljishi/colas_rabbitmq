const csv = require('csv-parser');
const fs = require('fs');
const db = require('../services/mongo.js');
const fileService = require('../services/writeJSON.js');
//const { Logger } = require('./logger.js');
const { checkDate } = require('./dateFormatter.js');
require('dotenv').config();

//const winston = new Logger();
let readData = [];

function parseFile(fileDir, collection, cb) {
  let obj;
  fs.createReadStream(fileDir)
    .pipe(csv())
    .on('data', (fileData) => {
      try {
        obj = fileData;
        //Necesario pasar de string a JSON
        obj.data = JSON.parse(obj.data);

        //Renombrar el campo id a trafico_id
        obj.data[0].trafico_id = obj.data[0].id;
        delete obj.data[0].id;
        
      } catch (e) {
        console.log('there was an error');
      }
    })
    .on('end', async () => {

      const { update, date } = checkDate(new Date(obj.data[0].fechaHora.value));
      if (update && readData.length > 0) {
        await db.insertData(readData, collection);
        await fileService.addToFile(readData, date);
        readData.length = 0;
        readData.push(obj);
        cb()
      }
      else{
        readData.push(obj);
        cb();
      }
    })
    .on('error', (err) => {
      //winston.logger.error(`Error reading file ${fileDir}`)
      console.log(err);
    })
}

exports.parseFile = parseFile;
