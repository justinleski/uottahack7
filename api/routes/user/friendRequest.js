const query = require("../../db/access/query");
module.exports = async function main(req, res) {

    try {
        const friend_slug = req.body.slug;
        console.log(req.body, "BODY");
        const my_id = req.session.user.id;

        if (!friend_slug) {
            res.sendStatus(400);
            return;
        }

        const id  = ((await query({name: "get_id_by_slug", params: [friend_slug]}))[0])?.id;
        if (!id) {
            res.sendStatus(400);
            return;
        }

        const are_freinds = (await query({name: "are_friends", params: [id, my_id, my_id, id]})).length > 0
        if (are_freinds) {
            console.log(1);
            res.sendStatus(400);
            return;
        }

        await query({name: "add_friend_request", params: [my_id, id]});
        res.sendStatus(200);
    }
    catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
}