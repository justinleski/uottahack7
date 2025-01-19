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
                slug: 'alice',
                url: 'https://example.com/dog1.jpg',
                animal: 'dog',
                location: { lat: 40.73061, lon: -73.935242 }
            },
            {
                slug: 'bob',
                url: 'https://example.com/dog2.jpg',
                animal: 'dog',
                location: { lat: 40.73062, lon: -73.935300 }
            },
            {
                slug: 'charlie',
                url: 'https://example.com/cat1.jpg',
                animal: 'cat',
                location: { lat: 40.73065, lon: -73.935200 }
            },
            {
                slug: 'dave',
                url: 'https://example.com/cat2.jpg',
                animal: 'cat',
                location: { lat: 40.73070, lon: -73.935100 }
            },
            {
                slug: 'eve',
                url: 'https://example.com/bird1.jpg',
                animal: 'bird',
                location: { lat: 40.78000, lon: -73.960000 }
            },
            {
                slug: 'frank',
                url: 'https://example.com/dog3.jpg',
                animal: 'dog',
                location: { lat: 40.78010, lon: -73.960300 }
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