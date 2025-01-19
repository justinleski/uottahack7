const query = require("../../db/access/query");

module.exports = async function main(req, res) {
    try {
        const id = req.session.user.id;
        if (!id) {
            res.sendStatus(400);
            return;
        }

        const reqs = await query({name: "my_requests", params: [id]});


        const ressss = await Promise.all(reqs.map(async i=>{
            console.log(i);
            i.slug = (await (await query({name: "get_slug_by_id", params: [i.user_id]}))[0].slug);
            i.user_id = undefined;
            return i;
        }));

        console.log(ressss, "RESSSSSS");
        res.json(ressss);

    }
    catch (e) {
        console.log(e);
        res.sendStatus(400);
    }
}