const hash = require("../../services/hash");
const query = require("../../db/access/query");
const sendMail = require("../../mail");
const redis = require("../../redisClient");
const crypto = require("crypto");

module.exports = async function main(req, res) {
    try {
        const body = req.body;
        const email = body.email;

        if (!email || !email.includes("@")) {
            res.sendStatus(400);
            return;
        }

        const OTP = hash.OTP();
        const uuid = crypto.randomBytes(32).toString('hex');
        const key = "users:otp:"+uuid;
        const key2 = "users:tempemail:"+uuid
        await redis.set(key, OTP);
        await redis.expire(key, 600);
        await redis.set(key2, hash.email(email));
        await redis.expire(key2, 600);

        sendMail(email, "Your one time password for wildAround!", OTP, "");

        res.send(uuid);
    }
    catch (e) {
        res.sendStatus(500);
    }
}