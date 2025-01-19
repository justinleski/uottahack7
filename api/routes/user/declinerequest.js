const query = require("../../db/access/query");

module.exports = async function main(req, res) {
    try{
        const id = req.session.user.id;

        if (!id) {
            res.sendStatus(400);
            return;
        }

        const slug = req.body.slug;

        if (!slug) {
            res.sendStatus(400);
            return;
        }

        const id2  = ((await query({name: "get_id_by_slug", params: [slug]}))[0])?.id;
        await query({name:"remove_request", params: [id2, id]});

        res.sendStatus(200);
    }
    catch (e) {
        res.sendStatus(500);
        return;
    }
}