Here are interview-ready answers for all 10. Save this file as `revision/week-1-interview-answers.md`.

---

**Q1. What is a context window and why does it matter?**

A context window is the maximum amount of text — measured in tokens — that an LLM can process in a single request. It includes everything: the system prompt, the full conversation history, and the model's response. It matters for two reasons. First, any information outside the context window is invisible to the model — it simply doesn't exist for that request. Second, every token in the context window costs money, so a larger context means higher cost per call. This is why in production you manage history carefully — you don't blindly append every message forever.

---

**Q2. Why does an LLM have no memory between conversations?**

LLMs are stateless by design. Every API call is completely independent — the model receives text, processes it, returns text, and forgets everything. It has no database, no storage, no persistent state. The "memory" you see in chat applications is an illusion created by the application layer — your code stores the conversation history and re-sends it with every new request. If you want the model to remember something, you must explicitly include it in the prompt. This is also why context window size matters — the more history you include, the more the model can "remember," but at a higher token cost.

---

**Q3. What are embeddings and what problem do they solve?**

Embeddings are numerical representations of text — specifically, arrays of floating point numbers called vectors. They solve the problem of semantic search. Traditional keyword search matches exact words, which breaks down when intent matters. For example, "I want to buy an Apple product" and "I want to eat an apple" use the same word but mean completely different things. Embeddings capture meaning, not just words — sentences with similar meaning produce vectors that are mathematically close to each other in vector space. This allows you to search by intent rather than by keyword, which is the foundation of RAG systems and semantic search engines.

---

**Q4. Explain RAG in simple terms.**

RAG stands for Retrieval Augmented Generation. The problem it solves is that LLMs don't know about your private data or recent information — they only know what they were trained on. RAG fixes this by making your Node.js code act as a middleman. Before sending a user's question to the LLM, your code searches a knowledge base for the most relevant information, retrieves the top matching chunks, and injects them directly into the prompt as context. The LLM then answers using that context rather than relying on its training data alone. The LLM never touches your database — it only sees the text your code hands it. This makes RAG cheap, fast to update, and highly controllable compared to alternatives like fine-tuning.

---

**Q5. Why do we chunk documents instead of embedding the whole thing?**

If you embed an entire document as a single vector, that vector tries to represent every idea in the document simultaneously. When you search against it, the similarity score is diluted across all those ideas — making retrieval imprecise. Chunking splits the document into smaller, focused pieces where each chunk represents one idea or topic. Each chunk gets its own vector, so similarity search becomes precise. When a user asks about refunds, the refund chunk scores high — not the shipping chunk or the support hours chunk. The tradeoff is chunk size: too small and you lose context, too large and you lose precision. The sweet spot for most applications is 200 to 500 words per chunk, often with slight overlap between chunks to prevent context from being lost at the boundaries.

---

**Q6. Will the model know what the user said earlier in a conversation?**

Yes, as long as the full message history is included in the request and the total token count stays within the model's context window. The model has no memory of its own — it knows earlier messages only because your code passed them as part of the messages array. If the conversation grows long enough to exceed the context window, older messages get silently cut off and the model loses access to them. In production, this is handled by summarizing older messages or implementing a sliding window that keeps only the most recent N turns.

---

**Q7. What happens when a response hits the max_tokens limit?**

The model stops generating immediately at that token count — mid-sentence if necessary. It does not summarize or trim intelligently. You can detect this by checking `stop_reason` in the response object — it returns `"max_tokens"` instead of `"end_turn"`. This is why you always set max_tokens intentionally. Too low and responses get cut off. Too high and you risk runaway costs on unexpectedly long responses. In production, you tune this based on the expected response length for your use case.

---

**Q8. How do you estimate the cost of an LLM API call?**

Cost is calculated separately for input and output tokens. For Claude Haiku, input tokens cost $0.80 per million and output tokens cost $2.40 per million. Output is always more expensive than input because generation is more compute-intensive than reading. For a typical call with 30 input tokens and 100 output tokens the cost is roughly $0.000264 — essentially fractions of a cent. At scale though, this adds up fast. A system handling 100,000 queries per day with 500 tokens average output is spending around $120 per day on output alone. Thinking in per-call cost and daily volume is how you reason about AI product economics in production.

---

**Q9. What happens when a user asks something your knowledge base doesn't cover?**

This depends entirely on how you've designed your prompt. There are three common approaches. The strictest approach instructs the model to answer only from the provided context and say "I don't have that information" otherwise — this prevents hallucination but can frustrate users. The second approach allows the model to use the context as a primary source but apply reasonable inference for closely related questions. The third approach adds a explicit fallback instruction — if similarity scores are all below a threshold, skip the LLM entirely and return a canned response like "Please contact support." In production you combine all three: a similarity threshold check, strict grounding instructions, and a graceful fallback message.

---

**Q10. Why might your RAG system retrieve the wrong chunk?**

There are three main reasons. First, the knowledge base chunk may not exist — if no chunk covers the topic, cosine similarity will still return the closest match it can find, which may be completely irrelevant. Second, the chunk exists but is poorly worded — if your chunk says "we process returns in about a month" instead of "30 day refund policy", the embedding won't align well with queries containing the word "refund" because the semantic distance is larger than you'd expect. Third, a chunk is too broadly worded and bleeds into unrelated queries — in week 1 the refund policy chunk kept appearing for unrelated queries because policy language has broad semantic overlap. The fix is to audit your retrieval regularly, rewrite ambiguous chunks, and consider increasing the number of retrieved chunks while adding a reranking step to filter noise.

---
