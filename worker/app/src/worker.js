var amqp = require('amqplib/callback_api');
const parser = require('./helpers/parser.js');
const db = require('./services/mongo.js');
const { Logger } = require('./helpers/logger.js');
require('dotenv').config()
var handledFiles = 0;
//En los clientes hemos de meter una manera de monitorizar cual es el primer mensaje de cada dia
//asi podemos pasarlo por el mensaje y crear el tar.gz 

// function getCurrentDate(){
//     //Get date into a string with DDMMYYY format but 1 day less (to prevent error the first day)
//     let date = new Date();
//     return `${date.getDate()-1}${date.getMonth()+1}${date.getFullYear()}`;
// }

function main() {
    db.connectToDb();
    const winston = new Logger();
    
    amqp.connect(`amqp://${process.env.RABBIT_SERVICE}`, function (error, connection) {
        connection.createChannel(function (error, channel) {
            var queue = process.env.QUEUE_NAME;

            channel.assertQueue(queue, {
                durable: true
            });
            channel.prefetch(1);

            winston.logger.silly(` [*] Waiting for messages in %s. To exit press CTRL+C`, queue);
            channel.consume(queue, function (msg) {
                let [data, who, how, when, where] = msg.content.toString().split(',');
                
                parser.parseFile(data, who, when, () => {
                    channel.ack(msg);
                    handledFiles++;
                });
            }, {
                noAck: false
            });
        });
    });

}

main();