// Here's what the file should do:

// Make any API call — topic doesn't matter
// After the response, log a cost breakdown like this:

// Input tokens: 33
// Output tokens: 94
// Total tokens: 127

// Estimated cost: $0.000089
// Haiku pricing: input = $0.80 per 1M tokens, output = $2.40 per 1M tokens.
// The usage data is already in the response object — you saw it earlier.Write the file yourself.

import Anthropic from "@anthropic-ai/sdk";
import "dotenv/config";

const client = new Anthropic();

const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 100,
    system: "You are a wildlife enthusiast, give the response to the uery briefly.",
    messages: [{
        role: "user",
        content: "How many species of birds are there?"
    }]
})
const inputTokens = response.usage.input_tokens;
const outputTokens = response.usage.output_tokens;

const inputCost = (inputTokens / 1_000_000) * 0.80;
const outputCost = (outputTokens / 1_000_000) * 2.40;

console.log({
    "Input Tokens": inputTokens,
    "Output Tokens": outputTokens,
    "Total Tokens": inputTokens + outputTokens,
    "Estimated Cost": `$${(inputCost + outputCost).toFixed(8)}`
});

//   usage: {
//     input_tokens: 33,
//     cache_creation_input_tokens: 0,
//     cache_read_input_tokens: 0,
//     cache_creation: { ephemeral_5m_input_tokens: 0, ephemeral_1h_input_tokens: 0 },
//     output_tokens: 94,
//     service_tier: 'standard',
//     inference_geo: 'not_available'
//   }