# MyCareer Backend

## Setup & Run Instructions

1. **Create and activate virtual environment:**
   ```sh
   python3 -m venv venv
   source venv/bin/activate
   ```

2. **Install dependencies:**
   ```sh
   pip install 'fastapi[all]' sqlalchemy alembic pydantic 'passlib[bcrypt]' python-dotenv python-jose
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

