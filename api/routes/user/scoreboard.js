const getBoard = require("../../elastic/getScoreboard");

module.exports = async function main(req, res) {
    try {
        const id = req.session.user.id;
        if (!id) {
            res.sendStatus(400);
            return;
        }

        const scoreboard = await getBoard(id);
        console.log(scoreboard);
        res.json(scoreboard);
    }
    catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
}