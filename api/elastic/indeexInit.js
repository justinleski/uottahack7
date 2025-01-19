const fs = require("fs");
const animalTxt = fs.readFileSync("/Users/nikolajgorovikov/WebstormProjects/wildAround/api/elastic/animals.txt", {encoding: "utf-8"});
const communicate = require("../python/communicate");
const client = require("./elasticsearch");

const animalIndex =  {
        mappings: {
            properties: {
                name: { type: "keyword" },
                embedding: { type: "dense_vector", dims: 768 },
            },
        },
    };

const scoreboardIndex = {
    "mappings": {
        "properties": {
            "id": {
                "type": "keyword"
            },
            "slug": {
                "type": "text"
            },
            "balance": {
                "type": "integer"
            },
            "location": {
                "type": "geo_point"
            }
        }
    }
};

const animals = animalTxt.split("\n");
async function main() {
    try {
        await client.indices.delete({
            index: "animals"
        });
    }
    catch (e) {

    }

    await client.indices.create({
        index: "animals",
        body: animalIndex
    });

    try {
        await client.indices.delete({
            index: "scoreboard"
        });
    }
    catch (e) {}

    await client.indices.create({
        index: "scoreboard",
        body: scoreboardIndex
    });

    for (let animal of animals) {
        const an = {}
        an.name = animal;
        an.embedding = await communicate(animal);

        await client.index({
            index: "animals",
            document: an
        });
    }

    try {
        await client.indices.delete({ index: 'images_index' });
    } catch (error) {
        // ignore if it doesn't exist
    }

    // 2. Create index with the mapping
    await client.indices.create({
        index: 'images_index',
        body: {
            mappings: {
                properties: {
                    slug: { type: 'keyword' },
                    animal: { type: 'keyword' },
                    url: { type: 'keyword' },
                    location:  { type: 'geo_point' }
                }
            }
        }
    });

    async function indexTestDocuments() {
        // Example dataset with different animals in roughly the same area
        const docs = [
            {
                "slug": "leopard",
                "url": "https://files.worldwildlife.org/wwfcmsprod/images/Amur_Leopard_/hero_small/k6vvkt4tj_amur_leopard_99144569.jpg",
                "animal": "leopard",
                "location": { "lat": 45.4215, "lon": -75.6972 }
            },
            {
                "slug": "cougar",
                "url": "https://i.cbc.ca/1.6444189.1690918039!/fileImage/httpImage/image.jpg_gen/derivatives/16x9_1180/cougar-kitten.jpg",
                "animal": "cougar",
                "location": { "lat": 45.4248, "lon": -75.6950 }
            },
            {
                "slug": "capybara",
                "url": "https://www.newquayzoo.org.uk/wp-content/uploads/2021/06/capybara-1.jpg",
                "animal": "capybara",
                "location": { "lat": 45.4169, "lon": -75.6896 }
            },
            {
                "slug": "deer",
                "url": "https://ichef.bbci.co.uk/news/480/cpsprodpb/4b9a/live/09ef6d00-7c18-11ef-b84b-2f70cde30853.jpg",
                "animal": "deer",
                "location": { "lat": 45.4290, "lon": -75.6840 }
            },
            {
                "slug": "horse",
                "url": "https://ftw.usatoday.com/wp-content/uploads/sites/90/2023/06/horses2.jpeg",
                "animal": "horse",
                "location": { "lat": 45.4350, "lon": -75.7067 }
            },
            {
                "slug": "dog",
                "url": "https://i.cbc.ca/1.7193672.1714765068!/fileImage/httpImage/scooby-arson-dog-may-3-2024.jpg",
                "animal": "dog",
                "location": { "lat": 45.4472, "lon": -75.7195 }
            },
            {
                "slug": "grate",
                "url": "https://cdn.vox-cdn.com/thumbor/F3K50-YfGxX1Nnuti4Ca2JODIX0=/0x0:2484x1106/1200x0/filters:focal(0x0:2484x1106):no_upscale()/cdn.vox-cdn.com/uploads/chorus_asset/file/3691570/Grate_color_1.0.jpg",
                "animal": "unknown",
                "location": { "lat": 45.4118, "lon": -75.6468 }
            },
            {
                "slug": "beaver",
                "url": "https://beachmetro.com/wp-content/uploads/2024/09/web-Wild-Side-beaver-three-legs-jan-2021.jpg",
                "animal": "beaver",
                "location": { "lat": 45.4311, "lon": -75.6713 }
            },
            {
                "slug": "goose",
                "url": "https://www.mendonomasightings.com/wp-content/uploads/2022/04/Canada-Goose-family-by-Ron-Bolander.jpg",
                "animal": "goose",
                "location": { "lat": 45.4571, "lon": -75.6402 }
            },
            {
                "slug": "ant",
                "url": "https://fox59.com/wp-content/uploads/sites/21/2022/09/ant.jpg",
                "animal": "ant",
                "location": { "lat": 45.3993, "lon": -75.6829 }
            },
            {
                "slug": "zebra",
                "url": "https://canadiangeographic.ca/wp-content/uploads/2022/02/equus_grevyi.jpg",
                "animal": "zebra",
                "location": { "lat": 45.4358, "lon": -75.6597 }
            },
            {
                "slug": "cow",
                "url": "https://media-cldnry.s-nbcnews.com/image/upload/t_fit-1500w,f_auto,q_auto:best/MSNBC/Components/Video/201703/NC_loosecows0331_1920x1080.jpg",
                "animal": "cow",
                "location": { "lat": 45.4407, "lon": -75.6905 }
            },
            {
                "slug": "crow",
                "url": "https://scx2.b-cdn.net/gfx/news/2015/crow.jpg",
                "animal": "crow",
                "location": { "lat": 45.4282, "lon": -75.7618 }
            },
            {
                "slug": "butterfly",
                "url": "https://s-media-cache-ak0.pinimg.com/736x/9c/bf/69/9cbf69950c7de9ece285a7942fbc36b5.jpg",
                "animal": "butterfly",
                "location": { "lat": 45.4080, "lon": -75.7289 }
            },
            {
                "slug": "wildcat",
                "url": "https://wildlifeimages.org/wp-content/uploads/2024/03/0001_AdobeStock_460169080.jpg",
                "animal": "wildcat",
                "location": { "lat": 45.4496, "lon": -75.7043 }
            },
            {
                "slug": "otter",
                "url": "https://i.redd.it/z9he1pbl92kb1.jpg",
                "animal": "otter",
                "location": { "lat": 45.4113, "lon": -75.7120 }
            },
            {
                "slug": "dog_shelter",
                "url": "https://media.zenfs.com/en/pethelpful_915/39d0e3ca27863459f26fd59b4b1f3e96",
                "animal": "dog",
                "location": { "lat": 45.4054, "lon": -75.6878 }
            }
        ];

        // Index each doc
        for (const doc of docs) {
            await client.index({
                index: "images_index",
                body: doc
            });
        }

        // Refresh so they are immediately available
        await client.indices.refresh({ index: "images_index" });

        console.log(`Indexed ${docs.length} test documents.`);
    }

    await indexTestDocuments();



}

main();