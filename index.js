const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000;

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

const db = require('./models');//(sequelize, DataTypes);
let server;
db.sequelize.sync().then(() => {    
})

server = app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})
const redis = require('redis');
var io = require('socket.io').listen(server);
// var store = redis.createClient(); 
const configs = {
    host: '127.0.0.1',
    port: '6379',
    password: ''
}  
var pub = redis.createClient("redis://localhost:6379");
var sub = redis.createClient("redis://localhost:6379");

const notificationController = require('./controllers/notificationController');
const merchantController = require('./controllers/merchantController');
const { sequelize } = require('./models/index.js');
const Sequelize = require('sequelize');
const notifications = require('./models/notifications')(sequelize, Sequelize.DataTypes);

app.get('/', notificationController);
app.get('/merchant', merchantController); //For connecting merchant
app.get('/notification', notificationController); // app.use
app.post('/notification', notificationController);
app.get('/notifications', notificationController);

sub.on("message", function (channel, data) {
    data = JSON.parse(data);
    console.log("Inside Redis_Sub: data from channel " + channel + ": " + (data));
    io.sockets.in(channel).emit('message', data);
});

io.sockets.on('connection', function (socket) {

    sub.on("subscribe", function(channel, count) {
        console.log("Subscribed to " + channel + ". Now subscribed to " + count + " channel(s).");
    });

    socket.on("connectMid", function (data) {
        console.log("Got 'connectMid' from client, " + JSON.stringify(data));
        sub.subscribe(data.mid);
        socket.join(data.mid);
        notifications.findAll({
            where: {
                mid: data.mid,
                unread: true
            }
        }).then(__d => {
            pub.publish(data.mid, JSON.stringify({ count: __d.length }));
        })
    });

    socket.on('disconnect', function () {
        // sub.quit();
        // pub.publish("chatting","User is disconnected :" + socket.id);
    });

});






