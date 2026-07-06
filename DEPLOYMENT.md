# Deployment Guide

## Deploy to Vercel (Recommended)

1. Go to https://vercel.com
2. Sign in with your GitHub account
3. Click "Add New Project"
4. Import `maheenali021/Scidiscovery-frontend`
5. Vercel will auto-detect Next.js settings
6. Click "Deploy"
7. Your site will be live at: `https://scidiscovery-frontend.vercel.app`

## Deploy to Netlify

1. Go to https://netlify.com
2. Click "Add new site" → "Import from Git"
3. Select your GitHub repository
4. Build command: `npm run build`
5. Publish directory: `.next`
6. Click "Deploy"

## Deploy to GitHub Pages

GitHub Pages doesn't support Next.js server features by default.
You need to export as static:

1. Update `next.config.ts`:
   ```typescript
   const nextConfig = {
     output: 'export',
     images: { unoptimized: true }
   };
   ```

2. Add to `package.json` scripts:
   ```json
   "export": "next build && next export"
   ```

3. Build and deploy:
   ```bash
   npm run export
   gh-pages -d out
   ```

## Environment Variables

No environment variables needed - backend URL is hardcoded to:
`https://maheenalishah-scidiscovery-ai.hf.space`

## Update Deployment

```bash
git add .
git commit -m "Update: description of changes"
git push origin main
```

Vercel/Netlify will auto-deploy on push.
