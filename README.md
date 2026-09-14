# 🚀 HiCenter

HiCenter is a student-first learning and planning platform built exclusively for Grade 11 and Grade 12 students.

It is designed as a daily academic center where students learn, manage their time, and understand their future — supported by teachers, schools, and graduates, without losing student ownership.

HiCenter is not a traditional LMS.  
It is a focused system built around how senior students actually study, plan, and prepare for life after high school.

---

## 🎯 The Problem HiCenter Solves

Senior high school students consistently face three challenges:

1. Learning materials are scattered and unreliable  
2. Students struggle with planning, focus, and consistency  
3. Career and university awareness comes too late — or not at all  

HiCenter brings learning, planning, and future awareness into one coherent system.

---

## 🧭 Core Philosophy

- Students are the drivers
- Teachers guide and validate
- Graduates share real-world perspective
- Schools integrate and support
- Families observe and encourage

HiCenter minimizes control and maximizes clarity.

---

## 🧩 System Overview

HiCenter is the parent platform composed of two tightly integrated core modules:

---

### 📘 HiSchool — Learning, Community & Future Awareness

HiSchool handles what students learn, how they collaborate, and how they understand what comes next.

Core Features
- Subject-based notes (Grade 11 & 12 only)
- Chapter-based quizzes and mock exams
- Student note sharing and study groups
- Teacher-verified academic content

Graduate Pathways (Integrated Feature)
- Verified graduates share:
  - University and major
  - Why they chose their field
  - Challenges they faced
  - What Grade 11–12 students should focus on
- Students explore pathways by:
  - Subject strengths
  - Career interests
  - University options

> This feature builds awareness, not pressure.  
> Students see possibilities early, while still focusing on school.

---

### ⏱️ HiTime — Planning, Focus & Execution

HiTime manages how students use their time and turn intention into action.

Core Features
- Priority-based task management (Now / Next / Later)
- Automatic task breakdown
- Focus timers (Pomodoro & deep focus)
- Study routines and schedules
- Productivity analytics and streaks

Goal Alignment
- When students explore graduate pathways in HiSchool:
  - HiTime subtly aligns study focus
  - Suggests relevant subject emphasis
  - Helps build routines that match long-term interests

No forcing. No decisions locked in. Just alignment.

---

## 🏗️ Phase 1 Scope (MVP)

Phase 1 focuses on core value and real student usage.

### Included
- Grade 11 & 12 only (hard restriction)
- School-based onboarding
- Student dashboard
- Notes, quizzes, and study groups
- Tasks, routines, and focus timers
- Graduate pathway content
- Teacher content verification
- Clean, modern web UI

### Excluded (Intentionally)
- Payments
- AI features
- Attendance tracking
- Grading systems
- Parent interaction (future phase)
- Mobile app (Flutter planned later)

---

## 👥 User Roles

### 🎓 Students (Primary Users)
- Grade 11 & 12 only
- Use HiSchool and HiTime daily
- Learn, plan, collaborate, and explore futures

### 👨‍🏫 Teachers (Support Role)
- Upload and verify academic content
- Share guidance and announcements
- No control over student planning or routines

### 🎓 Graduates (Advisory Role)
- Verified contributors
- Share structured experiences
- No direct control or mentoring (Phase 1)

### 🏫 School Admin
- Register schools
- Upload student lists
- Assign teachers
- Manage academic calendar

> There is no public signup.  
> Access is controlled at the school level.

---

## 🔐 Grade Restriction (System-Level)

HiCenter is structurally limited to Grade 11 and Grade 12:

- Accounts are created through schools
- Every student is tagged with grade level
- Content, communities, and analytics are grade-locked
- Enforcement happens at the API and database level
 
---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (React 19, App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Glassmorphism design system
- **State & Services**: Custom reactive service layer with REST API fallback
- **Design System**: Modern, high-contrast, distraction-free aesthetic tailored for Grade 11–12 students

### Backend Services

#### 🔴 Scala Play Backend (Primary High-Performance API)
- **Repository**: [https://github.com/YosefAbire/scala-backend.git](https://github.com/YosefAbire/scala-backend.git)
- **Language**: Scala 3 (3.3.3)
- **Framework**: Play Framework 3 (PlayScala)
- **Authentication**: JWT-based session security (`jwt-play-json`) & BCrypt password hashing
- **Architecture**: Modular controller-repository layer with Guice dependency injection
- **Endpoints**: `/api/auth/*`, `/api/schools/*`, `/api/hischool/*`, `/api/hitime/*`

#### 🐍 Python Django Backend (Alternative Service)
- **Framework**: Django REST Framework (DRF)
- **Authentication**: SimpleJWT & RBAC
- **Features**: Relational modeling, admin suite

### Database & Security
- **Database**: PostgreSQL 16 (or SQLite development storage)
- **Security**: HttpOnly cookie-based JWT authentication & school-level grade isolation

---

## ⚡ Quickstart & Local Setup

### 1. Start the Scala Play Backend
```bash
cd scala-backend
sbt run
```
The Scala backend will launch on `http://localhost:9000`.

### 2. Start the Next.js Frontend
```bash
cd frontend
npm install
npm run dev
```
The frontend will start on `http://localhost:3000` (or `http://localhost:3005`).
Next.js will automatically proxy `/api/*` requests to the Scala backend on port 9000.

---

## 📜 License 
To be defined.

---

**HiCenter**  
*Learn. Plan. Grow — at the center.*



