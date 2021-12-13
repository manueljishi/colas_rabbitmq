const csv = require('csv-parser');
const fs = require('fs');
const db = require('../services/mongo.js');

function parseFile(path){
  var obj;
  return new Promise((resolve, reject)=>{
    fs.createReadStream(path)
  .pipe(csv())
  .on('data', (row) => {
      obj = JSON.parse(row.data);
      //Renombrar el campo id a trafico_id
      obj.forEach(element => {
          element.trafico_id = element.id;
          delete element.id
      });
      db.insertData(obj, 'estadotrafico');
      resolve(path);
      return;
  })
  })
}

exports.parseFile = parseFile;
