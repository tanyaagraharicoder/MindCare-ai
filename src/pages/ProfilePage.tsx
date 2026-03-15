import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Calendar, 
  Activity, 
  Wind, 
  Camera, 
  Edit3, 
  LogOut,
  Loader2,
  CheckCircle2,
  Save,
  AlertCircle
} from 'lucide-react';
import { auth, db } from '../firebase';
import { signOut, updateProfile } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';

export function ProfilePage() {
  const user = auth.currentUser;
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [stats, setStats] = useState({
    moods: 0,
    chats: 0,
    days: 1
  });

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      try {
        const moodQ = query(collection(db, 'moods'), where('userId', '==', user.uid));
        const chatQ = query(collection(db, 'chats'), where('userId', '==', user.uid));
        
        const moodSnap = await getDocs(moodQ);
        const chatSnap = await getDocs(chatQ);

        setStats({
          moods: moodSnap.size,
          chats: chatSnap.size,
          days: 1 // Placeholder
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };

    fetchStats();
  }, [user]);

  const handleSignOut = () => {
    signOut(auth);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsUpdating(true);
    setMessage(null);

    try {
      await updateProfile(user, {
        displayName: displayName
      });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'Failed to update profile.' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Check file size (limit to 1MB for base64 storage in auth profile)
    if (file.size > 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image must be smaller than 1MB.' });
      return;
    }

    setIsUploading(true);
    setMessage(null);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      try {
        await updateProfile(user, {
          photoURL: base64String
        });
        setMessage({ type: 'success', text: 'Profile picture updated!' });
      } catch (error) {
        console.error('Error uploading photo:', error);
        setMessage({ type: 'error', text: 'Failed to upload photo.' });
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      {/* Profile Header */}
      <header className="relative">
        <div className="h-48 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-[3rem] border border-white/20 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        </div>
        <div className="px-8 -mt-16 flex flex-col md:flex-row items-center md:items-end gap-6">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="relative group"
          >
            <div className="w-32 h-32 bg-white rounded-[2.5rem] p-2 shadow-2xl border border-white/50 overflow-hidden">
              {isUploading ? (
                <div className="w-full h-full flex items-center justify-center bg-slate-100 rounded-[2rem]">
                  <Loader2 className="animate-spin text-primary" size={32} />
                </div>
              ) : user?.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover rounded-[2rem]" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-100 rounded-[2rem] text-slate-300">
                  <User size={48} />
                </div>
              )}
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-2 right-2 p-3 bg-primary text-white rounded-2xl shadow-xl hover:scale-110 transition-all active:scale-95"
            >
              <Camera size={18} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*"
            />
          </motion.div>
          <div className="flex-1 text-center md:text-left pb-4">
            <h1 className="text-4xl font-black tracking-tighter">{user?.displayName || 'MindCare User'}</h1>
            <p className="text-slate-500 font-medium flex items-center justify-center md:justify-start gap-2">
              <Mail size={14} />
              {user?.email}
            </p>
          </div>
          <button 
            onClick={handleSignOut}
            className="mb-4 btn-secondary flex items-center gap-2 text-red-500 border-red-100 hover:bg-red-50"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Stats Section */}
        <div className="md:col-span-1 space-y-6">
          <section className="glass p-8 rounded-[2.5rem] space-y-6">
            <h3 className="font-black text-xs uppercase tracking-widest text-slate-400">Wellness Stats</h3>
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
              className="space-y-6"
            >
              <motion.div 
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0 }
                }}
                className="flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500">
                  <Activity size={24} />
                </div>
                <div>
                  <p className="text-2xl font-black">{stats.moods}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mood Logs</p>
                </div>
              </motion.div>
              <motion.div 
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0 }
                }}
                className="flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500">
                  <Wind size={24} />
                </div>
                <div>
                  <p className="text-2xl font-black">{stats.days}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Day Streak</p>
                </div>
              </motion.div>
              <motion.div 
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0 }
                }}
                className="flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <p className="text-2xl font-black">{stats.chats}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">AI Sessions</p>
                </div>
              </motion.div>
            </motion.div>
          </section>
        </div>

        {/* Settings Section */}
        <div className="md:col-span-2 space-y-8">
          <section className="glass p-10 rounded-[3rem] space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <Edit3 size={20} />
              </div>
              <h2 className="text-2xl font-black tracking-tight">Profile Settings</h2>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Display Name</label>
                <input 
                  type="text" 
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="input-field"
                  placeholder="Your Name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Bio</label>
                <textarea 
                  className="input-field min-h-[120px] resize-none"
                  placeholder="Tell us a bit about yourself..."
                />
              </div>

              {message && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-2xl flex items-center gap-3 ${
                    message.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                  }`}
                >
                  {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                  <span className="text-sm font-bold">{message.text}</span>
                </motion.div>
              )}

              <button 
                type="submit" 
                disabled={isUpdating}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {isUpdating ? <Loader2 className="animate-spin" /> : (
                  <>
                    <Save size={20} />
                    Save Changes
                  </>
                )}
              </button>
            </form>
          </section>
        </div>
      </div>
      
      <footer className="text-center py-8">
        <p className="text-slate-400 font-medium">Made by Tanya Agarahari</p>
      </footer>
    </div>
  );
}

const MessageSquare = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
