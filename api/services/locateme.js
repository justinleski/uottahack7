//AIzaSyDqJY6KvWYCDBYaYXW4uTjBeV92vpy2EIs

const axios = require('axios');

// Replace with your API key
const API_KEY = 'AIzaSyDqJY6KvWYCDBYaYXW4uTjBeV92vpy2EIs';

async function getCityAndCountry(lat, lng) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`;

    try {
        const response = await axios.get(url);
        const results = response.data.results;

        if (results.length > 0) {
            const addressComponents = results[0].address_components;

            let city = null;
            let country = null;

            addressComponents.forEach(component => {
                if (component.types.includes('locality')) {
                    city = component.long_name;
                }
                if (component.types.includes('country')) {
                    country = component.long_name;
                }
            });

            return { city, country };
        } else {
            throw new Error('No results found for the given coordinates.');
        }
    } catch (error) {
        console.error('Error fetching geocoding data:', error.message);
        return null;
    }
}

module.exports = getCityAndCountry;