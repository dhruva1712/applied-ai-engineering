// Embed all 5 sentences into vectors in one API call
// Write a cosineSimilarity(a, b) function that takes two vectors and returns a number between -1 and 1
// Use "I love playing football" as your query sentence
// Compare it against all other 4 sentences using cosine similarity
// Log the results sorted from most similar to least similar

// Expected output should look like:
// Comparing against: "I love playing football"

// 0.87 → I enjoy watching cricket
// 0.71 → Soccer is my favourite sport
// 0.34 → Inflation is rising globally
// 0.29 → The stock market crashed today

// import { VoyageAIClient } from "voyageai";
// import "dotenv/config";

// const array = ["I love playing football", "Soccor is my favourite sport", "The stock market crashed today", "I enjoy watching cricket", "Inflation is rising globally"];

// const voClient = new VoyageAIClient({ apiKey: process.env.VOYAGE_API_KEY });

// const result = [];

// const getData = async (arr) => {
//     for (let i = 0; i < arr.length; i++) {
//         const response = await voClient.embed({
//             input: arr[i],
//             model: "voyage-4-lite",
//         })
//         result.push({ message: arr[i], vector: response.data[0].embedding })
//     }
// }

// await getData(array);

// const cosineSimilarity = (a, b) => {
//     const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
//     const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
//     const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
//     return dot / (magA * magB);
// };

// const vectorSimilarity = [];

// const queryVector = result[0].vector;

// const getVectorSimilar = (arr) => {
//     for (let i = 1; i < arr.length; i++) {
//         const score = cosineSimilarity(queryVector, arr[i].vector);
//         vectorSimilarity.push({ message: arr[i].message, score })
//     }
// }

// getVectorSimilar(result);
// vectorSimilarity
//     .sort((a, b) => b.score - a.score)
//     .forEach(item => console.log(item.score.toFixed(4), "→", item.message));

const { VoyageAIClient } = require("voyageai");
require("dotenv/config");

const array = ["I love playing football", "Soccer is my favourite sport", "The stock market crashed today", "I enjoy watching cricket", "Inflation is rising globally"];

const voClient = new VoyageAIClient({ apiKey: process.env.VOYAGE_API_KEY });

const cosineSimilarity = (a, b) => {
    const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dot / (magA * magB);
};

const main = async () => {
    const result = [];

    for (let i = 0; i < array.length; i++) {
        const response = await voClient.embed({
            input: array[i],
            model: "voyage-4-lite",
        });
        result.push({ message: array[i], vector: response.data[0].embedding });
    }

    const queryVector = result[0].vector;
    const vectorSimilarity = [];

    for (let i = 1; i < result.length; i++) {
        const score = cosineSimilarity(queryVector, result[i].vector);
        vectorSimilarity.push({ message: result[i].message, score });
    }

    vectorSimilarity
        .sort((a, b) => b.score - a.score)
        .forEach(item => console.log(item.score.toFixed(4), "→", item.message));
};

main();