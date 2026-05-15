// Your actual JS functions — fake implementations are fine:
// jsconst calculate = (expression) => {
//     return `${expression} = ${eval(expression)}`;
// };

// const getWeather = (city) => {
//     const data = {
//         "Delhi": "32°C, sunny",
//         "Mumbai": "28°C, humid",
//         "London": "15°C, cloudy"
//     };
//     return data[city] || "Weather data unavailable";
// };
// The file should:

// Define both tools and both functions
// Take a hardcoded user message: "What is 25 multiplied by 48, and what's the weather in Delhi?"
// Send to Claude with tools
// Check stop_reason — if "tool_use", find which tool Claude wants, run it, send result back
// // Log Claude's final answer

const tools = [
  {
    name: "get_weather",
    description: "Get current weather for a city",
    input_schema: {
      type: "object",
      properties: {
        city: { type: "string", description: "City name" },
      },
      required: ["city"],
    },
  },
  {
    name: "calculate",
    description: "Perform a mathematical calculation",
    input_schema: {
      type: "object",
      properties: {
        expression: {
          type: "string",
          description: "Math expression like '25 * 4 + 10'",
        },
      },
      required: ["expression"],
    },
  },
];

const calculate = (expression) => {
  return `${expression} = ${eval(expression)}`;
};

const get_weather = (city) => {
  const data = {
    Delhi: "32°C, sunny",
    Mumbai: "28°C, humid",
    London: "15°C, cloudy",
  };
  return data[city] || "Weather data unavailable";
};

const Anthropic = require("@anthropic-ai/sdk");
require("dotenv/config");

const client = new Anthropic();
const user_query =
  "What is 25 multiplied by 48 and what is the weather in delhi?";

const main = async () => {
  const response = await client.messages.create({
    max_tokens: 1024,
    model: "claude-haiku-4-5-20251001",
    tools: tools,
    system: "You are a generic helper for normal day to day user queires",
    messages: [
      {
        role: "user",
        content: user_query,
      },
    ],
  });
  // dhruvchauhan@Dhruvs-MacBook-Air llm-ml-v1 % node w-2/tool-calling.js
  // {
  //   model: 'claude-haiku-4-5-20251001',
  //   id: 'msg_01Eobw9Pusv6f5rmRfPRwkUJ',
  //   type: 'message',
  //   role: 'assistant',
  //   content: [
  //     {
  //       type: 'tool_use',
  //       id: 'toolu_01VR2a6X8Mxab8jK7mW1eysS',
  //       name: 'calculate',
  //       input: [Object],
  //       caller: [Object]
  //     },
  //     {
  //       type: 'tool_use',
  //       id: 'toolu_018wfnNwMpxNJitsYHvCnHbp',
  //       name: 'get_weather',
  //       input: [Object],
  //       caller: [Object]
  //     }
  //   ],
  //   stop_reason: 'tool_use',
  //   stop_sequence: null,
  //   stop_details: null,
  //   usage: {
  //     input_tokens: 667,
  //     cache_creation_input_tokens: 0,
  //     cache_read_input_tokens: 0,
  //     cache_creation: { ephemeral_5m_input_tokens: 0, ephemeral_1h_input_tokens: 0 },
  //     output_tokens: 92,
  //     service_tier: 'standard',
  //     inference_geo: 'not_available'
  //   }
  // } response

  // Check if (response.stop_reason === "tool_use")
  // Find all tool_use blocks in response.content
  // Loop through them, check block.name, run the right function
  // Collect all tool results
  // Make the second API call with the full message history + tool results
  // Log the final answer

  if (response.stop_reason === "tool_use") {
    const toolUseBlocks = response.content.filter(
      (block) => block.type === "tool_use",
    );

    const toolResults = [];

    for (const toolUse of toolUseBlocks) {
      let result;

      if (toolUse.name === "calculate") {
        result = calculate(toolUse.input.expression);
      } else if (toolUse.name === "get_weather") {
        result = get_weather(toolUse.input.city);
      }

      toolResults.push({
        type: "tool_result",
        tool_use_id: toolUse.id,
        content: result,
      });
    }

    // now make second API call
    const finalResponse = await client.messages.create({
      max_tokens: 1024,
      model: "claude-haiku-4-5-20251001",
      tools: tools,
      messages: [
        { role: "user", content: user_query },
        { role: "assistant", content: response.content },
        { role: "user", content: toolResults },
      ],
    });

    console.log("\nFinal Answer:", finalResponse.content[0].text);
  }
};

main();
