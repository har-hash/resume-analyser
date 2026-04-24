# Cloud-Based Intelligent Resume Analyzer

An intelligent, cloud-ready web application that analyzes resumes for Applicant Tracking Systems (ATS) and provides actionable feedback.

## Features
- **Modern UI**: Built with Next.js 14, Tailwind CSS v4, and Framer Motion.
- **Smart Parsing**: FastAPI backend capable of extracting structured info from PDF and DOCX files.
- **ATS Optimization Engine**: Provides mock scoring, missing keyword tracking, and AI-driven recommendations.
- **Secure Architecture**: Environment variables to protect keys, scalable REST API structure.

## Deployment Ready
The frontend is optimized for deployment on **Vercel**.
The backend is structured for deployment on **Render**, **AWS EC2**, or **Railway** using Uvicorn.

## Local Setup Instructions

### Prerequisites
- Node.js (>= 18.x)
- Python (>= 3.9)

### 1. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On MacOS/Linux:
# source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

## API Documentation
Once the backend is running (`uvicorn main:app --reload`), visit `http://localhost:8000/docs` to see the automatically generated, interactive Swagger UI documentation for all endpoints.

### Tech Stack
- Frontend: Next.js + Tailwind CSS
- Backend: FastAPI + SQLAlchemy + SQLite (Development setup)
- Database: Readily configurable to PostgreSQL using the connection string.
