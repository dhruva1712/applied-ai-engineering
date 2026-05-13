// Now your turn to write. Next file is w-1/multi-turn-chat.js.
// Here's what it needs to do — you figure out the code:

// Create the Anthropic client (same as before)
// Start a messages array with one user message: "What is a context window in LLMs?"
// Make the first API call, store the reply text
// console.log("Turn 1:", replyText)
// Push the assistant reply into the messages array
// Push a new user message: "Give me a real world analogy for it"
// Make a second API call with the updated messages array
// console.log("Turn 2:", secondReplyText)

import Anthropic from "@anthropic-ai/sdk";
import "dotenv/config";

const client = new Anthropic();
const messages = [{
    role: "user",
    content: "What is a context window in LLMs?"
},];

const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    system: "You are a technical assistant for coders. Reply breifly and to the point to the queries.",
    messages: messages,
});

messages.push({
    role: "assistant",
    content: response.content[0].text
});

messages.push({
    role: "user",
    content: "Give me a real world analogy for it"
});

const newres = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    system: "You are a technical assistant for coders. Reply breifly and to the point to the queries.",
    messages: messages
})

console.log(newres.content[0].text, "text")
console.log(messages, 'messages');

// NOTE:- I didnt push the new response to messages
// OUTPUT:-
// PS C: \Users\FAMILY\Desktop\llm - ml - v1 > node w - 1 / multi - turn - chat.js
// # Context Window Analogy

// Think of it like a ** whiteboard in a meeting room **.

// - ** The whiteboard ** = context window
//     - ** What you write on it ** = your prompt + the model's response
//         - ** Once it fills up ** = you have to erase something to write more
//             - ** What gets erased ** = earlier conversation is forgotten

//                 ** Example **: If your whiteboard holds 8, 000 words:
// - You write a 5, 000 - word document
//     - The model writes a 2, 000 - word response
//         - The whiteboard is full—any earlier notes are gone
//             - Start a new task ? You erase and start fresh

// This is why long documents need to be broken into chunks, and why the model can't remember details from 50 messages back in a long chat—they've been "erased" from the working space.text
// [
//     { role: 'user', content: 'What is a context window in LLMs?' },
//     {
//         role: 'assistant',
//         content: '# Context Window in LLMs\n' +
//             '\n' +
//             'A **context window** is the maximum length of text (measured in tokens) that an LLM can process at once, including both input and output.\n' +
//             '\n' +
//             '## Key Points:\n' +
//             '\n' +
//             "- **Input + Output**: The window size limits the combined length of your prompt and the model's response\n" +
//             '- **Token-based**: Measured in tokens (roughly 4 characters per token)\n' +
//             '- **Memory constraint**: Determines how much previous conversation or document the model can "see"\n' +
//             '- **Examples**:\n' +
//             '  - GPT-4: 8K, 32K, 128K tokens\n' +
//             '  - Claude 3: 200K tokens\n' +
//             '  - Llama 2: 4K tokens\n' +
//             '\n' +
//             '## Practical Impact:\n' +
//             '\n' +
//             '- Text beyond the window is forgotten/ignored\n' +
//             '- Longer documents require chunking or summarization\n' +
//             '- Affects cost (some models charge per token)\n' +
//             '- Influences quality on long-context tasks\n' +
//             '\n' +
//             "The context window is essentially the model's working memory for a single conversation or task."
//     },
//     { role: 'user', content: 'Give me a real world analogy for it' }
// ] messages
// PS C: \Users\FAMILY\Desktop\llm - ml - v1 > 