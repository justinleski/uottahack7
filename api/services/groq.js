//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
require("dotenv").config();
const groq_key = process.env.groq;
console.log(groq_key);
const Groq = require('groq-sdk');
const groq = new Groq();

const queries = {
    "anyanimals": "You are an AI moderator, which should assess the image you received. You should answer YES, if the image contains an ALIVE, Real World, animal, or animals, excluding humans, AND if all the animals on the picture are of the same breed/Species. In all other cases, respond with NO. Only answer 'YES' or 'NO'",
    "legal": "You are an AI moderator. Your goal is to find if the image contains any inappropriate, harmful, prohibited, or unfriendly material, such as violence, explicit content, hate symbols or other abusive materials. Please respond only with 'YES' if the image contains prohibited materials, and 'NO' if the image doesn't contain any prohibited materials.",
    "animal": ""
}

async function prompt(query, image) {

}

async function recogniseAnimal(imageUrl) {
    try {
        const chatCompletion = await groq.chat.completions.create({
            "messages": [
                {
                    "role": "user",
                    content: [
                        { type: 'text', text: 'The user took a picture of an animal they spotted. This image was taken in New Your City, it might help you identify some information about the animal. You need to specify the type of the animal or animals on the image (Mammals, Birds, Fish, Amphibians, Reptiles, Insects) and the Breed/Species. Please, respond only with 2 lines, one for type and one for species/breed. DO NOT include any other symbols!' },
                        { type: 'image_url', image_url: { url: imageUrl } }
                    ]
                }
            ],
            "model": "llama-3.2-90b-vision-preview",
            "temperature": 1,
            "max_completion_tokens": 40,
            "top_p": 1,
            "stream": false,
            "stop": null
        });


        return {
            response: chatCompletion.choices[0].message.content
        };
    }
    catch (e) {
        console.log(e);
        return {error: true};
    }
}


async function recogniseAnimal(imageUrl) {
    try {
        const chatCompletion = await groq.chat.completions.create({
            "messages": [
                {
                    "role": "user",
                    content: [
                        { type: 'text', text: 'The user took a picture of an animal they spotted. This image was taken in New Your City, it might help you identify some information about the animal. You need to specify the type of the animal or animals on the image (Mammals, Birds, Fish, Amphibians, Reptiles, Insects) and the Breed/Species. Please, respond only with 2 lines, one for type and one for species/breed. DO NOT include any other symbols!' },
                        { type: 'image_url', image_url: { url: imageUrl } }
                    ]
                }
            ],
            "model": "llama-3.2-90b-vision-preview",
            "temperature": 1,
            "max_completion_tokens": 1024,
            "top_p": 1,
            "stream": false,
            "stop": null
        });


        return {
            response: chatCompletion.choices[0].message.content
        };
    }
    catch (e) {
        console.log(e);
        return {error: true};
    }
}

// module.exports = recogniseAnimal;


recogniseAnimal("https://uottawa7.s3.us-east-1.amazonaws.com/173722380030105d7073bc97348fb");

