const query = require("../../db/access/query");
module.exports = async function main(req, res) {

    try {
        const friend_slug = req.body.slug;
        const my_id = req.session.user.id;

        console.log(req.body);
        if (!friend_slug) {
            res.sendStatus(400);
            return;
        }

        const id  = ((await query({name: "get_id_by_slug", params: [friend_slug]}))[0])?.id;

        if (!id) {
            res.sendStatus(400);
            return;
        }

        const has = ((await query({name: "in_request", params: [id, my_id]})).length > 0);
        console.log(has);
        if (has) {
            await query({name: "add_friend", params: [Math.min(Number(my_id), Number(id)), Math.max(Number(my_id), Number(id))]});
            await query({name:"remove_request", params: [id, my_id]});
            res.sendStatus(200);
        }
        else res.sendStatus(400);
    }
    catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
}