from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from analyzer import analyze_resume
import json
import uuid
import os

app = FastAPI(title="ResumeAI API")

# In-memory store for analyses (for demo; swap for DB in production)
analyses_store: dict = {}

# Setup CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure uploads directory exists
os.makedirs("uploads", exist_ok=True)

@app.get("/")
def read_root():
    return {"message": "Welcome to ResumeAI Backend API", "status": "running"}

@app.post("/api/analyze")
async def analyze(
    file: UploadFile = File(...),
    job_description: str = Form(default=""),
):
    """
    Upload a resume file (PDF or DOCX) and optionally a job description.
    Returns a comprehensive analysis with ATS score and suggestions.
    """
    # Validate file type
    allowed_types = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]
    # Also check extension as a fallback
    ext = file.filename.lower().rsplit('.', 1)[-1] if file.filename and '.' in file.filename else ''
    
    if file.content_type not in allowed_types and ext not in ('pdf', 'docx'):
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type '{file.content_type}'. Only PDF and DOCX are supported."
        )
    
    # Read file bytes
    file_bytes = await file.read()
    
    if len(file_bytes) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size exceeds 5MB limit.")
    
    if len(file_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")
    
    # Run analysis
    try:
        result = analyze_resume(file_bytes, file.filename, job_description)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
    
    # Store result with unique ID
    analysis_id = str(uuid.uuid4())[:8]
    analyses_store[analysis_id] = {
        "id": analysis_id,
        "filename": file.filename,
        **result,
    }
    
    return {
        "id": analysis_id,
        "filename": file.filename,
        **result,
    }

@app.get("/api/analysis/{analysis_id}")
def get_analysis(analysis_id: str):
    """Retrieve a previously computed analysis by ID."""
    if analysis_id not in analyses_store:
        raise HTTPException(status_code=404, detail="Analysis not found. It may have expired.")
    return analyses_store[analysis_id]

@app.get("/api/analyses")
def list_analyses():
    """List all analyses in memory."""
    items = []
    for aid, data in analyses_store.items():
        items.append({
            "id": aid,
            "filename": data.get("filename", "Unknown"),
            "ats_score": data.get("ats_score", {}).get("total", 0),
            "word_count": data.get("word_count", 0),
        })
    return {"analyses": items}
