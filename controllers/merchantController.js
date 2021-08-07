const path = require('path');
const { sequelize } = require('../models/index.js');
const Sequelize = require('sequelize');
const notifications = require('../models/notifications')(sequelize, Sequelize.DataTypes);

const merchantController = (req, res) => {
    if(req.method === 'GET') {
        return res.sendFile(path.join(__dirname, '../index_client.html'));
    }
}

module.exports = merchantController;