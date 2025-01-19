const client = require("./elasticsearch");

module.exports = async function main(id, slug, lat, lon, balance) {
    try {
        console.log(balance, id);
        await client.index({
            index: 'scoreboard',
            id,
            body: {
                id, slug, balance, location: {lat, lon}
            }
        });

        await client.indices.refresh({ index: 'scoreboard' });
        console.log("Updated");

        const response = await client.get({
            index: 'scoreboard',
            id: id
        });
        console.log(response, "!!!!!!!");
        return true;
    }
    catch (e) {
        console.log(e, "ERROR");
        return false;
    }
}