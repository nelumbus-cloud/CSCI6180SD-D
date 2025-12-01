# MyCarrer

## Project Description

MyCarrer is a full-stack web application designed to help job seekers manage their job search process. The application provides tools for tracking job applications, building professional resumes, synchronizing important dates with Google Calendar, discovering new job opportunities, and managing personal notes. The system uses Google Gemini AI to automatically parse job descriptions and extract relevant information.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation Instructions](#installation-instructions)
3. [Execution Instructions](#execution-instructions)
4. [Input/Output Explanation](#inputoutput-explanation)
5. [Features](#features)
6. [API Reference](#api-reference)
7. [Troubleshooting](#troubleshooting)
8. [Acknowledgements](#acknowledgements)

## Prerequisites

### Software Requirements

The following software must be installed on your system before running the application:

| Software | Version            | Purpose 
|----------|--------------------|---------------------------------
| Python   | 3.11 or higher     | Backend server runtime
| Node.js  | 18 or higher       | Frontend build and development
| npm      | 9 or higher        | Package management for frontend
| Git      | Any recent version | Repository cloning

### Hardware Requirements

| Component      | Minimum                                       | Recommended
|----------------|-----------------------------------------------|-------------
| RAM            | 4 GB                                          | 8 GB        
| Storage        | 500 MB                                        | 1 GB        
| CPU            | Dual-core processor                           | Quad-core processor
| Network        | Internet connection required for API features | Stable broadband connection

### External Services (Optional)

The following external services enhance functionality but are not required for basic operation:

1. Google Cloud Console Account - Required for Gemini AI job parsing and Google Calendar integration
2. Google Gemini API Key - Required for AI-powered job description parsing
3. Google OAuth Credentials - Required for Google Calendar synchronization

## Installation Instructions

### Step 1: Clone the Repository

```
git clone https://github.com/nelumbus-cloud/CSCI6180SD-D.git
cd CSCI6180SD-D
```

### Step 2: Backend Setup

Navigate to the backend directory and create a virtual environment:

```
cd backend
python -m venv venv
```

Activate the virtual environment:

On Windows:
```
venv\Scripts\activate
```

On macOS/Linux:
```
source venv/bin/activate
```

Install the required Python dependencies:

```
pip install -r requirements.txt
```

### Step 3: Environment Configuration

Create a file named `.env` in the `backend/` directory with the following content:

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

1. Gemini API Key: Visit https://aistudio.google.com/app/apikey and create a new API key
2. Google OAuth Credentials: Visit https://console.cloud.google.com/, navigate to APIs and Services, then Credentials, and create OAuth 2.0 credentials

### Step 4: Database Initialization (Optional)

To populate the database with sample data for testing:

```
python seed.py
```

This creates a test user account and sample job application data.

### Step 5: Frontend Setup

Open a new terminal window and navigate to the frontend directory:

```
cd frontend
npm install
```

## Execution Instructions

### Starting the Backend Server

From the `backend/app` directory with the virtual environment activated:

```
cd backend/app
uvicorn main:app --reload --port 8000
```

The backend API will be available at http://localhost:8000

Interactive API documentation is available at http://localhost:8000/docs

### Starting the Frontend Development Server

From the `frontend` directory in a separate terminal:

```
cd frontend
npm run dev
```

The application will be accessible at http://localhost:5173

### Running with Docker (Alternative)

To run the backend using Docker:

```
cd backend
docker build -t careerhub-backend .
docker run -p 8000:8000 --env-file .env careerhub-backend
```

### Test Credentials

After running `seed.py`, you can log in with the following credentials:

| Field    | Value 
|----------|------------
| Username | testuser
| Password | password123

## Input/Output Explanation

### User Authentication

Input:
- Username: String (3-50 characters)
- Password: String (minimum 6 characters)
- Email: Valid email format (for registration)

Output:
- Authentication token stored in HTTP-only cookie
- User session maintained across browser sessions

### Job Application Entry

Input (Manual Entry):
- Job Title: String (required)
- Company Name: String (required)
- Location: String (optional)
- Work Location: Remote/Hybrid/On-site (optional)
- Job Type: Full-time/Part-time/Contract/Internship (optional)
- Salary: String (optional)
- Description: Text (optional)
- Requirements: Comma-separated list (optional)
- Interview Date: DateTime (optional)
- Application Deadline: DateTime (optional)
- Follow-up Date: DateTime (optional)

Input (AI Parsing):
- Raw job description text (any format)

Output:
- Structured job entry with extracted fields
- Job card displayed in dashboard
- Optional calendar events created

Example Input (AI Parsing):
```
Software Engineer at Google
Location: Mountain View, CA (Hybrid)
Salary: $150,000 - $200,000

We are looking for a software engineer with 3+ years of experience
in Python and JavaScript. Must have experience with cloud platforms.

Requirements:
- Bachelor's degree in Computer Science
- 3+ years of software development experience
- Proficiency in Python and JavaScript
```

Example Output (Parsed Data):
```
{
  "title": "Software Engineer",
  "company": "Google",
  "location": "Mountain View, CA",
  "work_location": "Hybrid",
  "salary": "$150,000 - $200,000",
  "requirements": [
    "Bachelor's degree in Computer Science",
    "3+ years of software development experience",
    "Proficiency in Python and JavaScript"
  ]
}
```

### Resume Builder

Input:
- Personal Information: Name, email, phone, location, LinkedIn URL, portfolio URL, summary
- Experience: Company, position, start date, end date, description (multiple entries)
- Education: School, degree, field of study, dates, GPA (multiple entries)
- Skills: Skill name, proficiency level (multiple entries)
- Projects: Project name, description, technologies, link (multiple entries)

Output:
- Formatted resume preview
- PDF export file

### Notes

Input:
- Title: String (optional, defaults to "Untitled Note")
- Content: Text (optional)

Output:
- Saved note with timestamps
- List of all user notes ordered by most recent

## Features

### Job Tracking

The job tracking module allows users to manage their job applications:

1. Manual job entry with comprehensive fields for all job details
2. AI-assisted parsing of job descriptions using Google Gemini
3. Status tracking with options: Applied, Interview, Offer, Rejected, In Progress
4. Important date management for interviews, application deadlines, and follow-up reminders
5. Search and filter functionality across all saved jobs
6. Job statistics overview

### Resume Builder

The resume builder provides a structured approach to resume creation:

1. Section-based editor covering Personal Information, Experience, Education, Skills, and Projects
2. Automatic saving with debounced API calls to prevent data loss
3. Real-time preview functionality
4. PDF export capability

### Google Calendar Integration

Calendar integration enables synchronization of job-related events:

1. Google account connection through OAuth 2.0
2. Automatic synchronization of interview dates, deadlines, and follow-up reminders
3. One-click calendar event creation from the dashboard sidebar

### Job Discovery

The job discovery feature helps users find new opportunities:

1. Remote job listings sourced from Remotive job board API
2. Personalized job suggestions based on saved application history
3. Job saving functionality for future reference
4. Search and filter by location, company, and keywords

### AI-Powered Job Parsing

The AI parsing feature streamlines job entry:

1. Paste any job description into the Add Job form
2. Click Parse with AI to extract title, company, location, salary, and requirements
3. Review extracted data and make adjustments before saving

### Notes Management

The notes feature allows users to create and manage personal notes:

1. Create notes with titles and content for tasks and reminders
2. Edit and update existing notes
3. Delete notes when no longer needed
4. Notes are stored in the database and synced across devices

### User Authentication

Secure user authentication system:

1. User registration with email verification
2. Login with username and password
3. Password reset via email
4. Session management with secure HTTP-only cookies

## API Reference

### Authentication Endpoints

| Method | Endpoint                  | Description 
|--------|---------------------------|--------------------------------------
| POST   | /api/auth/signup          | Create a new user account
| POST   | /api/auth/token           | Authenticate and receive access token
| GET    | /api/auth/me              | Retrieve current user information
| POST   | /api/auth/forgot-password | Request password reset email
| POST   | /api/auth/reset-password  | Reset password using token

### Job Management Endpoints

| Method | Endpoint        | Description 
|--------|-----------------|---------------------------------------
| GET    | /api/jobs/      | Retrieve all jobs for current user
| POST   | /api/jobs/      | Create a new job entry
| GET    | /api/jobs/{id}  | Retrieve a specific job by ID
| PUT    | /api/jobs/{id}  | Update an existing job
| DELETE | /api/jobs/{id}  | Delete a job entry
| POST   | /api/jobs/parse | Parse job description using AI

### Resume Endpoints

| Method | Endpoint                | Description 
|--------|-------------------------|------------------------
| GET    |/api/resume/             | Retrieve user resume 
| POST   | /api/resume/            | Create or update complete resume
| PUT    | /api/resume/personal    | Update personal information section
| PUT    | /api/resume/experience  | Update work experience section
| PUT    | /api/resume/education   | Update education section
| PUT    | /api/resume/skills      | Update skills section
| PUT    | /api/resume/projects    | Update projects section

### Notes Endpoints

| Method | Endpoint        | Description 
|--------|-----------------|------------------------------------
| GET    | /api/notes/     | Retrieve all notes for current user
| POST   | /api/notes/     | Create a new note 
| GET    | /api/notes/{id} | Retrieve a specific note by ID
| PUT    | /api/notes/{id} | Update an existing note
| DELETE | /api/notes/{id} | Delete a note

### Calendar Endpoints

| Method | Endpoint                    | Description 
|--------|-----------------------------|--------------
| GET    | /api/calendar/connect       | Initiate Google OAuth flow 
| GET    | /api/calendar/status        | Check calendar connection status
| POST   | /api/calendar/sync/job/{id} | Synchronize job dates to calendar
| DELETE | /api/calendar/disconnect    | Disconnect Google Calendar

### External Jobs Endpoints

| Method | Endpoint                             | Description 
|--------|--------------------------------------|-------------
| GET    | /api/external/jobs/suggested-matches | Retrieve AI-suggested job matches

## Troubleshooting

### Common Errors and Solutions

#### Backend Server Fails to Start

Error: `ModuleNotFoundError: No module named 'fastapi'`

Solution: Ensure the virtual environment is activated and dependencies are installed:
```
cd backend
venv\Scripts\activate
pip install -r requirements.txt
```

#### Database Connection Error

Error: `sqlalchemy.exc.OperationalError: unable to open database file`

Solution: Ensure you are running the server from the correct directory:
```
cd backend/app
uvicorn main:app --reload
```

#### CORS Error in Browser Console

Error: `Access to fetch at 'http://localhost:8000' from origin 'http://localhost:5173' has been blocked by CORS policy`

Solution: Ensure the backend server is running on port 8000. The CORS configuration allows requests from localhost:5173.

#### Gemini API Key Error

Error: `GEMINI_API_KEY environment variable is not set`

Solution: Create a `.env` file in the `backend/` directory with your Gemini API key:
```
GEMINI_API_KEY=your_actual_api_key
```

#### Google Calendar Connection Failed

Error: `calendar_error=true in URL after OAuth redirect`

Solution: 
1. Verify Google OAuth credentials are correctly configured in `.env`
2. Ensure the redirect URI matches exactly: `http://localhost:8000/api/calendar/oauth2callback`
3. Enable the Google Calendar API in Google Cloud Console

#### Frontend Build Errors

Error: `npm ERR! ERESOLVE unable to resolve dependency tree`

Solution: Clear npm cache and reinstall:
```
cd frontend
rm -rf node_modules package-lock.json
npm install
```

#### Resume PDF Export Not Working

Error: PDF preview shows blank or fails to generate

Solution: Use Chrome or Edge browser for best compatibility. Firefox may have issues with certain PDF generation features.

#### External Job Suggestions Loading Slowly

Error: Job suggestions take a long time to load or timeout

Solution: The Remotive API has rate limits. Wait a few minutes and try again. This is a known limitation of the external API.

## Acknowledgements

### Technologies and Libraries

This project was built using the following open-source technologies:

Backend:
- FastAPI (https://fastapi.tiangolo.com/) - Python web framework
- SQLAlchemy (https://www.sqlalchemy.org/) - Database ORM
- Pydantic (https://pydantic.dev/) - Data validation
- python-jose (https://github.com/mpdavis/python-jose) - JWT token handling
- passlib (https://passlib.readthedocs.io/) - Password hashing

Frontend:
- React (https://react.dev/) - UI library
- Vite (https://vitejs.dev/) - Build tool
- Tailwind CSS (https://tailwindcss.com/) - CSS framework
- Radix UI (https://www.radix-ui.com/) - Accessible components
- Lucide React (https://lucide.dev/) - Icon library

External APIs:
- Google Gemini AI (https://ai.google.dev/) - Job description parsing
- Google Calendar API (https://developers.google.com/calendar) - Calendar integration
- Remotive API (https://remotive.com/) - Remote job listings

### AI Disclaimer

This project incorporates artificial intelligence in the following ways:

1. Google Gemini AI Integration: The application uses Google Gemini AI (gemini-2.5-flash model) to parse unstructured job description text and extract structured data including job title, company name, location, salary, and requirements. The AI processing occurs server-side through the `/api/jobs/parse` endpoint.

2. AI-Assisted Development: Portions of this codebase were developed with assistance from GitHub Copilot, an AI pair programming tool. The AI assistance was used for:
   - Code completion and suggestions
   - Documentation generation
   - Bug identification and resolution
   - Code refactoring recommendations

All AI-generated code was reviewed, tested, and validated by the development team before inclusion in the final product. The development team maintains full responsibility for the functionality, security, and quality of the application.

### Course Information

This project was developed as part of CSCI 6180 Software Development course. The application demonstrates full-stack web development principles including:

- RESTful API design
- Database modeling and ORM usage
- Frontend state management
- Authentication and authorization
- Third-party API integration
- AI/ML integration in web applications

### Team

Developed by the CSCI 6180 Software Development team.

## License

This project was created for educational purposes as part of CSCI 6180 Software Development course at the University.
