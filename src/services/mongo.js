var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var conn;

async function connectToDb() {
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
                conn = db.db("test");
        });
}
async function insertData(data, col, cb) {
    //Data may contain an array of objects 
    return conn.collection(col).insertOne(data, function(err, res) {
        return err;
      });
}


exports.insertData = insertData;
exports.connectToDb = connectToDb;
