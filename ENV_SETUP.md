# Environment Variables Setup

## For Developers

1. Copy the example environment file:
```bash
cp backend/.env.example backend/.env
```

2. Edit `backend/.env` and add your actual API keys:
```
GEMINI_API_KEY=your_actual_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

3. **Important**: Never commit the `.env` file to git. It's already in `.gitignore`.

## Getting API Keys

- **Google Gemini API Key**: https://aistudio.google.com/app/apikey

## Security Best Practices

- ✅ `.env` files are automatically ignored by git (see `.gitignore`)
- ✅ `.env.example` is committed as a template for other developers
- ✅ Always use environment variables for sensitive data (API keys, passwords, etc.)
- ✅ Never hardcode secrets in your source code
