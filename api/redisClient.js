const redis = require("redis");
const redisClient = redis.createClient();
redisClient.connect().catch(console.error);
console.log("connected to redis");

module.exports = redisClient;