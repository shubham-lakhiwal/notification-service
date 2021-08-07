const { sequelize } = require('../models/index.js');
const Sequelize = require('sequelize');
const notifications = require('../models/notifications')(sequelize, Sequelize.DataTypes);
const redis = require('redis');
var pub = redis.createClient("redis://localhost:6379");

const sendCountNotification = mid => {
    notifications.findAll({
        where: {
            mid: mid,
            unread: true
        }
    }).then(_d => {
        pub.publish(newData['mid'], JSON.stringify({ count: _d.length }));
    })
}

module.exports = sendCountNotification;