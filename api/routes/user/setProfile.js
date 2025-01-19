const query = require("../../db/access/query");
const groq = require("../../services/groq");

module.exports = async function main(req, res) {
    try {
        const newProfile = req.body;
        // we can set Name and favourite animal
        // .name and .animal
        console.log(newProfile, req.session.user);
        try{
            const legit = await groq.moderateText("User Name: "+newProfile.name ? newProfile.name : "Unknown"+"\n User's favourite animal: "+newProfile.animal ? newProfile.animal : "Unknown");
            if (legit.toLowerCase().includes("unsafe")) {
                res.sendStatus(400);
                return;
            }
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