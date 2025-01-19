const query = require("../../db/access/query");

module.exports = async function main(req, res) {
    try {
        const id = req.body.id;
        const my_id = req.session.user.id;

        await query({name: "update_hat", params: [my_id, id]});
        res.sendStatus(200);
    }
    catch (e) {
        res.sendStatus(400);
    }
}