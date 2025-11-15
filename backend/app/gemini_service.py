import google.generativeai as genai
import json
import re
from typing import Dict, Optional, List
from datetime import datetime

# Configure Gemini API
GEMINI_API_KEY = "AIzaSyDk4asC5eKrWvfIf-_OKmipgainJwdBlZI"
genai.configure(api_key=GEMINI_API_KEY)

def parse_job_description(text: str) -> Dict:
    """
    Parse unstructured job description text using Google Gemini API
    and extract structured job information.
    """
    try:
        model = genai.GenerativeModel('gemini-pro')
        
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

        response = model.generate_content(prompt)
        
        # Extract JSON from response
        response_text = response.text.strip()
        
        # Remove markdown code blocks if present
        if response_text.startswith("```"):
            response_text = re.sub(r'^```(?:json)?\s*', '', response_text, flags=re.MULTILINE)
            response_text = re.sub(r'\s*```\s*$', '', response_text, flags=re.MULTILINE)
        
        # Parse JSON
        parsed_data = json.loads(response_text)
        
        # Ensure required fields
        if 'title' not in parsed_data or not parsed_data['title']:
            parsed_data['title'] = 'Unknown Position'
        if 'company' not in parsed_data or not parsed_data['company']:
            parsed_data['company'] = 'Unknown Company'
        
        # Ensure requirements is a list
        if 'requirements' not in parsed_data:
            parsed_data['requirements'] = []
        elif isinstance(parsed_data['requirements'], str):
            # If requirements is a string, try to split it
            parsed_data['requirements'] = [r.strip() for r in parsed_data['requirements'].split(',') if r.strip()]
        
        # Clean up empty strings
        for key in ['location', 'work_location', 'type', 'salary', 'description']:
            if key in parsed_data and parsed_data[key] == '':
                parsed_data[key] = None
        
        return {
            'success': True,
            'data': parsed_data
        }
        
    except json.JSONDecodeError as e:
        return {
            'success': False,
            'error': f'Failed to parse JSON response: {str(e)}',
            'raw_response': response_text if 'response_text' in locals() else None
        }
    except Exception as e:
        return {
            'success': False,
            'error': f'Error parsing job description: {str(e)}'
        }

