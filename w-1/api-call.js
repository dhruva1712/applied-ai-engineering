import Anthropic from "@anthropic-ai/sdk";
import "dotenv/config";

const client = new Anthropic();

const response = await client.messages.create({
  model: "claude-haiku-4-5-20251001",
  max_tokens: 1024,
  system: "You are a concise technical assistant. Keep answers under 3 sentences.",
  messages: [
    {
      role: "user",
      content: "What is a context window in LLMs?",
    },
  ],
});

console.log(response.content[0].text, "text");
console.log(response, "response")

// model — which AI brain to use. We use Haiku because it's fast and cheap.
// max_tokens — hard cap on response length. Always set this. Without it you could get a massive response and burn
//  credits.
// messages — the full conversation history as an array. Right now it's just one user message.

// system
// Not inside messages — it's a top-level field. This is your instruction to the model about how to behave. Think of it as the personality/rules layer.
// response.content[0].text
// The response comes back as an array of content blocks. For a standard text reply, it's always index 0 and type text. That's your answer.


//Output:-

// A context window is the maximum length of text (measured in tokens) that an LLM can process as input and consider when generating output. For example, GPT-4 has a context window of 8K or 128K tokens depending on the version, meaning it can "see" and reference that much previous conversation or document text. A larger context window allows the model to handle longer documents and maintain coherence over more extended interactions. text

// {
//   model: 'claude-haiku-4-5-20251001',
//   id: 'msg_01J9EiDtxHSQkVrvYQC22NYy',
//   type: 'message',
//   role: 'assistant',
//   content: [
//     {
//       type: 'text',
//       text: 'A context window is the maximum length of text (measured in tokens) that an LLM can process as input and consider when generating output. For example, GPT-4 has a context window of 8K or 128K tokens depending on the version, meaning it can "see" and reference that much previous conversation or document text. A larger context window allows the model to handle longer documents and maintain coherence over more extended interactions.'
//     }
//   ],
//   stop_reason: 'end_turn',
//   stop_sequence: null,
//   stop_details: null,
//   usage: {
//     input_tokens: 33,
//     cache_creation_input_tokens: 0,
//     cache_read_input_tokens: 0,
//     cache_creation: { ephemeral_5m_input_tokens: 0, ephemeral_1h_input_tokens: 0 },
//     output_tokens: 94,
//     service_tier: 'standard',
//     inference_geo: 'not_available'
//   }
// } response
