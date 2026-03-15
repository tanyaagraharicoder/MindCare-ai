# MindCare AI - Mental Health Support Platform

MindCare AI is a comprehensive mental health support web application built with React, Node.js, and Google's Gemini AI. It provides a safe space for users to track their moods, practice guided meditation, and receive empathetic AI support.

## Features

- **AI Support Chat**: Compassionate AI companion for empathetic listening and support.
- **Mood Tracker**: Log and visualize emotional patterns over time.
- **Meditation Timer**: Guided breathing exercises with customizable techniques and soundscapes.
- **User Profile**: Personalized experience with profile picture upload and wellness stats.
- **Modern UI**: Glassmorphism design, smooth animations, and responsive layout.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express, Gemini API.
- **Database/Auth**: Firebase Firestore & Authentication.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Extract the ZIP file and open the folder in VS Code.
2. Install dependencies:
   ```bash
   npm install
   ```

### Configuration

1. Create a `.env` file in the root directory (use `.env.example` as a template).
2. Add your **Gemini API Key** to `GEMINI_API_KEY`.
3. (Optional) Add your Firebase configuration if running outside of AI Studio.

### Running the App

1. Start the full-stack application (Vite + Express):
   ```bash
   npm run dev
   ```
2. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `server.ts`: Express server and AI integration.
- `src/App.tsx`: Main routing and layout.
- `src/pages/`: Individual feature pages.
- `src/firebase.ts`: Firebase SDK initialization.
- `src/index.css`: Tailwind CSS and global styles.

## License

Made by Tanya Agarahari.
