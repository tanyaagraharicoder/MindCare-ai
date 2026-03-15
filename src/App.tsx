import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';
import { Sidebar } from './components/Sidebar';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { ChatPage } from './pages/ChatPage';
import { MoodTrackerPage } from './pages/MoodTrackerPage';
import { MeditationPage } from './pages/MeditationPage';
import { ProfilePage } from './pages/ProfilePage';
import { Settings } from './pages/Settings';
import { AuthPage } from './pages/AuthPage';
import { Loader2, Menu } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-slate-500 font-medium animate-pulse">Preparing your safe space...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {user && (
        <>
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <header className="lg:hidden fixed top-0 left-0 right-0 h-20 glass z-40 px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg">
                <span className="font-black">M</span>
              </div>
              <h1 className="font-black text-xl tracking-tighter uppercase">MindCare</h1>
            </div>
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <Menu size={24} />
            </button>
          </header>
        </>
      )}

      <main className={`flex-1 transition-all duration-500 ${user ? 'lg:ml-72' : ''}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="h-full"
          >
            <Routes location={location}>
              <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Home />} />
              <Route path="/auth" element={user ? <Navigate to="/dashboard" /> : <AuthPage />} />
              
              <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/auth" />} />
              <Route path="/chat" element={user ? <ChatPage /> : <Navigate to="/auth" />} />
              <Route path="/mood" element={user ? <MoodTrackerPage /> : <Navigate to="/auth" />} />
              <Route path="/meditation" element={user ? <MeditationPage /> : <Navigate to="/auth" />} />
              <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/auth" />} />
              <Route path="/settings" element={user ? <Settings /> : <Navigate to="/auth" />} />
              
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
