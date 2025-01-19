const client = require("../elastic/elasticsearch");
const python = require("../python/communicate");

module.exports = async function(text) {
    const vector = await python(text);

    if (!vector) return null;
    try {
        // Search for the animal in the "animals" index
        const response = await client.search({
            index: "animals",
            body: {
                query: {
                    bool: {
                        should: [
                            // Exact match on the "name" field
                            {
                                term: {
                                    name: text, // Exact match has the highest priority
                                },
                            },
                            // Vector similarity using cosine similarity
                            {
                                script_score: {
                                    query: {
                                        match_all: {}, // Apply similarity to all documents
                                    },
                                    script: {
                                        source: "cosineSimilarity(params.query_vector, 'embedding') + 1.0",
                                        params: {
                                            query_vector: vector, // Pass the vector from Python
                                        },
                                    },
                                },
                            },
                        ],
                        minimum_should_match: 1, // At least one condition should match
                    },
                },
                size: 1, // Return only the best match
            },
        });

        // Extract the animal name from the search result
        if (response.hits.hits.length > 0) {
            return response.hits.hits[0]._source.name;
        } else {
            return null; // No match found
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}