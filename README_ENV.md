# Environment Variables for Frontend

## Setup for Render Deployment

When deploying on Render, set this environment variable:

**Key:** `VITE_API_URL`  
**Value:** `https://your-backend-url.onrender.com`

For example:
```
VITE_API_URL=https://fakenewsdetector-backend.onrender.com
```

## Local Development

For local development, create `.env.local` file (this file is gitignored):

```
VITE_API_URL=http://localhost:8000
```

Or use the default fallback (hardcoded in code): `http://localhost:8000`

