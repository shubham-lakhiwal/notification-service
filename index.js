const express = require('express')
const bodyParser = require('body-parser')
const notificationController = require('./controllers/notificationController');
const merchantController = require('./controllers/merchantController');
const { sequelize } = require('./models/index.js');
const Sequelize = require('sequelize');
const socketHandlers = require('./handlers/socketHandlers');
const notifications = require('./models/notifications')(sequelize, Sequelize.DataTypes);
const app = express()
const port = 3000;

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

const db = require('./models');
let server;
db.sequelize.sync().then(() => {
    server = app.listen(port, () => {
        console.log(`App running on port ${port}.`)
    })
    
    socketHandlers(server);
})

app.get('/', notificationController);
app.get('/merchant', merchantController); //For connecting merchant
app.get('/notification', notificationController); // app.use
app.post('/notification', notificationController);
app.get('/notifications', notificationController);




