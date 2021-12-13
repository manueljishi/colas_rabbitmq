const mongoose = require('mongoose');
var conn;

async function connectToDb() {
    try {
        await mongoose.connect('mongodb://localhost:27017/test');
        conn = mongoose.connection;
    } catch (error) {
        console.log(error);
    }
}
function insertData(data, col) {
    //Data may contain an array of objects 
    data.forEach(element => {
        conn.collection(col).insertOne(element);
    });
    return true;
}
function closeConnection(){
    conn.close();
}


exports.insertData = insertData;
exports.connectToDb = connectToDb;
exports.closeConnection = closeConnection;
