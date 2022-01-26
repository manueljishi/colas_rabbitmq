// require('dotenv').config();
// const MAX_FILES = process.env.MAX_FILES;
// let count = 0;
// let disp = 0;

let currentDate;

function checkDate(date) {
    // count++;
    
    // if (count == parseInt(MAX_FILES)) {
    //     count = 0;
    //     disp++;
    //     let value = formatNewDate(date);
    //     let tempDate = currentDate;
    //     currentDate = value;
    //     return {
    //         update: true,
    //         date: tempDate
    //     }
    // }
    let value = formatNewDate(date);
    if (value !== currentDate) {
        let tempDate = currentDate
        currentDate = value;
        // count = 0;
        // disp = 0;
        return {
            update: true,
            date: tempDate
        }
    } else {
        return {
            update: false,
            date: undefined
        }
    }
}

function formatNewDate(date) {
    //Get date into a string with DDMMYYYTHH:MMDISP format
    let day = date.getDate();
    if (day < 10) {
        day = "0" + day;
    }
    let hour = date.getHours();
    if (hour < 10) {
        hour = "0" + hour;
    }
    let month = date.getMonth() + 1;
    if (month < 10) {
        month = "0" + month;
    }
    return `${day}${month}${date.getFullYear()}T${hour}:00`;
}

exports.checkDate = checkDate;