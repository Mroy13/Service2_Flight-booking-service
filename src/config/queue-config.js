const amqplib = require('amqplib');
let channel,connection;
async function connectQueue(){
    try {
       // console.log("notiqueue");
             connection=await amqplib.connect("amqp://localhost");
             channel=await connection.createChannel();
             //console.log(channel);
        await channel.assertQueue('noti-queue');

    } catch (error) {
        console.log(error);
        throw error;
    }
}


async function sendData(data){
   // console.log(data);
   // console.log(channel);
    try {
        await channel.sendToQueue('noti-queue',Buffer.from(JSON.stringify(data)))
    } catch (error) {
        console.log("queue-error:",error);
    }
}

module.exports={
    connectQueue,
    sendData
}