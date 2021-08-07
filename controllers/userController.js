const redis = require('redis');
const publisher = redis.createClient();

const userController = (req,res) => {
    console.log(req.body);
    // publisher.publish("user-notify",JSON.stringify(user))
    // res.send("Publishing an Event using Redis");
}

module.exports = userController;