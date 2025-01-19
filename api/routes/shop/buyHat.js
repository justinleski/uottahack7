const query = require("../../db/access/query");

module.exports = async function main(req, res) {
    try {
        const id = req.session.user.id;

        if (!id) {
            res.sendStatus(400);
            return;
        }

        const hat_id = req.body.pid;
        if (!hat_id) {
            res.sendStatus(400);
            return;
        }

        const coins = Number((await query({name: "get_money", params: [id]}))[0]?.balance) || 0;
        const price = Number((await query({name: "get_price_hat", params: [hat_id]}))[0]?.price) || 0;

        if (isNaN(Number(coins)) || isNaN(Number(price))) {
            res.sendStatus(400);
            return;
        }

        if (price > coins) {
            res.sendStatus(402);
            return;
        }

        const newBalance = Number(coins) - Number(price);

        await query({name: "decrease_money", params: [newBalance, id]});
        await query({name: "buy_hat", params: [id, hat_id]});

        res.sendStatus(200);
        return;
    }
    catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
}