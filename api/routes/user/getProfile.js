const query = require("../../db/access/query");

module.exports = async function main(req, res) {
    try {
        const slug = req.query.slug;

        console.log(slug);
        if (!slug) {
            res.sendStatus(400);
            return;
        }
        try{
            let id = ((await query({name: "get_id_by_slug", params: [slug]}))[0])?.id;
            console.log(id);
            if (!id) throw new Error();
            const personal = (await query({name: "get_personal", params: [id]}));
            console.log(personal[0]);
            res.json(personal[0]);
        }
        catch (e) {
            console.log(e);
            res.sendStatus(500);
        }
    }
    catch (e) {
        res.sendStatus(500);
    }


}