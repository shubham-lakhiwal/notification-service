const redis = require('redis');
class Redis {
    constructor() {
        this.host = process.env.REDIS_HOST || '127.0.0.1'
        this.port = process.env.REDIS_PORT || '6379'
        this.clientPublish = null;
        this.clientSubscriber = null;
    }
   getConnection(client = 'subscriber') {
        if(client === 'publisher') {
            if(this.clientPublish) {
                return this.clientPublish;
            }

            this.clientPublish =  redis.createClient({
                host: this.host,
                port: this.port
            })
            return this.clientPublish;
        } else {
            if(this.clientSubscriber) {
                return this.clientSubscriber;
            }

            this.clientSubscriber =  redis.createClient({
                host: this.host,
                port: this.port
            })
            return this.clientSubscriber;
        }
    }
}

module.exports = new Redis();