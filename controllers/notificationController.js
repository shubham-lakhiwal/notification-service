const { sequelize } = require('../models/index.js');
const Sequelize = require('sequelize');
const notifications = require('../models/notifications')(sequelize, Sequelize.DataTypes);
const path = require('path');

const notificationController = (request, response) => {
    const mid = request.query.mid,
        unread = true;
    
    const redis = require('redis');
    var pub = redis.createClient("redis://localhost:6379");

    if(request.method === 'GET' && mid) {
        notifications.update({
            unread: !unread
        },{
            where: {
                mid: mid,
                unread: unread
            },
            returning: true
        }).then((res) => {
            notifications.findAll({
                where: {
                    mid: mid,
                    unread: true
                }
            }).then(__d => {
                pub.publish(mid, JSON.stringify({ count: __d.length }));
                return response.json({ res });
            })
            // sendCountNotification(mid);
        });
        
        return;
    }

    if(request.method === 'GET') {
        response.sendFile(path.join(__dirname, '../index.html'));
        return;
    }

    const _d = request.body;
    notifications.create({
        ..._d, 
        unread: true,
        created_at: '2021-08-05'
    }).then(r => {
        console.log(r.dataValues.mid);
        notifications.findAll({
            where: {
                mid: r.dataValues.mid,
                unread: true
            }
        }).then(__d => {
            const redis = require('redis');
            var pub = redis.createClient("redis://localhost:6379");
            pub.publish(r.dataValues.mid, JSON.stringify({ count: __d.length }));
            return response.json({ info: 'Saved the message' });
        })
    });
}

module.exports = notificationController;