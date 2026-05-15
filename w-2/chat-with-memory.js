// Set up readline and the askQuestion helper
// Set up Anthropic client
// Define a system prompt — make it something fun, like a senior developer who mentors junior devs
// Start a messages = [] array
// Run a while(true) loop that:

// Asks for user input
// Exits cleanly if user types "exit"
// Pushes user message to array
// Calls Claude with full messages array — stream the response
// Collects the full streamed text
// Pushes assistant response to messages array
// Loops again

// After exit log: "Chat ended. Total turns: X"

const readline = require("readline");
const Anthropic = require("@anthropic-ai/sdk");
require("dotenv/config");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = (prompt) => {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
};

const client = new Anthropic();
const message = [];

const main = async () => {
  let isEnded = false;
  let chatNumber = 0;
  const messages = [];

  console.log('Chat started. Type "exit" to quit.\n');

  while (true) {
    const userInput = await askQuestion("You:");

    if (userInput.toLowerCase() === "exit") {
      console.log(`\nChat ended. Total turns: ${chatNumber}`);
      rl.close();
      break;
    }

    messages.push({ role: "user", content: userInput });

    const response = await client.messages.stream({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system:
        "You are a senior dev helping a junior developer in concepts of reactjs in 30 words or less.",
      messages: messages,
    });

    chatNumber = chatNumber + 1;

    let fullResponse = "";

    console.log("Assistant:");
    response.on("text", (text) => {
      process.stdout.write(text);
      fullResponse += text;
    });
    await response.finalMessage();
    console.log("\n");

    messages.push({
      role: "assistant",
      content: fullResponse,
    });
  }
};
main();
