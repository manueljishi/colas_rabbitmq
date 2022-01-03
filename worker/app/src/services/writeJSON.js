const fs = require('fs');
let handleCount = 0;
function addToFile(filepath, toSave) {
    try {
        fs.readFile(filepath, 'utf8', (err, data) => {
            if (err) {
                return {
                    errCount: ++handleCount,
                    errMessage: err
                };
            } else {
                obj = JSON.parse(data);
                obj.push(toSave);
                json = JSON.stringify(obj); //convert it back to json

                try {
                    fs.writeFileSync(filepath, json, 'utf8');
                    return undefined;
                } catch (writeException) {
                    return {
                        errCount: ++handleCount,
                        errMessage: writeException
                    };
                }

            }
        })

    } catch (exception) {
        return {
            errCount: ++handleCount,
            errMessage: exception
        };
    }
}

exports.addToFile = addToFile;