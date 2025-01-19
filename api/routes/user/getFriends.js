const query = require("../../db/access/query");

module.exports = async function main(req, res) {
    try {
        const id = req.session.user.id;
        if (!id) {
            res.sendStatus(400);
            return;
        }
        const friends = await query({name: "get_friends", params: [id, id, id]});

        const ressss = await Promise.all(friends.map(async i=>{
            console.log(i);
            i.slug = (await (await query({name: "get_slug_by_id", params: [i.friend_id]}))[0].slug);
            i.friend_id = undefined;
            return i;
        }));

        res.json(ressss);
    }
    catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
}