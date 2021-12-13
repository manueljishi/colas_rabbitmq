const mongoose = require('mongoose');
var connection;

async function connectToDb() {
    try {
        await mongoose.connect('mongodb://localhost:27017/test');
        connection = mongoose.connection;
        connection.once('open', function () {
            console.log("Connection Successful!");
        })
    } catch (error) {
        console.log(error);
    }
}
function insertData(data, col) {
    //Data may contain an array of objects 
    data.forEach(element => {
        connection.collection(col).insertOne(element);
    });
    return true;
}


exports.insertData = insertData;
exports.connectToDb = connectToDb;
