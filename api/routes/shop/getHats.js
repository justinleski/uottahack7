const query = require("../../db/access/query");

module.exports = async function main(req, res) {
    try {
        const id = req.session.user.id;

        if (!id) {
            res.sendStatus(400);
            return;
        }

        const my_hats = new Set((await query({name: "get_hats", params: [id]})).map(i=>i.hat_id));
        const all_hats = await query({name: "get_all_hats", params: []});

        for (let hat of all_hats) {
            if (my_hats.has(hat.hat_id)) hat.owned = true;
        }

        console.log(all_hats, my_hats);
        res.json(all_hats);
    }
    catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
}