const query = require("../../db/access/query");

module.exports = async function main(req, res) {
    try {
        const id = req.session.user.id;

        if (!id) {
            res.sendStatus(400);
            return;
        }

        const my_avatars = new Set((await query({name: "get_avatars", params: [id]})).map(i=>i.avatar_id));
        const all_avatars = await query({name: "get_all_avatars"});

        for (let avatar of all_avatars) {
            if (my_avatars.has(avatar.avatar_id)) avatar.owned = true;
        }

        res.json(all_avatars);
    }
    catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
}