// // import { VoyageAIClient } from "voyageai";
// // import "dotenv/config";

// // const vo = new VoyageAIClient({ apiKey: process.env.VOYAGE_API_KEY });

// // const result = await vo.embed({
// //     input: ["your sentence here"],
// //     model: "voyage-4-lite"
// // });

// // // vector lives at:
// // result.data[0].embedding
// // Now write w-1/embeddings.js:

// // Init the client
// // Array of 5 sentences — mix similar and unrelated
// // Loop through each, call vo.embed() for each sentence
// // Log the sentence + first 5 numbers of its vector like:

// // "I love football"     → [0.023, -0.041, 0.019, ...]
// // "Soccer is my thing"  → [0.021, -0.039, 0.018, ...]  ← should look similar
// // "Stock market crashed" → [-0.067, 0.092, -0.031, ...] ← should look different


const { VoyageAIClient } = require("voyageai");
require("dotenv/config");

const array = ["I love playing football", "Soccor is my favourite sport", "The stock market crashed today", "I enjoy watching cricket", "Inflation is rising globally"];

const voClient = new VoyageAIClient({ apiKey: process.env.VOYAGE_API_KEY })

const result = [];

const getData = async (arr) => {
    for (let i = 0; i < arr.length; i++) {
        const response = await voClient.embed({
            input: arr[i],
            model: "voyage-4-lite",
        })
        if (i === 0) {
            console.log(response, 'response')
        }
        result.push({ message: arr[i], vector: response.data[0].embedding })
    }
}

await getData(array);

for (let item of result) {
    console.log(item?.message, "->", item?.vector.slice(0, 5));
}



// Output:-
// PS C: \Users\FAMILY\Desktop\llm - ml - v1 > node w - 1 / embeddings.js
// {
//     object: 'list',
//     data: [{ object: 'embedding', embedding: [Array], index: 0, text: null }],
//     model: 'voyage-4-lite',
//     usage: { totalTokens: 4 }
// } response
// I love playing football -> [-0.003162834, 0.012830364, -0.034134734, 0.017425425, -0.023512388]
// Soccer is my favourite sport -> [0.024580592, -0.012118404, -0.057412013, 0.026815191, -0.044004414]
// The stock market crashed today -> [-0.014795802, -0.035171732, -0.027393369, 0.042950097, -0.031113455]
// I enjoy watching cricket -> [0.037320469, -0.031853136, -0.056812685, -0.039935276, -0.032328557]
// Inflation is rising globally -> [-0.013866206, -0.087819301, 0.012355144, 0.019643791, -0.027554639]
// PS C: \Users\FAMILY\Desktop\llm - ml - v1 >

