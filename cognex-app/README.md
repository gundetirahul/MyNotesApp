# Cognex - Your Second Brain

A powerful personal knowledge management (PKM) application built with React, TypeScript, and Firebase. Cognex helps you capture, organize, and connect your thoughts, notes, and ideas in a beautiful, intuitive interface.

## 🚀 Features

### Phase 1 (MVP) - ✅ Complete
- **Clean Three-Column Layout**: Navigation sidebar, main content area, and context panel
- **Card-Based Notes**: Create, edit, and delete atomic note cards
- **Markdown Support**: Rich text formatting with Markdown syntax
- **Daily Organization**: Calendar view to organize notes by date
- **Tagging System**: Add tags to organize and categorize your notes
- **Collections**: Organize notes with custom collections and filters
- **Real-time Sync**: Firebase integration for instant synchronization
- **Authentication**: Anonymous and email-based authentication
- **Search**: Global search across all your notes
- **Dark Mode Ready**: Built with dark mode support

### Upcoming Features (Phase 2)
- Rich content support (checklists, code blocks, images)
- Custom collections with advanced filters
- Enhanced search with filters and sorting
- Context panel with metadata and related notes
- Social authentication (Google, GitHub)

### Future Features (Phase 3)
- Real-time collaboration
- Bi-directional linking ([[Note Title]] syntax)
- Graph view of connected notes
- AI-powered features (smart tagging, summarization)
- Reminders and due dates

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Zustand
- **Backend**: Firebase (Firestore, Authentication, Storage)
- **Markdown**: react-markdown with remark-gfm
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 📋 Prerequisites

- Node.js 16+ 
- npm or yarn
- Firebase project (see setup instructions below)

## 🔧 Installation & Setup

### 1. Clone and Install Dependencies

```bash
cd cognex-app
npm install
```

### 2. Firebase Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable the following services:
   - **Authentication**: Enable Anonymous and Email/Password providers
   - **Firestore Database**: Create in production mode
   - **Storage**: Enable for file uploads (optional)

4. Get your Firebase configuration:
   - Go to Project Settings > General
   - Scroll down to "Your apps" section
   - Click on the web app icon or "Add app" if none exists
   - Copy the configuration object

5. Update the environment variables:
   ```bash
   # Update .env.local with your Firebase config
   REACT_APP_FIREBASE_API_KEY=your_api_key_here
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```

### 3. Firestore Security Rules

Set up the following security rules in Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 4. Run the Application

```bash
npm start
```

The app will open at `http://localhost:3000`

## 📱 Usage

### Getting Started
1. **Sign In**: Choose anonymous sign-in for quick start or create an account
2. **Create Your First Card**: Click the "+" button to create your first note
3. **Organize**: Use tags and collections to organize your notes
4. **Search**: Use the search bar to find specific notes
5. **Daily View**: Use the calendar to view notes by date

### Creating Cards
- Click the "New Card" button or press the "+" icon
- Add a title (optional) and content using Markdown
- Set a target date for organization
- Add tags for categorization
- Save to create the card

### Organization
- **Daily View**: Select dates from the calendar to view notes for specific days
- **Collections**: Create custom collections with filters
- **Tags**: Add tags to notes and filter by them
- **Search**: Use the search bar to find notes by content or tags

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── Auth.tsx        # Authentication component
│   ├── Card.tsx        # Individual card component
│   ├── MainContent.tsx # Main content area
│   ├── NoteEditor.tsx  # Note editing modal
│   └── Sidebar.tsx     # Navigation sidebar
├── firebase/           # Firebase configuration
│   └── config.ts       # Firebase setup
├── hooks/              # Custom React hooks
│   └── useFirebase.ts  # Firebase operations hook
├── services/           # Service layer
│   └── firebase.ts     # Firebase CRUD operations
├── store/              # State management
│   └── index.ts        # Zustand store
├── types/              # TypeScript types
│   └── index.ts        # Application types
└── App.tsx             # Main application component
```

## 🎨 Design System

The app uses a custom design system built on Tailwind CSS:

- **Colors**: Primary (blue) and dark theme support
- **Typography**: Inter font family with multiple weights
- **Components**: Consistent spacing, borders, and interactive states
- **Responsive**: Mobile-first responsive design

## 🔒 Security

- User data is completely private and isolated per user
- Firebase security rules ensure users can only access their own data
- Authentication required for all operations
- Anonymous users get a unique identifier for their session

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Netlify
1. Build the project: `npm run build`
2. Upload the `build` folder to Netlify
3. Configure environment variables
4. Set up continuous deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Supernotes and other PKM tools
- Built with the amazing React and Firebase ecosystems
- UI components inspired by modern design systems

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Join our community discussions

---

**Happy note-taking! 🧠✨**