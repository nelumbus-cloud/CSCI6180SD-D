# MyCareer Backend

## Environment Setup

Before running the application, you need to set up environment variables for the Gemini API:

1. **Copy the example environment file:**
   ```sh
   cp .env.example .env
   ```

2. **Add your API key to `.env`:**
   - Get your Google Gemini API key from: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
   - Open `backend/.env` and add your key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   GEMINI_MODEL=gemini-2.5-flash
   ```

3. **Important Security Note:**
   - ⚠️ **Never commit the `.env` file to git** - it's already in `.gitignore`
   - `.env.example` is the template that should be committed

## Setup & Run Instructions

1. **Create and activate virtual environment:**
   ```sh
   python3 -m venv venv
   source venv/bin/activate
   ```

2. **Install dependencies:**
   ```sh
   pip install -r requirements.txt
   ```

3. **Seed the database:**
   ```sh
   python seed.py
   ```
   (You may see warnings about bcrypt and datetime, but seed data will be inserted.)

4. **Run the FastAPI server:**
   ```sh
   uvicorn app.main:app --reload --port 8000
   ```

- API docs available at: [http://localhost:8000/docs](http://localhost:8000/docs)
- OpenAPI schema: [http://localhost:8000/openapi.json](http://localhost:8000/openapi.json)


