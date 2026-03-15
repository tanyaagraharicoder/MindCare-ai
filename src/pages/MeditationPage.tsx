import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wind, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  Volume2,
  VolumeX,
  Music,
  CloudRain,
  Trees,
  Heart
} from 'lucide-react';
import { auth, db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const breathingTechniques = [
  { name: 'Box Breathing', inhale: 4, hold: 4, exhale: 4, hold2: 4, desc: 'Calm the nervous system' },
  { name: '4-7-8 Technique', inhale: 4, hold: 7, exhale: 8, desc: 'Natural tranquilizer for the nervous system' },
  { name: 'Deep Breathing', inhale: 5, exhale: 5, desc: 'Simple relaxation' },
];

const soundscapes = [
  { id: 'none', name: 'Silent', icon: VolumeX, url: '' },
  { id: 'rain', name: 'Rainfall', icon: CloudRain, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' }, // Placeholder URLs
  { id: 'nature', name: 'Forest', icon: Wind, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 'ambient', name: 'Zen', icon: Music, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  { id: 'calm', name: 'Calm', icon: Sparkles, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
  { id: 'meditation', name: 'Meditation', icon: Heart, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3' },
];

export function MeditationPage() {
  const [isActive, setIsActive] = useState(false);
  const [technique, setTechnique] = useState(breathingTechniques[0]);
  const [phase, setPhase] = useState('Inhale'); 
  const [timer, setTimer] = useState(technique.inhale);
  const [totalTime, setTotalTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedSound, setSelectedSound] = useState(soundscapes[0]);
  const [sessionGoal, setSessionGoal] = useState(300); // 5 minutes in seconds
  const [audio] = useState(new Audio());

  // Handle Audio
  useEffect(() => {
    if (selectedSound.url && isActive && !isMuted) {
      audio.src = selectedSound.url;
      audio.loop = true;
      audio.play().catch(e => console.log("Audio play blocked"));
    } else {
      audio.pause();
    }
    return () => audio.pause();
  }, [selectedSound, isActive, isMuted]);

  // Main Timer Logic
  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setTotalTime(prev => prev + 1);
        setTimer(prev => {
          if (prev <= 1) {
            // Switch Phase
            if (technique.name === 'Box Breathing') {
              if (phase === 'Inhale') { setPhase('Hold'); return technique.hold; }
              if (phase === 'Hold') { setPhase('Exhale'); return technique.exhale; }
              if (phase === 'Exhale') { setPhase('Hold '); return technique.hold2 || 4; }
              setPhase('Inhale'); return technique.inhale;
            } else if (technique.name === '4-7-8 Technique') {
              if (phase === 'Inhale') { setPhase('Hold'); return 7; }
              if (phase === 'Hold') { setPhase('Exhale'); return 8; }
              setPhase('Inhale'); return 4;
            } else {
              if (phase === 'Inhale') { setPhase('Exhale'); return technique.exhale; }
              setPhase('Inhale'); return technique.inhale;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }

    if (totalTime >= sessionGoal) {
      handleComplete();
    }

    return () => clearInterval(interval);
  }, [isActive, phase, technique, totalTime, sessionGoal]);

  const handleStart = () => {
    setIsActive(true);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setTotalTime(0);
    setTimer(technique.inhale);
    setPhase('Inhale');
  };

  const handleComplete = async () => {
    setIsActive(false);
    const user = auth.currentUser;
    if (user) {
      try {
        await addDoc(collection(db, 'meditations'), {
          userId: user.uid,
          duration: totalTime,
          technique: technique.name,
          timestamp: serverTimestamp()
        });
      } catch (err) {
        console.error('Error saving meditation:', err);
      }
    }
    alert("Great job completing your meditation.");
    handleReset();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
          <Wind size={16} />
          <span>Mindful Breathing</span>
        </motion.div>
        <h1 className="text-5xl font-black tracking-tighter">Find your <span className="text-primary">center.</span></h1>
        <p className="text-slate-500 font-medium">Guided breathing exercises to reduce stress and improve focus.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Settings Sidebar */}
        <div className="space-y-6">
          <section className="glass p-8 rounded-[2.5rem] space-y-6">
            <h3 className="font-black text-xs uppercase tracking-widest text-slate-400">Technique</h3>
            <div className="space-y-3">
              {breathingTechniques.map((t) => (
                <motion.button
                  key={t.name}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setTechnique(t); handleReset(); }}
                  className={`w-full p-4 rounded-2xl text-left transition-all ${
                    technique.name === t.name 
                      ? 'bg-primary text-white shadow-lg' 
                      : 'bg-slate-50 hover:bg-white border border-slate-100'
                  }`}
                >
                  <p className="font-black text-sm">{t.name}</p>
                  <p className={`text-[10px] font-medium opacity-70 ${technique.name === t.name ? 'text-white' : 'text-slate-500'}`}>{t.desc}</p>
                </motion.button>
              ))}
            </div>
          </section>

          <section className="glass p-8 rounded-[2.5rem] space-y-6">
            <h3 className="font-black text-xs uppercase tracking-widest text-slate-400">Soundscape</h3>
            <div className="grid grid-cols-2 gap-3">
              {soundscapes.map((s) => (
                <motion.button
                  key={s.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedSound(s)}
                  className={`p-4 rounded-2xl flex flex-col items-center gap-2 transition-all ${
                    selectedSound.id === s.id 
                      ? 'bg-primary/10 text-primary border-primary/20' 
                      : 'bg-slate-50 hover:bg-white border border-slate-100'
                  }`}
                >
                  <s.icon size={20} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{s.name}</span>
                </motion.button>
              ))}
            </div>
          </section>
        </div>

        {/* Main Timer Display */}
        <div className="lg:col-span-2">
          <section className="glass p-12 rounded-[4rem] flex flex-col items-center justify-center space-y-12 relative overflow-hidden min-h-[600px]">
            {/* Animated Background Rings */}
            <AnimatePresence>
              {isActive && (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ 
                    scale: phase === 'Inhale' ? 1.5 : 1,
                    opacity: 0.1
                  }}
                  transition={{ duration: timer, ease: "easeInOut" }}
                  className="absolute w-96 h-96 bg-primary rounded-full blur-3xl"
                />
              )}
            </AnimatePresence>

            {/* Timer Circle */}
            <div className="relative w-72 h-72 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="144"
                  cy="144"
                  r="130"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-slate-100"
                />
                <motion.circle
                  cx="144"
                  cy="144"
                  r="130"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray="816"
                  animate={{ strokeDashoffset: 816 - (816 * (totalTime / sessionGoal)) }}
                  className="text-primary"
                />
              </svg>
              
              <div className="text-center space-y-2 relative z-10">
                <motion.p 
                  key={phase}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl font-black tracking-tighter text-primary"
                >
                  {phase}
                </motion.p>
                <p className="text-6xl font-black tracking-tighter">{timer}</p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center gap-8 w-full max-w-xs">
              <div className="flex items-center justify-center gap-6">
                <button 
                  onClick={handleReset}
                  className="p-4 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-all"
                >
                  <RotateCcw size={24} />
                </button>
                
                <button 
                  onClick={isActive ? handlePause : handleStart}
                  className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all"
                >
                  {isActive ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-2" />}
                </button>

                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-4 rounded-full transition-all ${isMuted ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-500'}`}
                >
                  {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                </button>
              </div>

              <div className="w-full space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <span>Progress</span>
                  <span>{formatTime(totalTime)} / {formatTime(sessionGoal)}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ width: `${(totalTime / sessionGoal) * 100}%` }}
                    className="h-full bg-primary"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
