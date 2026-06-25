# 🚀 Deployment Guide - Fourways International Trading

## Why GitHub Pages Doesn't Work

GitHub Pages only serves **static files** and cannot:
- ❌ Run Node.js servers
- ❌ Connect to MongoDB databases  
- ❌ Handle API endpoints
- ❌ Process file uploads
- ❌ Manage authentication

## ✅ Recommended: Deploy to Render.com

### Step 1: Prepare Your Repository

1. **Push to GitHub** (if not already done):
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Ensure your `.env` file is NOT committed** (it should be in `.gitignore`)

### Step 2: Deploy to Render.com

1. **Sign up** at [render.com](https://render.com)
2. **Connect your GitHub** repository
3. **Create a Web Service**:
   - **Name**: `fourways-international-trading`
   - **Environment**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Root Directory**: Leave empty (or set to `/`)

### Step 3: Set Environment Variables

In Render dashboard, add these environment variables:

```
NODE_ENV=production
PORT=10000
MONGODB_ATLAS_URI=mongodb+srv://p59050352_db_user:keerthivasan@cluster0.boime9a.mongodb.net/nature_care_impex?retryWrites=true&w=majority
OWNER_USERNAME=admin
OWNER_PASSWORD=2025
```

### Step 4: Update Server Configuration

Your server is already configured correctly! The `server.js` file serves static files from the parent directories.

### Step 5: Access Your Deployed App

After deployment, your app will be available at:
- **Main Website**: `https://your-app-name.onrender.com`
- **Owner Portal**: `https://your-app-name.onrender.com/owner`
- **API**: `https://your-app-name.onrender.com/api/health`

## 🔧 Alternative: Railway.app

1. Sign up at [railway.app](https://railway.app)
2. Connect GitHub repository
3. Add environment variables
4. Deploy automatically

## 🔧 Alternative: Vercel (Serverless)

For Vercel, you'd need to convert to serverless functions, which requires code restructuring.

## 📊 Current Status

✅ **Your app is ready for deployment!**
- MongoDB Atlas connection configured
- Environment variables set up
- Static file serving configured
- API endpoints working
- Database initialized

## 🎯 Next Steps

1. Choose a deployment platform (Render.com recommended)
2. Follow the deployment steps above
3. Test the deployed application
4. Update any hardcoded localhost URLs if needed

Your Fourways International Trading platform will then be accessible worldwide! 🌍