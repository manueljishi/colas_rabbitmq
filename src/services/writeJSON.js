const fs = require('fs');

function addToFile(filepath, toSave){
    try{
        console.log(filepath);
        console.log('addtofile called')
    fs.readFile(filepath, 'utf8',(err, data) =>{
        if (err){
            console.log('Could not read the specified file');
            return err;
        } else {
        obj = JSON.parse(data);
        obj.push(toSave);
        json = JSON.stringify(obj); //convert it back to json

        try{
        console.log('writeing');
        fs.writeFileSync(filepath, json, 'utf8');
        return undefined;
        }catch(writeException){
            return writeException;
        }
        
    }})

    }catch(exception){
        console.log(exception);
        return exception;
    }
}

exports.addToFile = addToFile;