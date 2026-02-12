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

# 🚀 Code Analysis & Comparison Platform

An **AI-powered competitive programming platform** that analyzes code submissions, provides intelligent optimization suggestions, and compares solutions using local LLM (Ollama + Qwen2.5-Coder).

![Status](https://img.shields.io/badge/Backend-Complete-success)
![Tests](https://img.shields.io/badge/Tests-22%2F22%20Passing-brightgreen)
![AI](https://img.shields.io/badge/AI-Ollama%20Qwen2.5--Coder-blue)

---

## 📋 Table of Contents
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [API Endpoints](#-api-endpoints)
- [Testing Results](#-testing-results)
- [Known Issues](#-known-issues)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)

---

## ✨ Features

### ✅ Implemented (Backend Complete)

#### 🔐 **Authentication & Authorization**
- JWT-based authentication with 24-hour token expiry
- Role-based access control (Admin/User)
- Secure password hashing (bcrypt, 10 rounds)

#### 📝 **Problem Management**
- Create, read, and list coding problems
- Support for multiple test cases (visible/hidden)
- Difficulty levels (Easy/Medium/Hard)
- Test case size classification

#### 🏃 **Secure Code Execution**
- Python sandbox with restricted imports
- Time limit: 5 seconds per test case
- Memory limit: 256 MB
- Import blocking for security (`import os`, `import sys`, etc.)

#### 🤖 **AI-Powered Analysis**
- **Performance Analysis**: Detects time/space complexity (O(n), O(n²), etc.)
- **AI Explanation**: Explains why code passed/failed with detailed feedback
- **Solution Comparison**: Compares your solution with top performers
- **Optimization Suggestions**: Recommends better algorithms

#### 📊 **Leaderboard & Stats**
- Global leaderboard ranked by score
- User statistics (submissions, acceptance rate, avg score)
- Top solutions for each problem

#### 🏥 **Health Monitoring**
- Ollama service health check
- Real-time AI model status
- Response time tracking

---

### ⏳ Pending Features

- **Frontend**: React + Vite UI (not started)
- **Docker**: Containerized deployment (planned)
- **Multi-language**: JavaScript, Java, C++ support (future)
- **Real-time**: WebSocket updates (future)

---

## 🛠 Technology Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18+ | Runtime environment |
| **Express.js** | 4.18+ | Web framework |
| **MongoDB** | 6.0+ | NoSQL database |
| **Mongoose** | 8.0+ | ODM for MongoDB |

### AI/ML
| Technology | Version | Purpose |
|------------|---------|---------|
| **Ollama** | 0.1.26+ | Local LLM server |
| **Qwen2.5-Coder** | 1.5B | Code analysis model (986 MB) |

### Security & Auth
| Technology | Purpose |
|------------|---------|
| **JWT** | Token-based authentication |
| **bcryptjs** | Password hashing |
| **Custom Middleware** | Role-based access control |

### Code Execution
| Technology | Purpose |
|------------|---------|
| **Python 3.8+** | Target language for submissions |
| **Child Process** | Secure sandbox execution |



