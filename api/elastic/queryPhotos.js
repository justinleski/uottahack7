const client = require("./elasticsearch");

function getPrecisionFromRadiusKm(radiusKm) {
    // Very naive approach, you can tweak as you see fit
    if (radiusKm >= 500) return 5;  // huge area
    if (radiusKm >= 100) return 7;
    if (radiusKm >= 20)  return 8;
    if (radiusKm >= 5)   return 8;
    if (radiusKm >= 1)   return 10;
    if (radiusKm >= 0.2) return 10;
    if (radiusKm >= 0.05) return 10;
    return 10;
}

// async function main({ lat, lon, radiusKm }) {
//     const precision = getPrecisionFromRadiusKm(radiusKm);
//     const response = await client.search({
//         index: 'images_index',
//         body: {
//             size: 0, // only want aggregations
//             query: {
//                 bool: {
//                     filter: [
//                         {
//                             geo_distance: {
//                                 distance: `${radiusKm}km`,
//                                 location: { lat, lon }
//                             }
//                         }
//                     ]
//                 }
//             },
//             aggs: {
//                 images_grid: {
//                     geohash_grid: {
//                         field: 'location',
//                         precision: precision
//                     },
//                     aggs: {
//                         animal_buckets: {
//                             terms: {
//                                 field: 'animal',
//                                 size: 1,             // only the top (most frequent) animal
//                                 order: {
//                                     _count: 'desc'
//                                 }
//                             },
//                             aggs: {
//                                 top_animal_doc: {
//                                     top_hits: {
//                                         size: 1
//                                     }
//                                 }
//                             }
//                         }
//                     }
//                 }
//             }
//         }
//     });
//
//     // Extract and parse results
//     const buckets = response.aggregations.images_grid.buckets;
//     const clusters = buckets.map(bucket => {
//         // 'animal_buckets.buckets' should have exactly 1 bucket since size=1
//         const topAnimalBucket = bucket.animal_buckets.buckets[0];
//         if (!topAnimalBucket) {
//             return null; // no docs in this bucket? Unlikely, but just in case
//         }
//
//         const docCount = topAnimalBucket.doc_count;
//         const topHit = topAnimalBucket.top_animal_doc.hits.hits[0];
//         const source = topHit?._source;
//
//         return {
//             animal: topAnimalBucket.key, // e.g. "dog"
//             slug: source.slug,
//             url: source.url,
//             location: source.location
//         };
//     }).filter(Boolean);
//
//     return clusters;
// }

async function main({ lat, lon, radiusKm }) {
    const precision = 10;

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
                                location: { lat, lon },
                            },
                        },
                    ],
                },
            },
            aggs: {
                images_grid: {
                    geohash_grid: {
                        field: 'location',
                        precision: precision,
                    },
                    aggs: {
                        animal_buckets: {
                            terms: {
                                field: 'animal',
                                size: 1,      // only the top (most frequent) animal per geohash
                                order: {
                                    _count: 'desc',
                                },
                            },
                            aggs: {
                                // Grab up to 7 top-hits (instead of just 1)
                                top_animal_doc: {
                                    top_hits: {
                                        size: 7,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    // Helper function to shift coordinates in a circle around the original lat/lon.
    // This uses a simple approach: we distribute each 'duplicate' around the center,
    // at a distance = offsetDistanceKm (km) away. Convert km to degrees based on lat.
    function offsetCoordinates(originalLat, originalLon, offsetDistanceKm, index, totalCount) {
        const latPerKm = 1 / 111.32 ; // rough conversion factor: ~111.32 km per 1 degree of latitude
        const lonPerKm = 1 / (111.32 * Math.cos((originalLat * Math.PI) / 180)) ; // adjusts for longitude scale at given lat

        const angle = (2 * Math.PI * index) / totalCount; // spread them evenly in a circle
        const distanceLat = Number(offsetDistanceKm) * latPerKm * Math.cos(angle);
        const distanceLon = Number(offsetDistanceKm) * lonPerKm * Math.sin(angle);

        return {
            lat: Number(originalLat) + distanceLat,
            lon: Number(originalLon) + distanceLon,
        };
    }

    // Decide how close is "identical or very similar"
    // If two points differ by less than this threshold (in degrees), consider them duplicates
    const COORD_THRESHOLD = 1e-6; // ~0.000001 degree ~ ~0.11 m

    // Quick utility to check if two coordinates are very close
    function coordinatesAreClose(lat1, lon1, lat2, lon2) {
        return (
            Math.abs(lat1 - lat2) < COORD_THRESHOLD &&
            Math.abs(lon1 - lon2) < COORD_THRESHOLD
        );
    }

    const buckets = response.aggregations.images_grid.buckets;

    // Build clusters array
    const clusters = buckets.map((bucket) => {
        // 'animal_buckets.buckets' should have exactly 1 bucket (size=1) => top frequent animal
        const topAnimalBucket = bucket.animal_buckets.buckets[0];
        if (!topAnimalBucket) {
            return null; // no docs in this bucket? Unlikely, but just in case
        }

        // Up to 7 top hits for this animal, in this geohash
        const hits = topAnimalBucket.top_animal_doc.hits.hits;
        if (!hits.length) return null;

        const docs = hits.map((hit) => {
            const s = hit._source;
            return {
                animal: topAnimalBucket.key, // e.g., "dog"
                slug: s.slug,
                url: s.url,
                location: {
                    lat: s.location.lat,
                    lon: s.location.lon,
                },
            };
        });

        // Group together docs that share "very similar" coords
        // We will store them in { [coordKey]: [] } so we can offset them
        const locationMap = {};
        for (const doc of docs) {
            const { lat: docLat, lon: docLon } = doc.location;
            // For grouping, we need a key. Because of float precision, a direct string might not be best,
            // but for demonstration let's use the lat/lon truncated to 6 decimals or so:
            const coordKey = `${Number(docLat).toFixed(6)}_${Number(docLon).toFixed(6)}`;

            if (!locationMap[coordKey]) {
                locationMap[coordKey] = [];
            }
            locationMap[coordKey].push(doc);
        }

        // For each group of duplicates, offset them in a small circle
        const offsetDist = radiusKm / 8;
        for (const key in locationMap) {
            const group = locationMap[key];
            if (group.length > 1) {
                // More than 1 doc at (very) similar location => offset them
                group.forEach((doc, i) => {
                    const { lat: origLat, lon: origLon } = doc.location;
                    const { lat: newLat, lon: newLon } = offsetCoordinates(
                        origLat,
                        origLon,
                        offsetDist,
                        i,
                        group.length
                    );
                    doc.location.lat = newLat;
                    doc.location.lon = newLon;
                });
            }
        }

        return {
            // You could store a "centroid" or the geohash's bounding box if you want:
            // location: getCentroidOfBucket(bucket),
            docs, // up to 7 docs, potentially offset
        };
    }).filter(Boolean);

    let final = [];
    clusters.map(i=>{
        return i.docs
    }).map((i)=>{final = final.concat(i)});
    return final;
}

module.exports = main;