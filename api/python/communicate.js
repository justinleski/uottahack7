const axios = require("axios");

async function getEmbedding(text) {
    const embed = 'http://127.0.0.1:3010/embed'; // Replace with your server URL

    const response = await axios.post(embed, text, {
        headers: { 'Content-Type': 'text/plain' },
        responseType: 'arraybuffer', // Expect raw binary response
    });

    // Parse the binary response into a Float32Array
    const buffer = Buffer.from(response.data);
    return Array.from(new Float32Array(buffer.buffer, buffer.byteOffset, buffer.length / 4));
}

module.exports = getEmbedding;