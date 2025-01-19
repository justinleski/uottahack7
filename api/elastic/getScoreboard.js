const client = require("./elasticsearch");

async function findNearestUsers(userId) {
    // Fetch the user's location
    try {
        const thing = await client.get({
            index: 'scoreboard',
            id: userId
        });

        console.log(thing, "!@#@@@");
        let user = thing;
        if (!user.found) {
            return null;
        }

        const { location } = user._source;
        console.log(location);

        // Search for nearest users
        const result = await client.search({
            index: 'scoreboard',
            size: 20,
            query: {
                bool: {
                    filter: {
                        geo_distance: {
                            distance: '50km', // Adjust distance as needed
                            location
                        }
                    }
                }
            },
            sort: [
                { _geo_distance: { location, order: 'asc', unit: 'km' } }, // Sort by distance
                { balance: { order: 'desc' } } // Sort by balance within same distance
            ]
        });

        console.log("found", result);
        // Output the results
        return result.hits.hits.map(hit => {
            if (hit._source.id == userId) hit._source.self = true;
            hit._source.id = null;
            return hit._source
        });
    }
    catch (e) {
        try {
            const nearby = await findRandomUserAndNearby();
            if (nearby) {
                const me = {self: true, balance: 0}
                nearby.push(me);
                return nearby;
            }
            else return null;
        }
        catch (e) {
            return null;
        }
    }
}


async function findRandomUserAndNearby() {
    try {
        // Step 1: Get a random user from the index
        const randomUserResponse = await client.search({
            index: 'scoreboard',
            size: 1,
            query: {
                function_score: {
                    random_score: {}, // Generate a random user
                },
            },
        });

        if (randomUserResponse.hits.hits.length === 0) {
            return null;
        }

        const randomUser = randomUserResponse.hits.hits[0]._source;
        console.log(randomUser);
        const { location } = randomUser;

        if (!location) {
            console.log('Random user does not have coordinates.');
            return [];
        }

        // Step 2: Find 19 users near the random user's coordinates
        const nearbyUsersResponse = await client.search({
            index: 'scoreboard',
            size: 19, // Fetch 19 users
            sort: [{ balance: { order: 'desc' } }], // Sort by coins in descending order
            query: {
                bool: {
                    filter: [
                        {
                            geo_distance: {
                                distance: '50km', // Adjust distance as needed
                                location, // Use the random user's coordinates
                            },
                        },
                    ],
                },
            },
        });

        const nearbyUsers = nearbyUsersResponse.hits.hits.map(hit => {
            hit._source.id = null;
            return hit._source;
        });

        return nearbyUsers;
    } catch (error) {
        console.error('Error fetching random user or nearby users:', error);
        throw error;
    }
}


module.exports = findNearestUsers;