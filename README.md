
# 🚀 Code Analysis Platform

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



