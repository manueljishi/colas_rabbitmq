var amqp = require('amqplib/callback_api');
const parser = require('./helpers/parser.js');
const db = require('./services/mongo.js');
const {writeFileSync, existsSync} = require('fs');
const { Logger } = require('./helpers/logger.js');
require('dotenv').config()
const storePath = process.env.STORE_PATH;
/*
Falta implementar:
    Un contador
    Appendear el archivo a el tar.gz
    Meter los datos en mongodb
*/
//En los clientes hemos de meter una manera de monitorizar cual es el primer mensaje de cada dia
//asi podemos pasarlo por el mensaje y crear el tar.gz 

function main() {
    db.connectToDb();
    const winston = new Logger();
    var handledFiles = 0;
    amqp.connect('amqp://localhost', function (error, connection) {
        connection.createChannel(function (error, channel) {
            var queue = 'task_queue';

            channel.assertQueue(queue, {
                durable: true
            });
            channel.prefetch(1);
            winston.logger.silly(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
            channel.consume(queue, function (msg) {
                let [data, who, how, when, where] = msg.content.toString().split(',');

                //Check if the json file for the day was already created
                if(!existsSync(`${storePath}${when}.json`)){
                    try{
                        writeFileSync(`${storePath}${when}.json`, '[]');
                        winston.logger.info(`${when}.json created `)
                    }catch (err){
                        winston.logger.err(err.message);
                    }
                }
                
                parser.parseFile(data, who, when, () => {
                    winston.logger.info(`${when}, request successfully processed, totalCount: ${++handledFiles}`)
                    channel.ack(msg);
                });
            }, {
                noAck: false
            });
        });
    });
}

main();

