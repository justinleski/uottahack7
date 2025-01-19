const client = require("./elasticsearch");

module.exports = async function main(url, slug, location, animal) {
    try {
        await client.index({
            index: 'images_index',
            body: {
                url, slug, location, animal
            }
        });

        console.log(animal);
        await client.indices.refresh({ index: 'images_index' });

        return true;
    }
    catch (e) {
        console.log(e);
        return false;
    }
}

