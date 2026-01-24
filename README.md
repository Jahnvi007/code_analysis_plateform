Code Analysis Platform 

A backend-first coding platform designed to help freshers and learners
understand why some solutions perform better than others in real coding platforms
like LeetCode and HackerRank.

This platform preserves real rankings and performance metrics
while adding an AI-powered learning layer on top.



 Core Idea

- Users submit solutions to coding problems
- Submissions are evaluated using real performance metrics
  (time, space, ranking — same as standard coding platforms)
- Optimized solutions **do exist and remain visible**
- The platform automatically:
  - Identifies **top ~10% optimized solutions**
  - Compares them with the learner’s solution
  - Highlights key differences
  - Explains *why* one approach performs better



 What Makes This Platform Different

Unlike traditional platforms where learners must manually compare code:

- Side-by-side comparison is **automatic**
- Important lines and logic are **highlighted**
- Explanations are provided in:
  - simple natural language
  - technical terms only where necessary
- Focus is on:
  - time complexity
  - space complexity
  - data structures
  - algorithmic thinking
- Learners can choose whether to view comparisons or not


 Tech Stack (Current)

- Backend: Node.js, Express
- Database: MongoDB
- AI Engine: Ollama (local LLM)
- API Testing: Thunder Client



 Frontend

- A learner-focused UI is a mandatory part of this platform
- Frontend development has not started yet
- Current focus is stabilizing backend and AI logic



 Environment Setup

See `.env.example` for required environment variables.

---

 Current Status

- Backend under active development
- Ollama integration in progress
- Core analysis & explanation pipeline being designed

---

Future Scope

- Dockerized deployment
- Multi-language support (C, C++, Python, Java, etc.)
- Scalable execution & analysis engine
- Enhanced visualization for code comparison
