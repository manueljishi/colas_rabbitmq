const csv = require('csv-parser');
const fs = require('fs');
const db = require('../services/mongo.js');

async function parseFile(path){
  var obj;
  fs.createReadStream(path)
  .pipe(csv())
  .on('data', (row) => {
      obj = JSON.parse(row.data);
      //Renombrar el campo id a trafico_id
      obj.forEach(element => {
          element.trafico_id = element.id;
          delete element.id
      });
      var response = db.insertData(obj, 'estadotrafico');
      console.log(response);
  })
  .on('finish', () => {
    return false;
  });
}

exports.parseFile = parseFile;
