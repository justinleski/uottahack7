const query = require("../../db/access/query");

module.exports = async function main(req, res) {
    try {
        const slug = req.query.slug || req.session.user.slug;
        let id = ((await query({name: "get_id_by_slug", params: [slug]}))[0])?.id;
        const urls = (await query({name: "get_user_images", params: [id]}));
        console.log(urls);
        res.json(urls);
    }
    catch (e) {
        console.log(e);
        res.sendStatus(400);
    }

}