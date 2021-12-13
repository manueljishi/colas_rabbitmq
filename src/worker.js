var amqp = require('amqplib/callback_api');
const exec = require('child_process').exec;
const parser = require('./helpers/parser.js');
const db = require('./services/mongo.js');

/*
Falta implementar:
    Un contador
    Appendear el archivo a el tar.gz
    Meter los datos en mongodb
*/
function main(){
    db.connectToDb();
    
    amqp.connect('amqp://localhost', function(error, connection) {
    connection.createChannel(function(error, channel) {
        var queue = 'task_queue';

        channel.assertQueue(queue, {
            durable: true
        });
        channel.prefetch(1);
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
        channel.consume(queue,function(msg) {
            let [data, who, how, when, where] = msg.content.toString().split(',');
            // exec(`touch "${data}".txt`, (err, stdout, stderr) =>{
            //     if(!err){
            //         console.log(" [x] Received %s", data);
            //         console.log(" [x] Date %s", when);
            //         console.log(" [x] Sender %s", who);
            //     }
            // })
            parser.parseFile(data, who)
            console.log(" [x] Done");
            channel.ack(msg);

        }, {
            noAck: false
        });
    });
});
}

main();

