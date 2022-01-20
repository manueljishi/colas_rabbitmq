const fs = require('fs');
let counter = 0;
let disp = 0;
function addToFile(filepath, toSave, dateTime) {
    let obj;
    let formatedDate = formatNewDate(dateTime);
    filepath = `${filepath}${formatedDate}.json`;
    try {
        if (!fs.existsSync(filepath)) {
            fs.writeFileSync(filepath, '[ ]');
            counter = 0;
            disp = 0;
        }
        try {
            let data = fs.readFileSync(filepath, 'utf8');
            obj = JSON.parse(data);
            obj.push(toSave);
            obj = JSON.stringify(obj); //convert it back to json

        } catch (readException) { }
        try {
            fs.writeFileSync(filepath, obj, 'utf8');
            counter++;
            return undefined;
        } catch (writeException) {
            return writeException
        }

    } catch (exception) {
        return exception
    }
}

function formatNewDate(date){
    //Get date into a string with DDMMYYY format
    if(counter % 7500 == 0){
        disp++;
    }
    let hour = date.getHours();
    if(hour < 10){
        hour = "0"+hour;
    }
    let month = date.getMonth() + 1;
    if(month < 10){
        month = "0"+month;
    }
    return `${date.getDate()}${month}${date.getFullYear()}T${hour}:00PP${disp}`;
}

exports.addToFile = addToFile;