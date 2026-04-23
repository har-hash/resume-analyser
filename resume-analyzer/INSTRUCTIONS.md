# 📘 COMPLETE SETUP INSTRUCTIONS — ResumeAI

## Cloud-Based Intelligent Resume Analyzer

This document explains **every single step** needed to set up and run this project on a brand new computer. Follow these instructions in order, step by step. Do not skip anything.

---

## 📋 Table of Contents

1. [What This Project Is](#1-what-this-project-is)
2. [Prerequisites — Software You Need to Install First](#2-prerequisites--software-you-need-to-install-first)
3. [Getting the Project Files](#3-getting-the-project-files)
4. [Opening the Project in VS Code](#4-opening-the-project-in-vs-code)
5. [Setting Up the Backend (Python)](#5-setting-up-the-backend-python)
6. [Setting Up the Frontend (Node.js)](#6-setting-up-the-frontend-nodejs)
7. [Running the Application](#7-running-the-application)
8. [Using the Application](#8-using-the-application)
9. [Stopping the Application](#9-stopping-the-application)
10. [All Libraries & Dependencies](#10-all-libraries--dependencies)
11. [Common Errors & Fixes](#11-common-errors--fixes)
12. [Project Folder Structure](#12-project-folder-structure)

---

## 1. What This Project Is

This is a web application that lets you:
- Upload your resume (PDF or DOCX file)
- Get an ATS (Applicant Tracking System) compatibility score out of 100
- See which skills were detected in your resume
- See missing keywords for a job description you paste in
- Get actionable suggestions to improve your resume

It has two parts:
- **Frontend** — The website you see in the browser (built with Next.js / React)
- **Backend** — The server that processes your resume (built with Python / FastAPI)

Both parts must be running at the same time for the app to work.

---

## 2. Prerequisites — Software You Need to Install First

You need to install **3 things** on your computer before starting. If you already have any of them, skip that step.

### 2.1 Install Node.js (Required for Frontend)

1. Open your web browser (Chrome, Edge, Firefox, etc.)
2. Go to: **https://nodejs.org**
3. You will see two download buttons. Click the one that says **"LTS"** (Long Term Support). As of 2026, this is version 20.x or 22.x.
4. A `.msi` file will download. Double-click it to open the installer.
5. Click **Next** on every screen. Keep all default settings. Click **Install**.
6. When it finishes, click **Finish**.
7. **Verify it installed:** Open the Start menu, type `cmd`, and press Enter to open Command Prompt. Type:
   ```
   node --version
   ```
   You should see something like `v20.x.x` or `v22.x.x`. If you see an error, restart your computer and try again.
8. Also check npm (it comes with Node.js):
   ```
   npm --version
   ```
   You should see a version number like `10.x.x`.

### 2.2 Install Python (Required for Backend)

1. Go to: **https://www.python.org/downloads/**
2. Click the big yellow **"Download Python 3.x.x"** button.
3. A `.exe` file will download. Double-click it.
4. **⚠️ IMPORTANT:** On the first screen of the installer, at the bottom, there is a checkbox that says **"Add Python to PATH"**. **CHECK THIS BOX.** This is very important.
5. Then click **"Install Now"**.
6. Wait for it to finish. Click **Close**.
7. **Verify it installed:** Open Command Prompt (Start menu → type `cmd` → press Enter). Type:
   ```
   python --version
   ```
   You should see `Python 3.x.x`. If you see an error, restart your computer and try again.
8. Also check pip (Python's package installer):
   ```
   pip --version
   ```
   You should see a version number.

### 2.3 Install Visual Studio Code (Code Editor)

1. Go to: **https://code.visualstudio.com/**
2. Click the blue **"Download for Windows"** button.
3. A `.exe` file will download. Double-click it.
4. Accept the license agreement. Click **Next**.
5. On the "Select Additional Tasks" screen, check these boxes:
   - ✅ Add "Open with Code" action to Windows Explorer file context menu
   - ✅ Add "Open with Code" action to Windows Explorer directory context menu
   - ✅ Add to PATH
6. Click **Next**, then **Install**, then **Finish**.

---

## 3. Getting the Project Files

### Option A: If you received a ZIP file

1. Find the ZIP file (e.g., `resume-analyzer.zip`) in your Downloads folder.
2. Right-click on it → Click **"Extract All..."**
3. Choose where to extract it (e.g., `C:\Users\YourName\Desktop\resume-analyzer`).
4. Click **Extract**.
5. You should now have a folder called `resume-analyzer` with two folders inside: `frontend` and `backend`.

### Option B: If you are pulling from Git

1. First, install Git if you don't have it:
   - Go to: **https://git-scm.com/download/win**
   - Download and install with all default settings.
2. Open Command Prompt (Start menu → type `cmd` → press Enter).
3. Navigate to where you want to put the project. For example, to put it on your Desktop:
   ```
   cd Desktop
   ```
4. Clone the repository (replace the URL with the actual repository URL):
   ```
   git clone https://github.com/YOUR-USERNAME/resume-analyzer.git
   ```
5. Wait for it to download. When done, you will have a `resume-analyzer` folder on your Desktop.

---

## 4. Opening the Project in VS Code

1. Open **Visual Studio Code** (find it in your Start menu or Desktop shortcut).
2. Click **File** in the top menu bar → Click **Open Folder...**
3. Navigate to the `resume-analyzer` folder (wherever you extracted or cloned it).
4. Select the `resume-analyzer` folder and click **Select Folder**.
5. If VS Code asks "Do you trust the authors?", click **Yes, I trust the authors**.
6. You should now see the project files in the left sidebar (Explorer panel). You should see `frontend` and `backend` folders.

### Opening the Terminal in VS Code

You need to use the **Terminal** (command line) inside VS Code to run commands.

1. In VS Code, click **Terminal** in the top menu bar → Click **New Terminal**.
2. A terminal panel will appear at the bottom of the screen. This is where you will type commands.
3. By default, it opens in the project root folder (`resume-analyzer`). This is correct.

> **💡 TIP:** You will need **TWO separate terminals** (one for backend, one for frontend). To open a second terminal, click the **+** icon in the terminal panel, or press `Ctrl + Shift + ~` (backtick key).

---

## 5. Setting Up the Backend (Python)

These steps only need to be done **once** when setting up the project for the first time.

### Step 5.1: Open a Terminal for the Backend

1. In VS Code, open a terminal (Terminal → New Terminal).
2. Navigate to the backend folder by typing this command and pressing Enter:
   ```
   cd backend
   ```
   Your terminal prompt should now show something like `...\resume-analyzer\backend>`.

### Step 5.2: Create a Python Virtual Environment

A virtual environment keeps this project's Python libraries separate from other projects.

Type this command and press Enter:
```
python -m venv venv
```

Wait a few seconds. A new folder called `venv` will appear inside the `backend` folder. This is normal.

### Step 5.3: Activate the Virtual Environment

Type this command and press Enter:

**On Windows (PowerShell — default in VS Code):**
```
.\venv\Scripts\activate
```

**On Windows (Command Prompt):**
```
venv\Scripts\activate
```

**On macOS / Linux:**
```
source venv/bin/activate
```

After running this, you should see `(venv)` appear at the beginning of your terminal prompt. This means the virtual environment is active. Example:
```
(venv) PS C:\Users\YourName\Desktop\resume-analyzer\backend>
```

> **⚠️ If you get an error about "execution policy":**
> Type this command first, then try again:
> ```
> Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
> ```
> Type `Y` and press Enter when asked.

### Step 5.4: Install Python Libraries

With the virtual environment active (you see `(venv)` in your prompt), type:
```
pip install fastapi uvicorn PyPDF2 python-docx python-multipart
```

Press Enter and wait. You will see it downloading and installing packages. This may take 1-3 minutes depending on your internet speed.

**What these libraries do:**

| Library             | What it does                                                   |
|---------------------|----------------------------------------------------------------|
| `fastapi`           | The web framework that runs the backend API server             |
| `uvicorn`           | The server that hosts FastAPI (like Apache for Python)          |
| `PyPDF2`            | Reads and extracts text from PDF files                          |
| `python-docx`       | Reads and extracts text from DOCX (Word) files                  |
| `python-multipart`  | Allows the API to receive file uploads from the frontend        |

When the installation finishes, you should see "Successfully installed ..." with no errors.

### Step 5.5: Verify the Backend Setup

Type this command to make sure everything is installed:
```
pip list
```

You should see `fastapi`, `uvicorn`, `PyPDF2`, `python-docx`, and `python-multipart` in the list (along with their dependencies).

---

## 6. Setting Up the Frontend (Node.js)

These steps only need to be done **once** when setting up the project for the first time.

### Step 6.1: Open a SECOND Terminal for the Frontend

1. In VS Code, click the **+** icon in the terminal panel to create a new terminal tab.
2. Navigate to the frontend folder:
   ```
   cd frontend
   ```
   Your terminal prompt should now show something like `...\resume-analyzer\frontend>`.

### Step 6.2: Install Node.js Libraries

Type this command and press Enter:
```
npm install
```

Wait for it to finish. This may take 1-5 minutes. You will see a progress bar and lots of text. When it's done, you'll see something like:
```
added 360 packages, and audited 361 packages in 1m
```

This installs all the frontend libraries listed in `package.json`.

**Key Node.js libraries used:**

| Library             | What it does                                                    |
|---------------------|-----------------------------------------------------------------|
| `next`              | The React framework that powers the frontend website            |
| `react`             | The core UI library for building the interface                  |
| `react-dom`         | Connects React to the browser's DOM                             |
| `framer-motion`     | Provides smooth animations and transitions                      |
| `lucide-react`      | Provides beautiful icons (upload, file, check, etc.)            |
| `tailwindcss`       | CSS framework for styling (colors, spacing, layouts)            |
| `typescript`        | Adds type safety to JavaScript                                  |
| `eslint`            | Checks code for errors and style issues                         |
| `@tailwindcss/postcss` | PostCSS plugin for Tailwind CSS v4                           |

---

## 7. Running the Application

**You must run BOTH the backend and frontend at the same time.** Use the two terminal tabs you created.

### Step 7.1: Start the Backend Server

1. Click on your **first terminal tab** (the one in the `backend` folder).
2. Make sure the virtual environment is active. You should see `(venv)` in the prompt. If not, activate it:
   ```
   .\venv\Scripts\activate
   ```
3. Start the backend server:
   ```
   uvicorn main:app --reload
   ```
4. You should see output like:
   ```
   INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
   INFO:     Started reloader process [xxxx] using StatReload
   INFO:     Started server process [xxxx]
   INFO:     Waiting for application startup.
   INFO:     Application startup complete.
   ```
5. **The backend is now running at `http://localhost:8000`.**
6. **Do NOT close this terminal or press Ctrl+C.** Leave it running.

### Step 7.2: Start the Frontend Server

1. Click on your **second terminal tab** (the one in the `frontend` folder).
2. Start the frontend:
   ```
   npm run dev
   ```
3. You should see output like:
   ```
   ▲ Next.js 16.x.x (Turbopack)
   - Local:    http://localhost:3000
   ✓ Ready in xxxms
   ```
4. **The frontend is now running at `http://localhost:3000`.**
5. **Do NOT close this terminal.** Leave it running.

### Step 7.3: Open the Application in Your Browser

1. Open your web browser (Chrome, Edge, Firefox, etc.)
2. In the address bar at the top, type:
   ```
   http://localhost:3000
   ```
3. Press Enter.
4. **You should see the ResumeAI landing page!** 🎉

---

## 8. Using the Application

### Uploading a Resume

1. From the landing page, click **"Get Started Free"**.
2. You will be taken to the Dashboard. Click **"Analyze Resume"** in the left sidebar (or click "New Analysis").
3. On the upload page:
   - **Drag and drop** a PDF or DOCX resume file onto the upload area, OR
   - Click **"Select File"** and choose a file from your computer.
4. *(Optional)* Paste a **Job Description** into the text area below the file. This gives you a targeted keyword match score.
5. Click the blue **"Start Analysis"** button.
6. Wait a few seconds. You will see a progress bar.
7. When analysis is complete, click **"View Results"**.

### Understanding the Results

- **ATS Score (0-100%)**: How well your resume performs against Applicant Tracking Systems.
- **Skills Detected**: Technical skills found in your resume.
- **Job Description Match** *(if provided)*: Percentage of job keywords found in your resume, plus missing keywords.
- **Action Verbs**: Whether you use strong verbs like "Architected" vs weak phrases like "Responsible for".
- **Impact Metrics**: Whether you include numbers and percentages (e.g., "increased by 20%").
- **Resume Sections**: Which standard resume sections (Education, Experience, Skills, etc.) were detected.
- **Improvement Suggestions**: Prioritized, actionable steps to improve your score.

### Dashboard

- Go to `/dashboard` to see all your past analyses.
- Click on any analysis to view its full results again.

---

## 9. Stopping the Application

To stop the application:

1. Go to the **backend terminal** and press `Ctrl + C`. This stops the Python server.
2. Go to the **frontend terminal** and press `Ctrl + C`. This stops the Next.js server. If it asks "Terminate batch job?", type `Y` and press Enter.

To start it again later, follow Steps 7.1 and 7.2 again (you do NOT need to reinstall the libraries).

---

## 10. All Libraries & Dependencies

### Python Backend Libraries

These are installed via `pip install` in the `backend` folder:

| Library                 | Version   | Purpose                                           |
|-------------------------|-----------|---------------------------------------------------|
| `fastapi`               | 0.136.1   | Python web framework for building REST APIs        |
| `uvicorn`               | 0.46.0    | ASGI server to run the FastAPI application         |
| `PyPDF2`                | 3.0.1     | Extract text content from PDF files                |
| `python-docx`           | 1.2.0     | Extract text content from DOCX (Word) files        |
| `python-multipart`      | 0.0.26    | Handle file uploads in HTTP requests               |
| `starlette`             | (auto)    | Underlying web toolkit used by FastAPI             |
| `pydantic`              | (auto)    | Data validation and serialization (FastAPI dep)    |
| `typing-extensions`     | (auto)    | Extended type hints for Python                     |
| `anyio`                 | (auto)    | Async I/O library (uvicorn dependency)             |
| `click`                 | (auto)    | Command line interface toolkit (uvicorn dep)       |
| `h11`                   | (auto)    | HTTP/1.1 protocol library (uvicorn dep)            |
| `sniffio`               | (auto)    | Async library detection (anyio dep)                |
| `idna`                  | (auto)    | International domain names (anyio dep)             |
| `lxml`                  | (auto)    | XML/HTML processing (python-docx dep)              |

> Libraries marked `(auto)` are installed automatically as dependencies. You don't need to install them manually.

**Quick install command (copy-paste this):**
```
pip install fastapi uvicorn PyPDF2 python-docx python-multipart
```

### Node.js Frontend Libraries

These are installed via `npm install` in the `frontend` folder. They are defined in `package.json`:

**Main Dependencies (`dependencies`):**

| Library             | Purpose                                                     |
|---------------------|-------------------------------------------------------------|
| `next`              | React framework with routing, SSR, and optimization         |
| `react`             | Core UI component library                                   |
| `react-dom`         | React renderer for the browser                              |
| `framer-motion`     | Animation library for smooth transitions and effects         |
| `lucide-react`      | Modern, clean icon library                                  |

**Dev Dependencies (`devDependencies`):**

| Library                  | Purpose                                                |
|--------------------------|--------------------------------------------------------|
| `typescript`             | Adds static type checking to JavaScript                |
| `tailwindcss`            | Utility-first CSS framework for styling                |
| `@tailwindcss/postcss`   | PostCSS plugin for Tailwind CSS v4                     |
| `@types/node`            | TypeScript type definitions for Node.js                |
| `@types/react`           | TypeScript type definitions for React                  |
| `@types/react-dom`       | TypeScript type definitions for React DOM              |
| `eslint`                 | Code linting and error checking tool                   |
| `eslint-config-next`     | ESLint configuration preset for Next.js projects       |

**Quick install command (copy-paste this):**
```
npm install
```
*(This reads `package.json` and installs everything automatically.)*

---

## 11. Common Errors & Fixes

### ❌ Error: `python` is not recognized as a command
**Fix:** Python is not in your PATH. Uninstall Python and reinstall it, making sure to check the **"Add Python to PATH"** checkbox during installation. Then restart your computer.

### ❌ Error: `node` is not recognized as a command
**Fix:** Node.js is not in your PATH. Restart your computer after installing Node.js. If it still doesn't work, uninstall and reinstall Node.js.

### ❌ Error: `npm` is not recognized as a command
**Fix:** Same as above — reinstall Node.js and restart your computer.

### ❌ Error: Running scripts is disabled on this system (PowerShell)
**Fix:** Open PowerShell as Administrator and type:
```
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
Type `Y` and press Enter.

### ❌ Error: `port 3000 is already in use`
**Fix:** Another application is using port 3000. Either:
- Close the other application, or
- Next.js will automatically use port 3001 instead. Open `http://localhost:3001` in your browser.

### ❌ Error: `port 8000 is already in use`
**Fix:** Another application is using port 8000. Either close it, or start the backend on a different port:
```
uvicorn main:app --reload --port 8001
```
Then update the `API_URL` in the frontend files (`upload/page.tsx` and `results/[id]/page.tsx` and `dashboard/page.tsx`) to use `http://localhost:8001`.

### ❌ Error: `ENOENT: no such file or directory, open 'package.json'`
**Fix:** You are in the wrong folder. Make sure you `cd frontend` before running `npm` commands. The `backend` folder does NOT have a `package.json`.

### ❌ Error: Analysis gives "Could not extract meaningful text"
**Fix:** Your PDF might be image-based (scanned). This tool needs text-based PDFs. Try a different resume file, or convert your scanned PDF to text using an OCR tool first.

### ❌ Frontend shows "Analysis Failed" or "Server error"
**Fix:** Make sure the **backend server is running** in its terminal (`uvicorn main:app --reload`). Both servers must be running simultaneously.

---

## 12. Project Folder Structure

```
resume-analyzer/
│
├── INSTRUCTIONS.md          ← You are reading this file
├── README.md                ← Short project overview
│
├── backend/                 ← Python FastAPI backend
│   ├── main.py              ← API endpoints (upload, analyze, get results)
│   ├── analyzer.py          ← Resume analysis engine (scoring, skill detection)
│   ├── database.py          ← Database configuration (SQLAlchemy)
│   ├── models.py            ← Database table definitions
│   ├── schemas.py           ← API data validation schemas (Pydantic)
│   ├── requirements.txt     ← List of Python libraries
│   ├── .env.example         ← Example environment variables
│   └── venv/                ← Python virtual environment (created by you)
│
├── frontend/                ← Next.js React frontend
│   ├── package.json         ← List of Node.js libraries
│   ├── tsconfig.json        ← TypeScript configuration
│   ├── next.config.ts       ← Next.js configuration
│   ├── node_modules/        ← Installed libraries (created by npm install)
│   └── src/
│       └── app/
│           ├── layout.tsx       ← Root HTML layout
│           ├── page.tsx         ← Landing page (/)
│           ├── globals.css      ← Global styles
│           └── dashboard/
│               ├── layout.tsx       ← Dashboard sidebar layout
│               ├── page.tsx         ← Dashboard overview (/dashboard)
│               ├── upload/
│               │   └── page.tsx     ← Upload & analyze page (/dashboard/upload)
│               └── results/
│                   └── [id]/
│                       └── page.tsx ← Analysis results page (/dashboard/results/xxx)
```

---

## 🎯 Quick Start Summary (TL;DR)

If you just want the shortest possible steps:

```bash
# Terminal 1 — Backend
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install fastapi uvicorn PyPDF2 python-docx python-multipart
uvicorn main:app --reload

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev
```

Then open **http://localhost:3000** in your browser.

---

*Last updated: April 2026*
