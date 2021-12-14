var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var conn;

async function connectToDb() {
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
                conn = db.db("test");
        });
}
function insertData(data, col, cb) {
    //Data may contain an array of objects 
    return conn.collection(col).insertMany(data, function(err, res) {
        if (err) throw err;
        console.log('inserted');
        if(typeof(cb)== 'function'){
            cb();
        }
      });
}


exports.insertData = insertData;
exports.connectToDb = connectToDb;
