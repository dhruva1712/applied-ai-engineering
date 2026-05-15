// Build w-2/quiz.js — a simple quiz app in the terminal.
// What it does:

// Has a hardcoded array of 3 questions with answers:

// jsconst questions = [
//     { question: "What does RAG stand for?", answer: "retrieval augmented generation" },
//     { question: "What is a context window?", answer: "maximum tokens the model can process" },
//     { question: "What role do you use for the model's reply in the messages array?", answer: "assistant" }
// ];

// Loops through each question one by one
// Shows the question, waits for user input
// Compares the answer — case insensitive, partial match is fine using .includes()
// Logs "✅ Correct!" or "❌ Wrong! The answer was: X"
// At the end logs the score: "You scored 2/3"
const Anthropic = require("@anthropic-ai/sdk");
const readline = require("readline");
require("dotenv/config");

const questions = [
  {
    question: "What does RAG stand for?",
    answer: "retrieval augmented generation",
  },
  {
    question: "What is a context window?",
    answer: "maximum tokens the model can process",
  },
  {
    question:
      "What role do you use for the model's reply in the messages array?",
    answer: "assistant",
  },
];

const client = new Anthropic();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = (prompt) => {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
};

const main = async () => {
  let score = 0;
  for (let i = 0; i < questions.length; i++) {
    const userInput = await askQuestion(
      `Q${i + 1}: ${questions[i].question}\nYour answer: `,
    );
    if (questions[i].answer.includes(userInput.toLowerCase().trim())) {
      score++;
      console.log("✅ Correct!");
    } else {
      console.log("❌ Wrong! The answer was:", questions[i].answer);
    }
  }
  console.log("You scored:", score);
  rl.close();
};

main();
