const csv = require('csv-parser');
const fs = require('fs');
const db = require('../services/mongo.js');

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
    await db.insertData(obj, cols ,cb);
    console.log('esto es del parser')
  })
}

exports.parseFile = parseFile;
