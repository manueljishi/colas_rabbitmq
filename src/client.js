const fs = require('fs');
var amqp = require('amqplib/callback_api');
require('dotenv').config();

const filesDir = process.env.FILES_DIR

amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }
        var queue = process.env.QUEUE_NAME;
        var msg; //= `este es el mensaje, client.js, XXXXX, ${new Date()}, XXXX`
        channel.assertQueue(queue, {
            durable: true
        });
        fs.readdir(filesDir, (err, files)=> {
            files.forEach(file => {
                msg = `${filesDir}/${file},${process.env.PROCESS_NAME},XXXX,${getCurrentDate()},XXXX`;
                channel.sendToQueue(queue, Buffer.from(msg), {
                    persistent: true
                });
                console.log(" [x] Sent '%s'", msg);
            })
        })
        
        
    });
    setTimeout(function() {
        connection.close();
        process.exit(0);
    }, 1500);
});

function getCurrentDate(){
    //Get date into a string with DDMMYYY format
    let date = new Date();
    return `${date.getDate()}${date.getMonth()+1}${date.getFullYear()}`;
}