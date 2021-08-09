// Notifications schema
// const sendCountNotification = require('../utils/utils');
const publisher = require('../handlers/redisHandler').getConnection('publisher');

module.exports = (sequelize, DataTypes) => {
    let dispatchNotification;
    let Notifications = sequelize.define('notifications',{
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        mid : {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        message : {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        createdAt: {
            field: 'created_at',
            type: DataTypes.DATE,
        },
        updatedAt: {
            field: 'updated_at',
            type: DataTypes.DATE,
        },
        unread: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }
    }, {
        hooks: {
            afterCreate: (notification, option) => {
                console.log('New data inserted');
                const newData = notification.dataValues;
                dispatchNotification(newData['mid']);
            },
            afterBulkUpdate: (notifications, option) => {
                console.log('New bulk updated', this);
                const _mid = notifications['where']['mid'];
                dispatchNotification(_mid);
            },
        }
    });

    dispatchNotification = (mid) => {
        Notifications.findAll({
            where: {
                mid: mid,
                unread: true
            }
        }).then(__d => {
            publisher.publish(mid, JSON.stringify({ count: __d.length }));
        })
    }

    return Notifications;
}