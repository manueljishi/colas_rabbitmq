const fs = require('fs');
var amqp = require('amqplib/callback_api');
const filesDir = '/home/manueljishi/Desktop/queue/testData'

amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }
        var queue = 'task_queue';
        var msg; //= `este es el mensaje, client.js, XXXXX, ${new Date()}, XXXX`
        channel.assertQueue(queue, {
            durable: true
        });
        fs.readdir(filesDir, (err, files)=> {
            files.forEach(file => {
                msg = `${filesDir}/${file}, estadotrafico, XXXX, ${new Date()}, XXXX`;
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