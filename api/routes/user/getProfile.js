const query = require("../../db/access/query");

module.exports = async function main(req, res) {

    try {
        console.log(req.session.user);
        const slug = req.query.slug || req.session.user.slug || "leopard";

        console.log(slug, "SLUG");
        if (!slug) {
            res.sendStatus(400);
            return;
        }
        try{
            let id = ((await query({name: "get_id_by_slug", params: [slug]}))[0])?.id;
            console.log(id, "ID");
            const personal = (await query({name: "get_personal", params: [id]}));
            console.log(personal[0], "123212313");
            const coins = Number((await query({name: "get_money", params: [id]}))[0]?.balance) || 0;
            const avatar = (await query({name: "get_avatar", params: [id]}))[0]?.avatar_id;
            const hat = (await query({name: "get_hat", params: [id]}))[0]?.hat_id;
            console.log(avatar, hat, "AVAVAVAVAVAVA");
            const img = {};
            if (Number(avatar) > 0) img.avatar = (await query({name: "get_avatar_url", params: [id]}))[0]?.url;
            if (Number(hat) > 0) img.hat = (await query({name: "get_hat_url", params: [id]}))[0]?.url;
            if (personal[0]) {
                personal[0].balance = coins;
                personal[0].img = img;
                personal[0].animal = personal[0].fav_animal;
                personal[0].slug = slug
            }
            res.json(personal[0] || {name: "Rocky", animal: "Frog", balance: coins, img, slug});
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