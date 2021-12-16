const csv = require('csv-parser');
const fs = require('fs');
const db = require('../services/mongo.js');
const fileService = require('../services/writeJSON.js');

const storePath = '/home/respaldo/Escritorio/';

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
    let mongoErr = await db.insertData(obj, cols);
    let fsError = fileService.addToFile(`${storePath}${date}.json`, obj[0]);
    if(typeof(cb) === 'function' && !mongoErr && !fsError){
      cb()
    }
  })
}

exports.parseFile = parseFile;
