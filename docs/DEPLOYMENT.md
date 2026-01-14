# Deployment Guide for TaskFlow

## Overview

TaskFlow consists of two parts that need to be deployed separately:
1. **Frontend** (React/Vite) → Deploy to Netlify or Vercel
2. **Backend** (Node.js/Express) → Deploy to Vercel, Render, or Railway

---

## Option 1: Deploy to Vercel (Recommended)

Vercel can host both frontend and backend.

### Step 1: Push to GitHub

First, push your code to a GitHub repository:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - TaskFlow Task Management System"

# Add your GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/taskflow.git

# Push to GitHub
git push -u origin main
```

### Step 2: Deploy Backend to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: `server`
   - **Build Command**: (leave empty)
   - **Output Directory**: (leave empty)

5. Add Environment Variables:
   ```
   JWT_SECRET = your-super-secret-jwt-key-production-2024
   JWT_EXPIRES_IN = 7d
   NODE_ENV = production
   ```

6. Click "Deploy"
7. Note your backend URL (e.g., `https://taskflow-api.vercel.app`)

### Step 3: Deploy Frontend to Vercel

1. Click "Add New" → "Project" again
2. Import the same repository
3. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. Add Environment Variables:
   ```
   VITE_API_URL = https://your-backend-url.vercel.app/api
   ```

5. Click "Deploy"
6. Your frontend will be live at your Vercel URL!

---

## Option 2: Deploy Frontend to Netlify + Backend to Render

### Deploy Frontend to Netlify

1. Go to [netlify.com](https://netlify.com) and sign in with GitHub
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select your repository
4. Configure:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `client/dist`

5. Add Environment Variables (Site settings → Environment variables):
   ```
   VITE_API_URL = https://your-backend-url.onrender.com/api
   ```

6. Click "Deploy site"

### Deploy Backend to Render

1. Go to [render.com](https://render.com) and sign in
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: taskflow-api
   - **Root Directory**: server
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

5. Add Environment Variables:
   ```
   JWT_SECRET = your-super-secret-jwt-key-production-2024
   JWT_EXPIRES_IN = 7d
   NODE_ENV = production
   ```

6. Click "Create Web Service"

---

## Option 3: Deploy Both to Railway

Railway is great for full-stack apps with databases.

1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository

### For Backend:
1. Click "Add Service" → "GitHub Repo"
2. Set Root Directory to `server`
3. Add environment variables in the Variables tab

### For Frontend:
1. Click "Add Service" → "GitHub Repo"  
2. Set Root Directory to `client`
3. Add `VITE_API_URL` pointing to your backend service

---

## Important Notes

### Update CORS Settings for Production

Before deploying, update the CORS origin in `server/index.js` to include your production URLs:

```javascript
app.use(cors({
  origin: [
    'https://your-frontend-url.vercel.app',
    'https://your-frontend-url.netlify.app',
    'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Database Persistence

**Important**: The current SQLite setup stores data in memory/file which gets reset on serverless deployments. For production, consider:

1. **MongoDB Atlas** (Free tier available)
2. **PostgreSQL on Supabase** (Free tier available)
3. **PlanetScale** (MySQL, free tier available)

### Environment Variables Checklist

**Backend (.env):**
```
PORT=5000
NODE_ENV=production
JWT_SECRET=your-very-long-secure-random-string-min-32-characters
JWT_EXPIRES_IN=7d
```

**Frontend (.env):**
```
VITE_API_URL=https://your-backend-url/api
```

---

## Quick Deploy Commands

### Vercel CLI (Alternative)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy backend
cd server
vercel --prod

# Deploy frontend
cd ../client
vercel --prod
```

### Netlify CLI (Alternative)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy frontend
cd client
npm run build
netlify deploy --prod --dir=dist
```

---

## Troubleshooting

### CORS Errors
- Ensure your frontend URL is in the CORS origin list
- Check that the API URL in frontend .env doesn't have a trailing slash

### 404 Errors on Refresh
- Vercel/Netlify config files handle SPA routing
- Make sure `vercel.json` or `netlify.toml` is in the client folder

### API Connection Issues
- Verify the `VITE_API_URL` is correct
- Check backend logs for errors
- Ensure JWT_SECRET matches between environments

### Build Failures
- Check Node.js version compatibility
- Ensure all dependencies are in package.json
- Check for TypeScript/ESLint errors
