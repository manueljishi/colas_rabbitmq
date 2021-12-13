const mongoose = require('mongoose');
var  connection;

async function connectToDb(){
    try {
        await mongoose.connect('mongodb://localhost:27017/test');
        connection = mongoose.connection;
        console.log(connection)
        connection.on('open', ()=>{
            console.log('Connection successful');
        })

      } catch (error) {
        console.log(error);
      }
}
function insertData(data, col){
    //Data may contain an array of objects 
    data.forEach(element => {
        connection.collection(col).insert(element);
    });
    return;
}


exports.insertData = insertData;
exports.connectToDb = connectToDb;
