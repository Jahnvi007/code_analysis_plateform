# API Documentation

## Base URL
http://localhost:5000

## Authentication
Most endpoints require JWT token:

---

##  Authentication Endpoints

### Register User
```http
Content-Type: application/json in header
POST /api/auth/signup
Request Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
} 
Response (201):
{
  "message": "User registered successfully",
  "userId": "65a1b2c3d4e5f6789..."
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json
Request:
{
  "email": "john@example.com",
  "password": "securePassword123"
}
Response (200):
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "65a1b2c3d4e5f6789..."
}
```

---

## Problem Endpoints

### List All Problems
```http
GET /api/problems
Response (200):
[
  {
    "_id": "698d6369966f1d614c6ee04c",
    "title": "Two Sum",
    "difficulty": "easy",
    "createdAt": "2026-02-12T05:21:45.255Z"
  }
]
```

### Get Problem Details
```http
GET /api/problems/:id
Authorization: Bearer <token>
Response (200):
{
  "_id": "698d6369966f1d614c6ee04c",
  "title": "Two Sum",
  "description": "Given an array of integers...",
  "difficulty": "easy",
  "testCases": [
    {
      "input": "4 2 7 11 15 9",
      "output": "0 1",
      "isHidden": false
    }
  ]
}
```

### Create Problem (Admin)
```http
POST /api/problems/create
Authorization: Bearer <token>
Content-Type: application/json
Request:
{
  "title": "Two Sum",
  "description": "Given an array...",
  "difficulty": "easy",
  "constraints": "2 <= n <= 10^4",
  "testCases": [
    {
      "input": "4 2 7 11 15 9",
      "output": "0 1",
      "isHidden": false,
      "size": "small"
    }
  ]
}
```

---

##  Submission Endpoints

### Submit Code
```http
POST /api/submissions/submit
Authorization: Bearer <token>
Content-Type: application/json
Request:
{
  "problemId": "698d88e8575ac1c9ec5876f5",
  "code": "data = list(map(int, input().split()))\n...",
  "language": "python"
}
Response (200):
{
  "verdict": "Accepted",
  "submission": {
    "_id": "698d8a1f575ac1c9ec58770b",
    "status": "Accepted",
    "score": 80,
    "results": [...],
    "performanceAnalysis": {
      "timeComplexity": "O(n)",
      "explanation": "..."
    }
  }
}
```

#### Possible Verdicts:
- Accepted — All tests passed
- Wrong Answer — Output mismatch
- Time Limit Exceeded — Too slow
- Runtime Error — Code crashed
- Rejected — Forbidden syntax

### Get My Submissions
```http
GET /api/submissions/my-submissions
Authorization: Bearer <token>
```

### Get AI Explanation
```http
POST /api/submissions/:id/explain
Authorization: Bearer <token>
Response (200):
{
  "success": true,
  "explanation": "Your solution uses O(n) time complexity..."
}
```

---

##  Comparison Endpoints

### Compare with Top Solution
```http
POST /api/comparison/compare/:submissionId
Authorization: Bearer <token>
Response (200):
{
  "message": "Comparison generated",
  "comparison": {
    "aiAnalysis": "The top solution uses O(n) while yours uses O(n²)...",
    "performanceComparison": {
      "scoreGap": 20
    }
  }
}
```

### Get Top Solutions
```http
GET /api/comparison/top/:problemId
Authorization: Bearer <token>
```

---

##  Stats Endpoints

### Get My Stats
```http
GET /api/stats/me
Authorization: Bearer <token>
Response (200):
{
  "totalSubmissions": 8,
  "acceptedSubmissions": 5,
  "solvedProblems": 2,
  "avgScore": 48
}
```

### Get Leaderboard
```http
GET /api/leaderboard
Response (200):
[
  {
    "rank": 1,
    "name": "Janu",
    "totalScore": 277,
    "solvedProblems": 3
  }
]
```

---

##  Health Endpoint

### Check Ollama Health
```http
GET /api/health/ollama
Response (200):
{
  "status": "healthy",
  "model": "qwen2.5-coder:1.5b",
  "available": true,
  "responseTime": 10
}
```

---

##  Error Responses

### 400 Bad Request
```json
{ "message": "Missing required fields" }
```

### 401 Unauthorized
```json
{ "message": "Invalid or expired token" }
```

### 403 Forbidden
```json
{ "message": "Access denied. Admin only." }
```

### 404 Not Found
```json
{ "message": "Resource not found" }
```
