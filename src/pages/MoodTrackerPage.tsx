import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Smile, 
  Meh, 
  Frown, 
  CloudRain, 
  Zap, 
  Heart, 
  Plus, 
  History,
  TrendingUp,
  Calendar,
  Trash2,
  Loader2,
  Sparkles
} from 'lucide-react';
import { auth, db } from '../firebase';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';

const MOODS = [
  { emoji: '😊', label: 'Happy', color: 'bg-yellow-100 text-yellow-600', intensity: 8 },
  { emoji: '😌', label: 'Calm', color: 'bg-blue-100 text-blue-600', intensity: 7 },
  { emoji: '😐', label: 'Neutral', color: 'bg-slate-100 text-slate-600', intensity: 5 },
  { emoji: '😔', label: 'Sad', color: 'bg-indigo-100 text-indigo-600', intensity: 3 },
  { emoji: '😫', label: 'Stressed', color: 'bg-orange-100 text-orange-600', intensity: 2 },
  { emoji: '😡', label: 'Angry', color: 'bg-red-100 text-red-600', intensity: 1 },
];

export function MoodTrackerPage() {
  const [selectedMood, setSelectedMood] = useState<any>(null);
  const [note, setNote] = useState('');
  const [moods, setMoods] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'moods'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const moodData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMoods(moodData);
    });

    return () => unsubscribe();
  }, [user]);

  const handleLogMood = async () => {
    if (!selectedMood || !user) return;
    setIsLoading(true);

    try {
      await addDoc(collection(db, 'moods'), {
        userId: user.uid,
        mood: selectedMood.label,
        emoji: selectedMood.emoji,
        intensity: selectedMood.intensity,
        note: note.trim(),
        timestamp: serverTimestamp()
      });
      setSelectedMood(null);
      setNote('');
    } catch (err) {
      console.error('Error logging mood:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMood = async (id: string) => {
    if (!window.confirm('Delete this mood entry?')) return;
    try {
      await deleteDoc(doc(db, 'moods', id));
    } catch (err) {
      console.error('Error deleting mood:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      {/* Header */}
      <header className="text-center space-y-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-md border border-white/20 text-primary font-bold text-sm"
        >
          <Sparkles size={16} />
          <span>Emotional Awareness</span>
        </motion.div>
        <h1 className="text-5xl font-black tracking-tighter">How are you <span className="text-primary">feeling?</span></h1>
        <p className="text-slate-500 font-medium">Tracking your emotions helps you understand your mental patterns.</p>
      </header>

      {/* Mood Selection */}
      <section className="glass p-8 rounded-[3rem] space-y-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {MOODS.map((mood) => (
            <motion.button
              key={mood.label}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedMood(mood)}
              className={`flex flex-col items-center gap-3 p-6 rounded-[2rem] transition-all duration-300 ${
                selectedMood?.label === mood.label 
                  ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-105' 
                  : 'bg-white/50 hover:bg-white'
              }`}
            >
              <span className="text-4xl">{mood.emoji}</span>
              <span className="text-xs font-black uppercase tracking-widest">{mood.label}</span>
            </motion.button>
          ))}
        </div>

        <AnimatePresence>
          {selectedMood && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-6 pt-4"
            >
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What's on your mind? (Optional)"
                className="w-full bg-slate-50 border-none rounded-2xl p-6 focus:ring-2 focus:ring-primary outline-none transition-all font-medium min-h-[120px]"
              />
              <button
                onClick={handleLogMood}
                disabled={isLoading}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : (
                  <>
                    <Plus size={20} />
                    Log Mood Entry
                  </>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Mood History */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-4">
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <History className="text-primary" />
            Mood History
          </h2>
          <div className="text-xs font-black uppercase tracking-widest text-slate-400">
            {moods.length} Entries
          </div>
        </div>

        <div className="space-y-4">
          {moods.length > 0 ? (
            moods.map((mood) => (
              <motion.div
                key={mood.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass p-6 rounded-[2rem] flex items-center justify-between group hover:bg-white/60 transition-all"
              >
                <div className="flex items-center gap-6">
                  <div className="text-4xl group-hover:scale-110 transition-transform">{mood.emoji}</div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-black text-lg capitalize">{mood.mood}</h3>
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        Intensity: {mood.intensity}/10
                      </span>
                    </div>
                    {mood.note && (
                      <p className="text-sm text-slate-500 font-medium mt-1">{mood.note}</p>
                    )}
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-2">
                      {new Date(mood.timestamp?.toDate()).toLocaleString()}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => deleteMood(mood.id)}
                  className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={18} />
                </button>
              </motion.div>
            ))
          ) : (
            <div className="glass p-20 rounded-[3rem] text-center space-y-4">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                <Calendar size={40} />
              </div>
              <p className="text-slate-500 font-medium">Your emotional journey starts here. Log your first mood above.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
