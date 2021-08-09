const sendCountNotification = require('../../utils/utils');
const subscriber = require('../redisHandler').getConnection('subscriber');
const publisher = require('../redisHandler').getConnection('publisher');

const socketHandler = (server) => {
    const io = require('socket.io').listen(server);

    subscriber.on("message", function (channel, data) {
        data = JSON.parse(data);
        console.log("Inside Redis_Sub: data from channel " + channel + ": " + (data));
        io.sockets.in(channel).emit('message', data);
    });

    io.sockets.on('connection', function (socket) {

        subscriber.on("subscribe", function(channel, count) {
            console.log("Subscribed to " + channel + ". Now subscribed to " + count + " channel(s).");
        });

        socket.on("connectMid", function (data) {
            console.log("Got 'connectMid' from client, " + JSON.stringify(data));
            subscriber.subscribe(data.mid);
            socket.join(data.mid); 
            sendCountNotification(data.mid);
        });

        socket.on('disconnect', function (data) { 
            console.log('Disconnected...', data)
            // io.sockets.socket.connect(); 
            // sub.quit();
            // pub.publish("chatting","User is disconnected :" + socket.id);
        });

    });
}

module.exports = socketHandler;