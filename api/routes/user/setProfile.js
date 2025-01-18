const query = require("../../db/access/query");

module.exports = async function main(req, res) {
    try {
        const newProfile = req.body;
        // we can set Name and favourite animal
        // .name and .animal
        console.log(newProfile, req.session.user);
        try{
            await query({name: "update_personal", params: [req.session.user.id, newProfile.name, newProfile.animal]});
            res.sendStatus(200);
        }
        catch (e) {
            res.sendStatus(500);
        }
    }
    catch (e) {
        res.sendStatus(500);
    }

}