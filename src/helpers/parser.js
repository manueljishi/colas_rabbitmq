const csv = require('csv-parser');
const fs = require('fs');
const db = require('../services/mongo.js');

function parseFile(path, cols, cb){
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
    .on('end', ()=>{
    db.insertData(obj, cols ,cb);
  })
}

exports.parseFile = parseFile;
