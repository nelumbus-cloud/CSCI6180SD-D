# CareerHub - Job Application Tracker & Resume Builder

A full-stack web application to help job seekers manage their job search journey. Track applications, build professional resumes, sync with Google Calendar, and discover new opportunities — all in one place.

---

## What is CareerHub?

If you've ever applied to dozens of jobs and lost track of which ones you've heard back from, which interviews are coming up, or what version of your resume you sent — this app is for you.

CareerHub lets you:
- **Track your job applications** with status updates, deadlines, and notes
- **Build and manage your resume** with a clean, section-by-section editor
- **Sync important dates to Google Calendar** so you never miss an interview
- **Discover new job opportunities** from external job boards
- **Parse job descriptions with AI** to auto-fill application details (powered by Google Gemini)

---

## Tech Stack

### Backend
- **FastAPI** — Python web framework for building APIs
- **SQLAlchemy** — ORM for database operations
- **SQLite** — Lightweight database (easily swappable)
- **Google Gemini AI** — For parsing job descriptions
- **Google Calendar API** — For calendar integration

### Frontend
- **React 19** — UI library
- **Vite** — Fast build tool and dev server
- **Tailwind CSS 4** — Utility-first styling
- **Radix UI** — Accessible component primitives
- **Lucide React** — Beautiful icons

---

## Project Structure

```
CSCI6180SD-D/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app entry point
│   │   ├── models.py            # Database models (User, Job, Resume)
│   │   ├── database.py          # Database connection setup
│   │   ├── auth.py              # Authentication helpers
│   │   ├── auth_routes.py       # Login, signup, password reset
│   │   ├── job_routes.py        # CRUD for job applications
│   │   ├── resume_routes.py     # Resume builder API
│   │   ├── calendar_routes.py   # Google Calendar integration
│   │   ├── calendar_service.py  # Calendar sync logic
│   │   ├── job_parser_routes.py # AI job description parser
│   │   ├── gemini_service.py    # Google Gemini AI integration
│   │   └── external_jobs.py     # External job board integration
│   ├── requirements.txt         # Python dependencies
│   ├── Dockerfile               # Container setup
│   └── seed.py                  # Database seeder
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # Main app component
│   │   ├── Dashboard.jsx        # Main dashboard view
│   │   ├── components/
│   │   │   ├── Login.jsx        # Login form
│   │   │   ├── Signup.jsx       # Registration form
│   │   │   ├── JobCard.jsx      # Individual job display
│   │   │   ├── JobList.jsx      # Job listing grid
│   │   │   ├── JobFormModal.jsx # Add/edit job form
│   │   │   ├── ResumeBuilder.jsx # Resume editor
│   │   │   ├── ResumePreview.jsx # Resume PDF preview
│   │   │   ├── NewFeed.jsx      # External job listings
│   │   │   ├── Settings.jsx     # User settings & integrations
│   │   │   ├── DashboardSidebar.jsx # Upcoming interviews & suggestions
│   │   │   └── ui/              # Reusable UI components
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx  # Authentication state
│   │   └── services/
│   │       ├── authService.js   # Auth API calls
│   │       ├── jobService.js    # Job API calls
│   │       ├── resumeService.js # Resume API calls
│   │       └── calendarService.js # Calendar API calls
│   ├── package.json             # Node dependencies
│   └── vite.config.js           # Vite configuration
│
└── README.md                    # You're reading it!
```

---

## Getting Started

### Prerequisites
- **Python 3.11+** — for the backend
- **Node.js 18+** — for the frontend
- **Google Cloud Console account** — for Gemini AI and Calendar API (optional but recommended)

### 1. Clone the Repository

```bash
git clone https://github.com/nelumbus-cloud/CSCI6180SD-D.git
cd CSCI6180SD-D
```

### 2. Set Up the Backend

```bash
cd backend

# Create a virtual environment
python -m venv venv

# Activate it
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

#### Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Google Gemini AI (for job description parsing)
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash

# Session security
SESSION_SECRET_KEY=your-random-secret-key
AUTH_SECRET_KEY=your-jwt-secret-key

# Google Calendar OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:8000/api/calendar/oauth2callback

# Frontend URL (for redirects)
FRONTEND_URL=http://localhost:5173

# Environment
APP_ENV=development
```

> **Where to get API keys:**
> - **Gemini API Key**: [Google AI Studio](https://aistudio.google.com/app/apikey)
> - **Google OAuth Credentials**: [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials

#### Seed the Database (Optional)

```bash
python seed.py
```

This adds a test user and some sample job data.

#### Start the Backend Server

```bash
cd app
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`. Check out the interactive docs at `http://localhost:8000/docs`.

---

### 3. Set Up the Frontend

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will open at `http://localhost:5173`.

---

## Features

### 📋 Job Tracking
- Add jobs manually or paste a job description and let AI extract the details
- Track status: Applied, Interview, Offer, Rejected, etc.
- Set important dates: interview date, application deadline, follow-up reminders
- Search and filter your job list

### 📝 Resume Builder
- Clean, section-based editor: Personal Info, Experience, Education, Skills, Projects
- Auto-saves as you type (debounced to avoid excessive API calls)
- Preview your resume before downloading
- Export to PDF

### 📅 Google Calendar Integration
- Connect your Google account in Settings
- Sync interview dates, deadlines, and follow-ups to your calendar
- One-click "Add to Calendar" from the dashboard sidebar

### 🔍 Job Discovery
- Browse remote job listings from [Remotive](https://remotive.com/)
- Get personalized job suggestions based on your saved applications
- Save interesting jobs for later

### 🤖 AI-Powered Job Parsing
- Paste any job description into the "Add Job" form
- Click "Parse with AI" and Gemini extracts: title, company, location, salary, requirements
- Review and save — no more manual copying!

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Create a new account |
| POST | `/api/auth/token` | Log in and get a token |
| GET | `/api/auth/me` | Get current user info |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password with token |

### Jobs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs/` | Get all user's jobs |
| POST | `/api/jobs/` | Create a new job |
| GET | `/api/jobs/{id}` | Get a specific job |
| PUT | `/api/jobs/{id}` | Update a job |
| DELETE | `/api/jobs/{id}` | Delete a job |
| POST | `/api/jobs/parse` | Parse job description with AI |

### Resume
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/resume/` | Get user's resume |
| POST | `/api/resume/` | Create or update resume |
| PUT | `/api/resume/personal` | Update personal info section |
| PUT | `/api/resume/experience` | Update experience section |
| PUT | `/api/resume/education` | Update education section |
| PUT | `/api/resume/skills` | Update skills section |
| PUT | `/api/resume/projects` | Update projects section |

### Calendar
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/calendar/connect` | Start Google OAuth flow |
| GET | `/api/calendar/status` | Check if calendar is connected |
| POST | `/api/calendar/sync/job/{id}` | Sync a job's dates to calendar |
| DELETE | `/api/calendar/disconnect` | Disconnect Google Calendar |

### External Jobs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/external/jobs/suggested-matches` | Get AI-suggested jobs |

---

## Running with Docker

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
