# Use the official Python image (3.11-slim for a lighter image)
FROM python:3.11-slim

# Set the working directory inside the container
WORKDIR /backend

# Copy the requirements file into the container
COPY requirements.txt .

# Upgrade pip and install Python dependencies
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy the rest of your application code into the container
COPY . .
WORKDIR /backend/app

# Expose the port on which your FastAPI app will run
EXPOSE 8000

# Command to run the FastAPI application using Gunicorn with Uvicorn workers
CMD ["gunicorn", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000", "main:app"]
