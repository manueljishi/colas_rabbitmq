var amqp = require('amqplib/callback_api');
const parser = require('./helpers/parser.js');
const db = require('./services/mongo.js');
const {writeFileSync, existsSync} = require('fs');
const storePath = '/home/respaldo/Escritorio/';
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

    amqp.connect('amqp://localhost', function (error, connection) {
        connection.createChannel(function (error, channel) {
            var queue = 'task_queue';

            channel.assertQueue(queue, {
                durable: true
            });
            channel.prefetch(1);
            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
            channel.consume(queue, function (msg) {
                let [data, who, how, when, where] = msg.content.toString().split(',');

                //Check if the json file for the day was already created
                if(!existsSync(`${storePath}${when}.json`)){
                    try{
                        writeFileSync(`${storePath}${when}.json`, '[]');
                    }catch (err){
                        console.log(err)
                    }
                }
                
                parser.parseFile(data, who, when, () => {
                    console.log(" [x] Done");
                    channel.ack(msg);
                });
            }, {
                noAck: false
            });
        });
    });
}

main();

