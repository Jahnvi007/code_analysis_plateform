
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


---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **MongoDB** 6.0+ ([Download](https://www.mongodb.com/try/download/community))
- **Ollama** CLI ([Download](https://ollama.ai/download))
- **Python** 3.8+

### Installation

#### 1. Clone Repository
```bash
git clone https://github.com/Jahnvi007/code_analysis_plateform.git
cd code_analysis_plateform/backend
2. Install Dependencies
bash
npm install
3. Configure Environment
Create .env file in backend/ folder:

env
PORT=5000
MONGO_URI=mongodb://localhost:27017/code_platform
JWT_SECRET=your_super_secret_key_change_in_production
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5-coder:1.5b
OLLAMA_TIMEOUT_MS=60000
4. Start MongoDB
bash
# Windows
mongod

# Linux/macOS
sudo systemctl start mongod
5. Start Ollama & Download Model
bash
# Terminal 1: Start Ollama
ollama serve

# Terminal 2: Download model (986 MB)
ollama pull qwen2.5-coder:1.5b
6. Start Backend
bash
npm start
Success Output:

Backend running on port 5000
✅ Ollama health check passed (10ms)
MongoDB connected successfully

7. Test API

curl http://localhost:5000/ping
# Response: "Server is alive"

📡 API Endpoints
Authentication
POST   /api/auth/signup          # Register new user
POST   /api/auth/login           # Login and get JWT token


Problems
GET    /api/problems             # List all problems
GET    /api/problems/:id         # Get problem details
POST   /api/problems/     # Create problem (Admin only)


Submissions
POST   /api/submissions/submit                 # Submit code
GET    /api/submissions/my-submissions         # Get user's submissions
GET    /api/submissions/:id                    # Get submission details
POST   /api/submissions/:id/explain            # Get AI explanation


Comparisons

POST   /api/comparison/compare/:id             # Compare with top solution
GET    /api/comparison/top/:problemId          # Get top solutions
GET    /api/comparison/my-comparisons          # Get comparison history

Stats & Leaderboard


GET    /api/stats/me             # Get user statistics
GET    /api/leaderboard          # Get global leaderboard

Health
GET    /api/health/ollama        # Check AI service health


🧪 Testing Results
Date: February 12, 2026
Total Tests: 22
Passed: 22 ✅
Success Rate: 100%

Performance Metrics
Ollama Response Time: 0.8s (warm), 3.5s (cold start)
Code Execution: 50-2000ms (depends on complexity)
AI Analysis: Correctly identifies O(n) vs O(n²)
Real Test Results
Hash Map Solution (Optimized):

Execution: 128ms
Complexity: O(n) ✅
Nested Loop Solution:

Execution: 2267ms (17.7x slower)
Complexity: O(n²) ✅

⚠️ Known Issues
1. Memory Tracking Shows 0 KB
Severity: Low (display only)
Platform: Windows
Status: Fix available

2. Ollama Cold Start
Issue: First request takes 30s (model loading)
Workaround: Run node backend/scripts/keep-ollama-warm.js

3. Single Language
Current: Python only
Planned: JavaScript, Java, C++ (future)




