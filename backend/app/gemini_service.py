import json
import re
import logging
import os
from typing import Dict, Optional, List
from datetime import datetime
from dotenv import load_dotenv
from google import genai

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Configure Gemini API using SDK
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")  # Default to gemini-2.5-flash if not set

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable is not set. Please check your .env file.")

# Initialize client
client = genai.Client(
    vertexai=True,
    api_key=GEMINI_API_KEY,
)

logger.info("Gemini API configured successfully")
logger.info(f"Using model: {MODEL}")

def parse_job_description(text: str) -> Dict:
    """
    Parse unstructured job description text using Google Gemini API
    and extract structured job information.
    """
    try:
        logger.info("Starting job description parsing")
        logger.debug(f"Input text length: {len(text)} characters")
        
        prompt = f"""Parse the following job description and extract structured information. 
Return ONLY a valid JSON object with the following fields:
- title: Job title (required)
- company: Company name (required)
- location: Job location if mentioned
- work_location: Remote/Hybrid/On-site if mentioned
- type: Employment type (Full-time, Part-time, Contract, etc.) if mentioned
- salary: Salary range or amount if mentioned
- description: Brief description of the role
- requirements: Array of requirement strings (extract key requirements, skills, qualifications)

Job Description:
{text}

Return ONLY the JSON object, no additional text or markdown formatting."""

        logger.info("Sending request to Gemini API")
        
        # Stream the response
        full_response_text = ""
        
        for chunk in client.models.generate_content_stream(
            model=MODEL,
            contents=[{"role": "user", "parts": [{"text": prompt}]}],
        ):
            logger.debug(f"Received chunk: {chunk}")
            if chunk.candidates and chunk.candidates[0].content and chunk.candidates[0].content.parts:
                chunk_text = chunk.text
                if chunk_text:
                    full_response_text += chunk_text
                    logger.debug(f"Chunk text: {chunk_text[:100]}...")
        
        logger.info(f"Received full response, length: {len(full_response_text)}")
        logger.debug(f"Full response: {full_response_text[:500]}...")
        
        if not full_response_text:
            logger.error("Empty response from API")
            return {'success': False, 'error': 'Empty response from API'}
        
        # Remove markdown code blocks if present
        response_text = full_response_text.strip()
        if response_text.startswith("```"):
            logger.debug("Removing markdown code blocks from response")
            response_text = re.sub(r'^```(?:json)?\s*', '', response_text, flags=re.MULTILINE)
            response_text = re.sub(r'\s*```\s*$', '', response_text, flags=re.MULTILINE)
        
        logger.debug(f"Cleaned response text: {response_text[:200]}...")
        
        # Parse JSON
        logger.info("Parsing JSON response")
        parsed_data = json.loads(response_text)
        logger.info(f"Successfully parsed JSON with keys: {list(parsed_data.keys())}")
        
        # Ensure required fields
        if 'title' not in parsed_data or not parsed_data['title']:
            logger.warning("Title field missing or empty, setting to 'Unknown Position'")
            parsed_data['title'] = 'Unknown Position'
        if 'company' not in parsed_data or not parsed_data['company']:
            logger.warning("Company field missing or empty, setting to 'Unknown Company'")
            parsed_data['company'] = 'Unknown Company'
        
        # Ensure requirements is a list
        if 'requirements' not in parsed_data:
            logger.debug("Requirements field missing, initializing as empty list")
            parsed_data['requirements'] = []
        elif isinstance(parsed_data['requirements'], str):
            logger.debug("Converting requirements string to list")
            # If requirements is a string, try to split it
            parsed_data['requirements'] = [r.strip() for r in parsed_data['requirements'].split(',') if r.strip()]
        
        # Clean up empty strings
        for key in ['location', 'work_location', 'type', 'salary', 'description']:
            if key in parsed_data and parsed_data[key] == '':
                logger.debug(f"Cleaning up empty field: {key}")
                parsed_data[key] = None
        
        logger.info("Job description parsing completed successfully")
        return {
            'success': True,
            'data': parsed_data
        }
        
    except json.JSONDecodeError as e:
        logger.error(f"JSON decode error: {str(e)}")
        logger.error(f"Response text was: {full_response_text if 'full_response_text' in locals() else 'N/A'}")
        return {
            'success': False,
            'error': f'Failed to parse JSON response: {str(e)}',
            'raw_response': full_response_text if 'full_response_text' in locals() else None
        }
    except Exception as e:
        logger.exception(f"Exception during job description parsing: {str(e)}")
        return {
            'success': False,
            'error': f'Error parsing job description: {str(e)}'
        }

