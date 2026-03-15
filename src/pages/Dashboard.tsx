import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  MessageSquare, 
  Activity, 
  Wind, 
  TrendingUp, 
  Calendar,
  ArrowRight,
  Heart,
  Brain,
  Zap
} from 'lucide-react';
import { auth, db } from '../firebase';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';

export function Dashboard() {
  const navigate = useNavigate();
  const [recentMoods, setRecentMoods] = useState<any[]>([]);
  const [dailyInsight, setDailyInsight] = useState<string>("");
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchRecentMoods = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(db, 'moods'),
          where('userId', '==', user.uid),
          orderBy('timestamp', 'desc'),
          limit(3)
        );
        const snapshot = await getDocs(q);
        const moods = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
        setRecentMoods(moods);
        
        // Generate daily insight based on moods
        if (moods.length > 0) {
          generateInsight(moods[0].mood);
        } else {
          setDailyInsight("Start tracking your mood to get personalized daily insights.");
        }
      } catch (err) {
        console.error('Error fetching moods:', err);
      }
    };

    fetchRecentMoods();
  }, [user]);

  const generateInsight = async (currentMood: string) => {
    setIsLoadingInsight(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: `I'm feeling ${currentMood} today. Give me a very short, compassionate 1-sentence daily insight or encouragement.` 
        })
      });
      const data = await response.json();
      setDailyInsight(data.text);
    } catch (err) {
      setDailyInsight("Remember to be kind to yourself today. You are doing your best.");
    } finally {
      setIsLoadingInsight(false);
    }
  };

  const quickActions = [
    { icon: MessageSquare, label: 'Chat with AI', path: '/chat', color: 'bg-blue-500' },
    { icon: Activity, label: 'Log Mood', path: '/mood', color: 'bg-indigo-500' },
    { icon: Wind, label: 'Meditate', path: '/meditation', color: 'bg-emerald-500' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 lg:p-12 space-y-12 pb-32">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-[0.2em]"
          >
            <Sparkles size={16} />
            Welcome Back
          </motion.div>
          <h1 className="text-5xl font-black tracking-tighter">Hello, <span className="text-primary">{user?.displayName?.split(' ')[0]}</span></h1>
          <p className="text-slate-500 font-medium">How is your mind feeling today?</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Current Streak</p>
            <p className="text-xl font-black">12 Days</p>
          </div>
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100">
            <Zap className="text-yellow-500" fill="currentColor" />
          </div>
        </div>
      </header>

      {/* Daily Insight Card */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        whileHover={{ scale: 1.01 }}
        className="glass p-10 rounded-[3rem] bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/10 relative overflow-hidden shadow-2xl shadow-primary/5"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Brain size={120} />
        </div>
        <div className="relative z-10 space-y-6 max-w-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <Sparkles size={20} />
            </div>
            <h2 className="font-black text-xs uppercase tracking-widest text-primary">Daily AI Insight</h2>
          </div>
          <p className="text-2xl font-black tracking-tight leading-tight">
            {isLoadingInsight ? "Generating your insight..." : dailyInsight}
          </p>
        </div>
      </motion.section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
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
          className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6"
        >
          {quickActions.map((action, i) => (
            <motion.button
              key={i}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(action.path)}
              className="glass p-8 rounded-[2.5rem] text-left space-y-6 group transition-all hover:bg-white hover:shadow-2xl hover:shadow-primary/10"
            >
              <div className={`w-14 h-14 ${action.color} rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform`}>
                <action.icon size={28} />
              </div>
              <div>
                <h3 className="font-black text-lg tracking-tight">{action.label}</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1 flex items-center gap-1">
                  Start Now <ArrowRight size={12} />
                </p>
              </div>
            </motion.button>
          ))}
          
          {/* Recent Moods */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            className="sm:col-span-3 glass p-10 rounded-[3rem] space-y-8"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                <Activity className="text-primary" />
                Recent Moods
              </h2>
              <button onClick={() => navigate('/mood')} className="text-xs font-black uppercase tracking-widest text-primary hover:underline">View All</button>
            </div>
            
            <div className="space-y-4">
              {recentMoods.length > 0 ? recentMoods.map((mood, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{mood.emoji}</span>
                    <div>
                      <h4 className="font-black text-sm capitalize">{mood.mood}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        {new Date(mood.timestamp?.toDate()).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-white rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-100">
                    Intensity: {mood.intensity}/10
                  </div>
                </div>
              )) : (
                <p className="text-slate-400 font-medium text-center py-4">No mood entries yet.</p>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Sidebar Stats */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-8"
        >
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="glass p-10 rounded-[3rem] space-y-8 bg-slate-900 text-white border-none shadow-2xl shadow-black/20"
          >
            <h3 className="text-xl font-black tracking-tight flex items-center gap-3">
              <TrendingUp className="text-primary" />
              Wellness Stats
            </h3>
            <div className="space-y-6">
              {[
                { label: 'Mindfulness', value: 75, color: 'bg-primary' },
                { label: 'Consistency', value: 90, color: 'bg-secondary' },
                { label: 'Mood Balance', value: 60, color: 'bg-accent' },
              ].map((stat, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-60">
                    <span>{stat.label}</span>
                    <span>{stat.value}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.value}%` }}
                      className={`h-full ${stat.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="glass p-10 rounded-[3rem] space-y-6"
          >
            <h3 className="text-xl font-black tracking-tight flex items-center gap-3">
              <Calendar className="text-primary" />
              Upcoming
            </h3>
            <div className="p-6 bg-primary/5 rounded-[2rem] border border-primary/10">
              <p className="text-xs font-black uppercase tracking-widest text-primary mb-2">Recommended</p>
              <h4 className="font-black text-lg leading-tight">10 Min Deep Breathing</h4>
              <p className="text-sm text-slate-500 font-medium mt-2">Based on your recent stress levels.</p>
              <button 
                onClick={() => navigate('/meditation')}
                className="mt-4 text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2"
              >
                Start Session <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      <footer className="text-center py-8">
        <p className="text-slate-400 font-medium">Made by Tanya Agarahari</p>
      </footer>
    </div>
  );
}
