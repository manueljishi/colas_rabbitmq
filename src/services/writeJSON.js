const fs = require('fs');

function addToFile(filepath, toSave){
    let didWrite;
    console.log(filepath)
    fs.readFile(filepath, 'utf8',(err, data) =>{
        console.log('addtofile called')
        if (err){
            console.log(err);
        } else {
        obj = JSON.parse(data);
        obj.push(toSave);
        json = JSON.stringify(obj); //convert it back to json
        didWrite = fs.writeFileSync(filepath, json, 'utf8'); // write it back
        fs.close();
    }});
    return didWrite;
}

exports.addToFile = addToFile;