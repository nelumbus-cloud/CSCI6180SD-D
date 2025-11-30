# CareerHub

## Job Application Tracker and Resume Builder

CareerHub is a full-stack web application designed to help job seekers manage their job search process. The application provides tools for tracking job applications, building professional resumes, synchronizing important dates with Google Calendar, and discovering new job opportunities.

## Table of Contents

1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Installation](#installation)
5. [Features](#features)
6. [API Reference](#api-reference)
7. [Docker Deployment](#docker-deployment)
8. [Testing](#testing)
9. [Contributing](#contributing)
10. [Known Limitations](#known-limitations)
11. [License](#license)

## Overview

CareerHub addresses common challenges faced by job seekers during their application process. The application provides the following core functionalities:

1. Track job applications with status updates, deadlines, and notes
2. Build and manage resumes with a section-by-section editor
3. Sync important dates to Google Calendar to avoid missing interviews
4. Discover new job opportunities from external job boards
5. Parse job descriptions using AI to automatically extract application details

## Technology Stack

### Backend

The backend is built using the following technologies:

| Technology | Purpose |
|------------|---------|
| FastAPI | Python web framework for building REST APIs |
| SQLAlchemy | Object-Relational Mapping for database operations |
| SQLite | Lightweight relational database |
| Google Gemini AI | Natural language processing for job description parsing |
| Google Calendar API | Calendar integration for event synchronization |

### Frontend

The frontend utilizes the following technologies:

| Technology | Purpose |
|------------|---------|
| React 19 | JavaScript library for building user interfaces |
| Vite | Build tool and development server |
| Tailwind CSS 4 | Utility-first CSS framework |
| Radix UI | Accessible component primitives |
| Lucide React | Icon library |

## Project Structure

The project is organized into two main directories: backend and frontend.

```
CSCI6180SD-D/
    backend/
        app/
            main.py                 FastAPI application entry point
            models.py               Database models (User, Job, Resume)
            database.py             Database connection configuration
            auth.py                 Authentication helper functions
            auth_routes.py          Authentication endpoints (login, signup, password reset)
            job_routes.py           Job application CRUD operations
            resume_routes.py        Resume builder API endpoints
            calendar_routes.py      Google Calendar integration endpoints
            calendar_service.py     Calendar synchronization logic
            job_parser_routes.py    AI job description parser endpoint
            gemini_service.py       Google Gemini AI integration
            external_jobs.py        External job board integration
        requirements.txt            Python dependencies
        Dockerfile                  Container configuration
        seed.py                     Database seeder script

    frontend/
        src/
            App.jsx                 Main application component
            Dashboard.jsx           Dashboard view component
            components/
                Login.jsx           Login form component
                Signup.jsx          Registration form component
                JobCard.jsx         Job display component
                JobList.jsx         Job listing grid component
                JobFormModal.jsx    Add/edit job form component
                ResumeBuilder.jsx   Resume editor component
                ResumePreview.jsx   Resume PDF preview component
                NewFeed.jsx         External job listings component
                Settings.jsx        User settings component
                DashboardSidebar.jsx    Sidebar with interviews and suggestions
                ui/                 Reusable UI components
            contexts/
                AuthContext.jsx     Authentication state management
            services/
                authService.js      Authentication API service
                jobService.js       Job API service
                resumeService.js    Resume API service
                calendarService.js  Calendar API service
        package.json                Node.js dependencies
        vite.config.js              Vite configuration

    README.md                       Project documentation
```

## Installation

### Prerequisites

Before installing the application, ensure the following software is installed on your system:

1. Python 3.11 or higher (for the backend)
2. Node.js 18 or higher (for the frontend)
3. Google Cloud Console account (optional, for Gemini AI and Calendar API features)

### Step 1: Clone the Repository

```bash
git clone https://github.com/nelumbus-cloud/CSCI6180SD-D.git
cd CSCI6180SD-D
```

### Step 2: Backend Setup

Navigate to the backend directory and create a virtual environment:

```bash
cd backend
python -m venv venv
```

Activate the virtual environment:

On Windows:
```bash
venv\Scripts\activate
```

On macOS/Linux:
```bash
source venv/bin/activate
```

Install the required dependencies:

```bash
pip install -r requirements.txt
```

### Step 3: Environment Configuration

Create a `.env` file in the `backend/` directory with the following variables:

```
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
SESSION_SECRET_KEY=your-random-secret-key
AUTH_SECRET_KEY=your-jwt-secret-key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:8000/api/calendar/oauth2callback
FRONTEND_URL=http://localhost:5173
APP_ENV=development
```

To obtain the required API keys:

1. Gemini API Key: Visit https://aistudio.google.com/app/apikey
2. Google OAuth Credentials: Visit https://console.cloud.google.com/, navigate to APIs and Services, then Credentials

### Step 4: Database Initialization (Optional)

To populate the database with sample data, run:

```bash
python seed.py
```

This creates a test user and sample job application data.

### Step 5: Start the Backend Server

```bash
cd app
uvicorn main:app --reload --port 8000
```

The API will be available at http://localhost:8000. Interactive API documentation is available at http://localhost:8000/docs.

### Step 6: Frontend Setup

Open a new terminal window and navigate to the frontend directory:

```bash
cd frontend
npm install
npm run dev
```

The application will be accessible at http://localhost:5173.

---

## Features

### Job Tracking

The job tracking module allows users to manage their job applications. Key capabilities include:

1. Manual job entry or AI-assisted parsing of job descriptions
2. Status tracking with options including Applied, Interview, Offer, and Rejected
3. Important date management for interviews, application deadlines, and follow-up reminders
4. Search and filter functionality across all saved jobs

### Resume Builder

The resume builder provides a structured approach to resume creation:

1. Section-based editor covering Personal Information, Experience, Education, Skills, and Projects
2. Automatic saving with debounced API calls to prevent data loss
3. Preview functionality before downloading
4. PDF export capability

### Google Calendar Integration

Calendar integration enables synchronization of job-related events:

1. Google account connection through the Settings page
2. Automatic synchronization of interview dates, deadlines, and follow-up reminders
3. One-click calendar event creation from the dashboard sidebar

### Job Discovery

The job discovery feature helps users find new opportunities:

1. Remote job listings sourced from Remotive job board
2. Personalized job suggestions based on saved application history
3. Job saving functionality for future reference

### AI-Powered Job Parsing

The AI parsing feature streamlines job entry:

1. Paste any job description into the Add Job form
2. Click Parse with AI to extract title, company, location, salary, and requirements
3. Review extracted data and save to job list

## API Reference

The following tables document the available API endpoints.

### Authentication Endpoints

| Method | Endpoint                 | Description                   
|--------|--------------------------|-----------------------------
| POST   | /api/auth/signup         |Create a new user account
| POST   | /api/auth/token          |Authenticate and receive access token
| GET    | /api/auth/me             |Retrieve current user information
| POST   | /api/auth/forgot-password| Request password reset email
| POST   | /api/auth/reset-password | Reset password using token 

### Job Management Endpoints

| Method | Endpoint       | Description 
|--------|----------------|-------------
| GET    | /api/jobs/     | Retrieve all jobs for current user
| POST   | /api/jobs/     | Create a new job entry
| GET    | /api/jobs/{id} | Retrieve a specific job by ID
| PUT    | /api/jobs/{id} | Update an existing job
| DELETE | /api/jobs/{id} | Delete a job entry
| POST   | /api/jobs/parse| Parse job description using AI

### Resume Endpoints

| Method | Endpoint               | Description 
|--------|------------------------|------------------------------------
| GET    | /api/resume/           | Retrieve user resume 
| POST   | /api/resume/           |Create or update complete resume
| PUT    | /api/resume/personal   | Update personal information section
| PUT    | /api/resume/experience | Update work experience section
| PUT    | /api/resume/education  | Update education section
| PUT    | /api/resume/skills     | Update skills section
| PUT    | /api/resume/projects   | Update projects section

### Calendar Endpoints

| Method | Endpoint                   |Description 
|--------|----------------------------|-------------------------------
| GET    | /api/calendar/connect      | Initiate Google OAuth flow
| GET    | /api/calendar/status       | Check calendar connection status
| POST   | /api/calendar/sync/job/{id}| Synchronize job dates to calendar
| DELETE | /api/calendar/disconnect   | Disconnect Google Calendar

### External Jobs Endpoints

| Method | Endpoint                             | Description
|--------|--------------------------------------|--------------------------|
| GET    | /api/external/jobs/suggested-matches | Retrieve AI-suggested job matches

## Docker Deployment

If you prefer containers:

```bash
cd backend
docker build -t careerhub-backend .
docker run -p 8000:8000 --env-file .env careerhub-backend
```

---

## Test Credentials

After running `seed.py`, you can log in with:
- **Username**: `testuser`
- **Password**: `password123`

---

## Contributing

This is a course project for CSCI 6180 (Software Development). Feel free to fork and improve!

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/cool-thing`)
3. Commit your changes (`git commit -m 'Add cool thing'`)
4. Push to the branch (`git push origin feature/cool-thing`)
5. Open a Pull Request

---

## Known Issues & Limitations

- Resume PDF export works best in Chrome/Edge
- Google Calendar requires OAuth setup in Google Cloud Console
- External job API (Remotive) has rate limits — suggestions may be slow

---

## License

This project was created for educational purposes as part of CSCI 6180 Software Development course.

---

## Team

Built with coffee and late nights by the CSCI 6180 team.

---

*Happy job hunting!
