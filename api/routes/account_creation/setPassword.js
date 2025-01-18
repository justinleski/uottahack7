const redis = require("../../redisClient");
const crypto = require("crypto");
const hash = require("../../services/hash");
const query = require("../../db/access/query");

module.exports = async function main(req, res) {
    try {
        const body = req.body;
        const uuid = body.uuid;
        const password = body.password;

        if (!uuid || !password) {
            res.sendStatus(400);
            return;
        }

        const ok = await redis.get("users:password:"+uuid);
        if (!ok) {
            res.sendStatus(400);
            return;
        }

        const hashed_email = await redis.get("users:tempemail:"+uuid);
        const password_hash = await hash.password(password)

        if (!hashed_email) {
            res.sendStatus(500);
            return;
        }

        const slug = crypto.randomBytes(16).toString('hex');

        const {insertId} = await query({name: "create_user_main", params: [slug]});
        await query({name: "create_user_login", params: [insertId, hashed_email, password_hash]});

        res.sendStatus(200);
    }
    catch (e) {
        res.sendStatus(500);
    }

}