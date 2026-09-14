# 🚀 HiCenter — Senior High School Learning & Planning Ecosystem

HiCenter is a student-first academic center and planning platform designed exclusively for Grade 11 and Grade 12 high school students.

It integrates academic learning (**HiSchool**), goal-oriented focus and time management (**HiTime**), and AI-driven study assistance into a unified, secure system.

---

## 🏛️ System Architecture

HiCenter is built using a modern **Three-Repository Architecture**:

```
 ┌─────────────────────────────────────────────────────────┐
 │               hicenter (Next.js 15 Frontend)            │
 └────────────────────────────┬────────────────────────────┘
                              │
                              │  REST / HttpOnly Cookie JWT
                              ▼
 ┌─────────────────────────────────────────────────────────┐
 │            scala-backend (Scala 3 + Play Framework)     │
 │            [Primary System of Record & Auth]            │
 └────────────────────────────┬────────────────────────────┘
                              │
                              │  Internal S2S HTTP + X-Internal-Service-Key
                              ▼
 ┌─────────────────────────────────────────────────────────┐
 │             hicenter-ai (Python 3.11 + FastAPI)         │
 │             [RAG, NLP, ML & AI Study Assistant]         │
 └────────────────────────────┬────────────────────────────┘
                              │
                              ▼
               ┌─────────────────────────────┐
               │   PostgreSQL + pgvector     │
               └─────────────────────────────┘
```

### Core Architecture Principles:
1. **Frontend Isolation**: The frontend (`hicenter`) communicates ONLY with `scala-backend`. It **never** calls `hicenter-ai` directly.
2. **Scala System of Record**: `scala-backend` manages all primary entity state, user authentication, grade access control, and database persistence.
3. **AI Intelligence Engine**: `hicenter-ai` acts as an advisory microservice delivering RAG vector search, NLP summarization/quiz generation, and ML task breakdown.
4. **Service-to-Service Security**: Requests between Scala and FastAPI are authenticated via `X-Internal-Service-Key`.

---

## 📦 Repositories

| Repository | Tech Stack | Role / Responsibilities | Repository Link |
| :--- | :--- | :--- | :--- |
| **`hicenter`** | Next.js 15, TypeScript, Tailwind CSS | Web application UI & reactive state management | [GitHub](https://github.com/YosefAbire/hicenter) |
| **`scala-backend`** | Scala 3.3, Play Framework 3, PostgreSQL | Primary API gateway, JWT auth, database persistence & AI proxy | [GitHub](https://github.com/YosefAbire/scala-backend) |
| **`hicenter-ai`** | Python 3.11, FastAPI, pgvector, NumPy | Internal AI service for RAG, NLP, ML task breakdown & tutoring | [GitHub](https://github.com/YosefAbire/hicenter-ai) |

---

## 📘 Modules Summary

### 📘 HiSchool — Learning & Academic Archive
- Grade 11 & Grade 12 verified subject notes & notes sharing.
- Interactive chapter quizzes & study circles.
- Graduate pathway advice & guidance from verified alumni.
- AI-powered note summarization, key takeaway extraction, and self-quiz generator.

### ⏱️ HiTime — Planning, Focus & Execution
- Priority task management (Now / Next / Later).
- ML-driven automatic study goal breakdown into subtasks with duration estimates.
- Pomodoro and deep focus timers with routine trackers.

---

## ⚡ Quickstart & Deployment

### Option A: Full Multi-Service Docker Compose (Recommended)

Run all three services and PostgreSQL with `pgvector`:

```bash
docker-compose up --build
```

- **Frontend**: `http://localhost:3000`
- **Scala Backend**: `http://localhost:9000`
- **FastAPI AI Service**: `http://localhost:8001`
- **PostgreSQL**: `localhost:5433`

---

### Option B: Local Microservices Setup

#### 1. Start Database
```bash
docker-compose up -d db
```

#### 2. Start `hicenter-ai` (FastAPI)
```bash
cd hicenter-ai
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

#### 3. Start `scala-backend` (Play Framework)
```bash
cd scala-backend
sbt run
```

#### 4. Start `hicenter` (Next.js Frontend)
```bash
cd frontend
npm install
npm run dev
```

---

## 📜 License
Internal / Proprietary — All Rights Reserved.
