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
    console.log(data);
    let dat = conn.collection(col).insertMany(data);
    console.log(dat)
    return dat;
}


exports.insertData = insertData;
exports.connectToDb = connectToDb;
