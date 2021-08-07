// Notifications schema
// const sendCountNotification = require('../utils/utils');

module.exports = (sequelize, DataTypes) => {
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
                // sendCountNotification(newData['mid']);
            },
            afterBulkUpdate: (notifications, option) => {
                console.log('New bulk updated', this);
                const _mid = notifications['where']['mid']
                // sendCountNotification(_mid);
            },
        }
    });

    return Notifications;
}