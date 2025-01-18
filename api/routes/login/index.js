const hash = require("../../services/hash");
const query = require("../../db/access/query");
const bcrypt = require("bcrypt");

module.exports = async function main(req, res) {
    try {
        const body = req.body;
        const email = body.email;
        const password = body.password;

        if (!email || !password) {
            res.sendStatus(400);
            return;
        }
        const hashed_email = hash.email(email);

        let password_hash = (await query({name: "get_password", params: [hashed_email]}))[0];
        if (!password_hash) {
            res.sendStatus(403);
            return;
        }

        password_hash = password_hash.password_hash;

        const match = await bcrypt.compare(password, password_hash);

        if (!match) {
            console.log(1);
            res.sendStatus(403);
            return;
        }

        let id = (await query({name: "get_id", params: [hashed_email]}))[0];
        let slug = (await query({name: "get_slug", params: [id.id]}))[0];
        slug = slug.slug;

        req.session.user = {id: id.id, slug};
        console.log(slug);

        res.sendStatus(200);
        console.log("OK");
        return;
    }
    catch (e) {
        res.sendStatus(500);
    }
}