// Read knowledge.txt using Node's fs module
// Split by paragraph — text.split("\n\n") gives you one chunk per paragraph
// Filter out empty chunks
// Embed all chunks in one Voyage call
// Take a hardcoded user query: "What is Constitutional AI?"
// Embed the query
// Run cosine similarity, pick top 2
// Build a prompt and call Claude
// Stream the answer using what you just learned

// const text = fs.readFileSync("knowledge.txt", "utf8");

const Anthropic = require("@anthropic-ai/sdk");
const { VoyageAIClient } = require("voyageai");
const fs = require("fs");
require("dotenv/config");

const client = new Anthropic();
const voClient = new VoyageAIClient({ apiKey: process.env.VOYAGE_API_KEY });

const userQuery = "What is Constitutional Act?";

const cosineSimilarity = (a, b) => {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (magA * magB);
};

const textArr = fs
  .readFileSync("w-2/knowledge.txt", "utf8")
  .split("\n\n")
  .map((chunk) => chunk.trim())
  .filter(Boolean);

// .split("\n\n") → splits on blank lines
// .map(chunk => chunk.trim()) → trims each chunk
// .filter(Boolean) → removes empty strings ("") after trimming

const main = async () => {
  const embeddedDoc = await voClient.embed({
    input: textArr,
    model: "voyage-4-lite",
  });
  const embeddedData = textArr.map((text, index) => ({
    text,
    vector: embeddedDoc.data[index].embedding,
  }));

  const embeddedUserQuery = await voClient.embed({
    input: userQuery,
    model: "voyage-4-lite",
  });

  const vectorSimilarity = [];

  for (let i = 0; i < embeddedData.length; i++) {
    const score = cosineSimilarity(
      embeddedUserQuery.data[0].embedding,
      embeddedData[i].vector,
    );
    vectorSimilarity.push({ text: embeddedData[i].text, score });
  }
  const top2 = vectorSimilarity.sort((a, b) => b.score - a.score).slice(0, 2);

  const prompt = `You are a customer support assistant. Answer the user's question using ONLY the context provided. If the answer is not in the context, say "I don't have that information."

    Context:
    - ${top2[0].text}
    - ${top2[1].text}`;

  const llmResponse = await client.messages.stream({
    max_tokens: 500,
    model: "claude-haiku-4-5-20251001",
    system: prompt,
    messages: [
      {
        role: "user",
        content: userQuery,
      },
    ],
  });

  llmResponse.on("text", (text) => {
    process.stdout.write(text);
  });

  const finalResponse = await llmResponse.finalMessage();
};
main();
