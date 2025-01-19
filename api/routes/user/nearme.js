const search = require("../../elastic/queryPhotos");

module.exports = async function main(req, res) {
    try {
        const radius = req.body.radius;
        const lat = req.body.lat;
        const lon = req.body.lon;

        if (!radius || !lat || !lon) {
            res.sendStatus(400);
            return;
        }

        const search2 = await search({lat, lon, radiusKm: radius});
        console.log(search2);
        res.json(search2);
    }
    catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
}