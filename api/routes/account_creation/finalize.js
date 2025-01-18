const redis = require("../../redisClient");
const crypto = require("crypto");

module.exports = async function main(req, res) {
    try {
        const body = req.body;
        const uuid = body.uuid;
        const otp = body.otp;

        if (!uuid || !otp) {
            res.sendStatus(400);
            return;
        }

        const correct_otp = await redis.get("users:otp:"+uuid);
        if (!correct_otp) {
            res.sendStatus(403);
            return;
        }

        if (Number(correct_otp) === Number(otp)) {
            const uuid2 = crypto.randomBytes(32).toString('hex');
            await redis.set("users:tempemail:"+uuid2, await redis.get("users:tempemail:"+uuid));
            await redis.expire("users:tempemail:"+uuid2, 600);
            await redis.set("users:password:"+uuid2, "1");
            await redis.expire("users:password:"+uuid2, 600);
            res.send(uuid2);
            return;
        }

        res.sendStatus(403);
    }
    catch (e) {
        console.log(e);
        res.sendStatus(500);
    }


}