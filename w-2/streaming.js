// Create the Anthropic client
// Ask it something that produces a longish response — "Explain how the internet works in simple terms"
// Stream the response token by token to the terminal using process.stdout.write
// After streaming completes, log:

// --- Stream complete ---
//     Total output tokens: 143
// const stream = client.messages.stream({...});

// stream.on("text", (text) => {
//     process.stdout.write(text); // print without newline, token by token
// });

// await stream.finalMessage(); // wait for completion

const Anthropic = require("@anthropic-ai/sdk");
require("dotenv/config");

const client = new Anthropic();

const main = async () => {
  const stream = await client.messages.stream({
    max_tokens: 500,
    model: "claude-haiku-4-5-20251001",
    system:
      "You are a helping AI agent for a student who can write good essays. Keep answers under 3 sentences",
    messages: [
      {
        role: "user",
        content: "Explain how the internet works in simple terms",
      },
    ],
  });
  stream.on("text", (text) => {
    process.stdout.write(text);
  });

  const response = await stream.finalMessage();
  console.log("toal output token:", response.usage.output_tokens);
};

main();
