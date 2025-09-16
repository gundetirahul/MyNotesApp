# 🚀 Quick Setup Guide for Cognex

Follow these steps to get Cognex running on your local machine:

## 1. Prerequisites

- **Node.js 16+**: [Download here](https://nodejs.org/)
- **Firebase Account**: [Create account](https://firebase.google.com/)
- **Git**: [Download here](https://git-scm.com/)

## 2. Firebase Project Setup

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `cognex-pkm` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

### Step 2: Enable Authentication
1. In Firebase Console, go to "Authentication" > "Get started"
2. Go to "Sign-in method" tab
3. Enable these providers:
   - **Anonymous**: Click on it and toggle "Enable"
   - **Email/Password**: Click on it and toggle "Enable"

### Step 3: Create Firestore Database
1. Go to "Firestore Database" > "Create database"
2. Choose "Start in production mode"
3. Select your preferred location
4. Click "Done"

### Step 4: Set Security Rules
1. In Firestore, go to "Rules" tab
2. Replace the rules with:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      match /cards/{cardId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      match /collections/{collectionId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```
3. Click "Publish"

### Step 5: Get Firebase Configuration
1. Go to "Project Settings" (gear icon)
2. Scroll to "Your apps" section
3. Click the web icon `</>`
4. Register app with nickname: `cognex-web`
5. Copy the `firebaseConfig` object

## 3. Local Development Setup

### Step 1: Install Dependencies
```bash
cd cognex-app
npm install
```

### Step 2: Configure Environment
1. Open `.env.local` file
2. Replace the placeholder values with your Firebase config:
```env
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### Step 3: Start Development Server
```bash
npm start
```

The app should open at `http://localhost:3000`

## 4. First Time Usage

1. **Sign In**: Choose "Get Started (Anonymous)" for quick access
2. **Create First Card**: Click the "+" button
3. **Add Content**: Write your first note with Markdown support
4. **Add Tags**: Use tags like `#idea`, `#work`, `#personal`
5. **Organize**: Use the calendar to organize notes by date

## 5. Troubleshooting

### Common Issues

**Firebase Connection Error**
- Double-check your environment variables
- Ensure Firebase project has Authentication and Firestore enabled
- Check browser console for specific error messages

**Build Errors**
- Run `npm install` to ensure all dependencies are installed
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`, then run `npm install`

**Styling Issues**
- Ensure Tailwind CSS is properly configured
- Check if `tailwind.config.js` and `postcss.config.js` exist
- Restart the development server

### Getting Help

1. Check the [Issues](../../issues) section
2. Review Firebase Console for any configuration errors
3. Check browser developer tools for console errors

## 6. Production Deployment

### Vercel (Recommended)
1. Push code to GitHub repository
2. Connect repository to [Vercel](https://vercel.com/)
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Netlify
1. Run `npm run build`
2. Upload `build` folder to [Netlify](https://netlify.com/)
3. Configure environment variables
4. Set up continuous deployment

---

🎉 **You're all set!** Start building your second brain with Cognex!