var MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
var url = "mongodb://mongodb:27017/";
var conn;

function connectToDb() {
    MongoClient.connect(url,{
        forceServerObjectId: true
        }, function (err, db) {
        if (err) throw err;
        conn = db.db(process.env.MONGODB);
    });
}
async function insertData(data, col) {
    //Data may contain an array of objects 
    return await conn.collection(col).insertMany(data, {ordered:false});
}


exports.insertData = insertData;
exports.connectToDb = connectToDb;
