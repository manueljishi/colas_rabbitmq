const fs = require('fs');
var amqp = require('amqplib/callback_api');
require('dotenv').config();

const filesDir = process.env.FILES_DIR
var count = 0;
var disp = 0;
amqp.connect(`amqp://${process.env.RABBIT_SERVICE}`, function(error0, connection) {
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
        }, (err, ok)=>{
            if(err){
                console.log(err);
            }else{
                console.log(ok);
            }
        });
        fs.readdir(filesDir, async (err, files)=> {
            for(const file of files) {
                count++;
                if(count%10==0){
                    disp++;
                }
                msg = `${filesDir}${file},${process.env.PROCESS_NAME},XXXX,${getCurrentDate(disp)},XXXX`;
                let response = channel.sendToQueue(queue, Buffer.from(msg), {
                    persistent: true
                });
                //To check if buffer was full or there was an error
                if(!response) {
                    await new Promise(resolve => channel.once('drain', resolve));
                    response = channel.sendToQueue(queue, Buffer.from(msg), {
                        persistent: true
                    });
                }
            }
        })
        
        
    });
});

function getCurrentDate(disp){
    //Get date into a string with DDMMYYY format
    let date = new Date();
    return `${date.getDate()+disp}${date.getMonth()+1}${date.getFullYear()}`;
}