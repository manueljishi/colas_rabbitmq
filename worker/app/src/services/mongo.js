var MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
var url = "mongodb://mongodb:27017/";
var conn;

function connectToDb() {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        conn = db.db(process.env.MONGODB);
    });
}
async function insertData(data, col) {
    //Data may contain an array of objects 
    return conn.collection(col).insertOne(data, function (err, res) {
        return err;
    });
}


exports.insertData = insertData;
exports.connectToDb = connectToDb;
