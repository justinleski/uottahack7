const aws_upload = require("../../services/aws_upload");
const groq = require("../../services/groq");

module.exports = async function main(req, res) {
    try {
        const file = req.file;
        if (!file) {
            res.sendStatus(400);
            return;
        }

        const obj = await aws_upload(file);
        console.log(obj, "The image seems to have been added to AWS");
        if (obj.error) {
            res.sendStatus(500);
            return;
        }

        const url = obj.url;
        const info = await groq(url);

        console.log(info);
        res.json({url: obj.url});
    }
    catch (e) {
        res.sendStatus(500);
    }
}