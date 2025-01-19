//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
require("dotenv").config();
const groq_key = process.env.groq;
console.log(groq_key);
const Groq = require('groq-sdk');
const groq = new Groq();

const queries = {
    "anyanimals": "You are an AI moderator. You should assess the image you received. You should answer YES, if the image contains an ALIVE, Real World, animal, or animals, excluding humans, AND if all the animals on the picture are of the same breed/Species. In all other cases, respond with NO. Only answer 'YES.' or 'NO.'",
    "legal": "Do you think, that the image i provided is friendly and not abusive? Answer YES if it is friendly, and NO otherwise",
    "animal": "The user took a picture of an animal they spotted. Your goal is to determine Breed/Species of the animal or animals on the image. Please, respond with 1, 2, or 3 words only, and NO punctuation marks",
    "estimate": "I am making a game where users take pictures of animals. I want you to Estimate how rare this animal is in the given area from 1 to 5 inclusive. Please, output ONLY the your estimate, number from 1 to 5. The animal is: ",
    "estimate2": "I am making a game where users take pictures of animals. I want you to Estimate how endangered this animal is from 1 to 5 inclusive, taking the location into account. Please, output ONLY the your estimate, number from 1 to 5. The animal is: "
}

const { default: PQueue } = require('p-queue');

const queue = new PQueue({
    interval: 60000, // Time window in ms (1 second)
    intervalCap: 30  // Number of requests allowed per interval
});

async function prompt(query, image, tokens, bol, bol2) {
    return await queue.add(() => promptIn(query, image, tokens, bol, bol2));
}

async function promptIn(query, image, tokens, bol, bol2) {
    try {
        const content = bol ?  [
            { type: 'text', text: query+image}] : [
            { type: 'text', text: query},
            { type: 'image_url', image_url: { url: image } }
        ];

        console.log(content);

        const chatCompletion = await groq.chat.completions.create({
            "messages": [
                {
                    "role": "user",
                    content: content
                }
            ],
            "model": bol2 ? "llama-3.2-11b-vision-preview" : "llama-3.2-90b-vision-preview",
            "temperature": 0,
            "max_completion_tokens": tokens,
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
    return await prompt(queries.animal, imageUrl, 15);
}

async function moderate(imageUrl) {
    return await prompt(queries.legal, imageUrl, 5);
}

async function isAnimal(imageUrl) {
    return await prompt(queries.anyanimals, imageUrl, 5);
}

async function estimate(text) {
    return await prompt(queries.estimate, text, 2, true, true);
}

async function estimate2(text) {
    return await prompt(queries.estimate2, text, 2, true, true);
}

async function moderateText(text) {
    return (await groq.chat.completions.create({
        messages: [
            {
                "role": "user",
                "content": text
            }
        ],
        model: "llama-guard-3-8b",
    })).choices[0].message.content;
}

module.exports = {
    recogniseAnimal, moderate, isAnimal, estimate, estimate2,moderateText
};

