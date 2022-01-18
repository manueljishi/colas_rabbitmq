const fs = require('fs');
function addToFile(filepath, toSave) {
    let obj;
    try {
        if (!fs.existsSync(filepath)) {
            fs.writeFileSync(filepath, '[ ]');
        }
        try {
            let data = fs.readFileSync(filepath, 'utf8');
            obj = JSON.parse(data);
            obj.push(toSave);
            obj = JSON.stringify(obj); //convert it back to json

        } catch (readException) { }
        try {
            fs.writeFileSync(filepath, obj, 'utf8');
            return undefined;
        } catch (writeException) {
            return writeException
        }

    } catch (exception) {
        return exception
    }
}

exports.addToFile = addToFile;