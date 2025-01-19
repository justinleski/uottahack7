const aws_upload = require("../../services/aws_upload");
const groq = require("../../services/groq");
const query = require("../../db/access/query");
const getAnimal = require("../../elastic/queryAnimal");
const indexAdd = require("../../elastic/addImage");
const locateme = require("../../services/locateme");
const addPerson = require("../../elastic/addPerson");

module.exports = async function main(req, res) {
    try {
        const file = req.file;
        const lat = req.body.latitude;
        const lon = req.body.longitude;
        const id = req.session.user.id;
        const slug = req.session.user.slug;

        if (!file || !lat || !lon || !id) {
            res.status(400).json({message: "Oups, something went wrong..."});
            res.sendStatus(400);
            return;
        }

        const obj = await aws_upload(file);
        console.log(obj, "The image seems to have been added to AWS");
        if (obj.error) {
            res.status(400).json({message: "Oups, something went wrong..."});
            res.sendStatus(500);
            return;
        }

        const url = obj.url;


        const isModerated = await groq.moderate(url);
        console.log(isModerated);
        if (isModerated.error || isModerated.response.toLowerCase().startsWith("no")) {
            res.status(400).json({message: "Oups, looks like you didn't upload an animal..."});
            return;
        }

        const isAnimals = await groq.isAnimal(url);
        console.log(isAnimals);
        if (isAnimals.error || isAnimals.response.toLowerCase().startsWith("no")) {
            res.status(400).json({message: "Oups, looks like you didn't upload an animal..."});
            return;
        }

        const animalObj = await groq.recogniseAnimal(url);
        console.log(animalObj.response);

        const actualAnimal = await getAnimal(animalObj.response);
        console.log(actualAnimal);
        if (!actualAnimal) {
            res.status(400).json({message: "Oups, something went wrong..."});
            return;
        }

        console.log(actualAnimal);

        if (!req.session.user) {
            res.status(400).json({message: "Oups, something went wrong..."});
            return;
        }
        await query({name: "add_image", params: [req.session.user.id, obj.url, actualAnimal]});

        await indexAdd(url, req.session.user.slug, {lat, lon}, actualAnimal);
        const cityAndContry = await locateme(lat, lon);
        console.log(cityAndContry);

        const reward1 = (await groq.estimate(actualAnimal+" in "+cityAndContry.city+" ,"+cityAndContry.country)).response;
        const reward2 = (await groq.estimate2(actualAnimal+" in "+cityAndContry.city+" ,"+cityAndContry.country)).response;
        console.log(reward1, reward2);
        const totalReward = (Number(reward1) || 2)*(Number(reward2) || 2);
        console.log(totalReward);

        const totalCoins = Number((await query({name:"get_earned", params:[id]}))[0]?.balance) || 0;
        const currentCoins = Number((await query({name:"get_money", params:[id]}))[0]?.balance) || 0;
        console.log(totalCoins, "total");
        console.log(currentCoins, "total");
        const newBalanceTotal = totalCoins+totalReward;
        const newBalanceCurrent = currentCoins+totalReward;

        console.log(newBalanceCurrent, id);
        await query({name: "decrease_money", params: [id, newBalanceCurrent]});
        await query({name: "update_earned", params: [id, newBalanceTotal]});
        console.log("Updated money");

        await addPerson(id, slug, lat, lon, newBalanceTotal);

        res.json({url: obj.url, message: "Wow! Awesome "+actualAnimal+" you got!"});
    }
    catch (e) {
        console.log(e);
        res.status(500).json({message: "Oups, something went wrong..."});
    }
}