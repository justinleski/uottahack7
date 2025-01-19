const client = require("./elasticsearch");

function getPrecisionFromRadiusKm(radiusKm) {
    // Very naive approach, you can tweak as you see fit
    if (radiusKm >= 500) return 2;  // huge area
    if (radiusKm >= 100) return 3;
    if (radiusKm >= 20)  return 4;
    if (radiusKm >= 5)   return 5;
    if (radiusKm >= 1)   return 6;
    if (radiusKm >= 0.2) return 7;
    if (radiusKm >= 0.05) return 8;
    return 9;
}

async function main({ lat, lon, radiusKm }) {
    const precision = getPrecisionFromRadiusKm(radiusKm);
    const response = await client.search({
        index: 'images_index',
        body: {
            size: 0, // only want aggregations
            query: {
                bool: {
                    filter: [
                        {
                            geo_distance: {
                                distance: `${radiusKm}km`,
                                location: { lat, lon }
                            }
                        }
                    ]
                }
            },
            aggs: {
                images_grid: {
                    geohash_grid: {
                        field: 'location',
                        precision: precision
                    },
                    aggs: {
                        animal_buckets: {
                            terms: {
                                field: 'animal',
                                size: 1,             // only the top (most frequent) animal
                                order: {
                                    _count: 'desc'
                                }
                            },
                            aggs: {
                                top_animal_doc: {
                                    top_hits: {
                                        size: 1
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    // Extract and parse results
    const buckets = response.aggregations.images_grid.buckets;
    const clusters = buckets.map(bucket => {
        // 'animal_buckets.buckets' should have exactly 1 bucket since size=1
        const topAnimalBucket = bucket.animal_buckets.buckets[0];
        if (!topAnimalBucket) {
            return null; // no docs in this bucket? Unlikely, but just in case
        }

        const docCount = topAnimalBucket.doc_count;
        const topHit = topAnimalBucket.top_animal_doc.hits.hits[0];
        const source = topHit?._source;

        return {
            animal: topAnimalBucket.key, // e.g. "dog"
            slug: source.slug,
            url: source.url,
            location: source.location
        };
    }).filter(Boolean);

    return clusters;
}

module.exports = main;