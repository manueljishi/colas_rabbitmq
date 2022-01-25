const fs = require('fs');
const path = require('path');
require('dotenv').config();

const STORE_PATH = process.env.STORE_PATH;
function addToFile(data, fileName) {
    let fileDir = path.join(STORE_PATH, `${fileName}.json`)
        try {
            fs.writeFileSync(fileDir, JSON.stringify(data), 'utf8');
            console.log(`Finished writing ${fileDir}`)
            return undefined;
        } catch (writeException) {
            console.log(writeException)
            return writeException
        }

}

exports.addToFile = addToFile;