const { VoyageAIClient } = require("voyageai");
const Anthropic = require("@anthropic-ai/sdk");
require("dotenv/config");

const knowledge = [
  "Our refund policy allows returns within 30 days of purchase, no questions asked.",
  "We ship to over 50 countries worldwide including India, USA, UK, and Australia.",
  "Customer support is available Monday to Friday, 9am to 6pm IST.",
  "Premium members get free shipping on all orders regardless of order value.",
  "We accept Visa, Mastercard, PayPal, and UPI as payment methods.",
  "Orders above ₹999 qualify for free delivery within India.",
  "Product exchanges are allowed within 15 days if the item is unused and in original packaging.",
  "You can track your order in real time using the tracking link sent to your email after dispatch.",
];

const voClient = new VoyageAIClient({ apiKey: process.env.VOYAGE_API_KEY });
const anthropicClient = new Anthropic();

const cosineSimilarity = (a, b) => {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (magA * magB);
};

const main = async () => {
  // Step 1 — Index
  const indexResponse = await voClient.embed({
    input: knowledge,
    model: "voyage-4-lite",
  });
  const vectorEmbedded = knowledge.map((text, i) => ({
    text,
    vector: indexResponse.data[i].embedding,
  }));

  // Step 2 — Query
  const userQuery = "What payment methods do you accept?";
  const queryResponse = await voClient.embed({
    input: userQuery,
    model: "voyage-4-lite",
  });
  const embeddedQuery = queryResponse.data[0].embedding;

  // Step 3 — Retrieve
  const scored = vectorEmbedded.map((chunk) => ({
    text: chunk.text,
    score: cosineSimilarity(embeddedQuery, chunk.vector),
  }));
  const top2 = scored.sort((a, b) => b.score - a.score).slice(0, 2);

  // Step 4 — Generate
  const prompt = `You are a customer support assistant. Answer the user's question using ONLY the context provided. If the answer is not in the context, say "I don't have that information."

Context:
- ${top2[0].text}
- ${top2[1].text}

Question: ${userQuery}`;

  const claudeResponse = await anthropicClient.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 500,
    system: prompt,
    messages: [{ role: "user", content: userQuery }],
  });

  // Step 5 — Output
  console.log("Query:", userQuery);
  console.log("\nRetrieved chunks:");
  top2.forEach((chunk) => console.log(" -", chunk.text));
  console.log("\nAnswer:", claudeResponse.content[0].text);
};

main();
