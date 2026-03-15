import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Brain, Zap, Shield, ArrowRight, Wind } from 'lucide-react';

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              x: [0, 20, 0],
              y: [0, -20, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" 
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              x: [0, -30, 0],
              y: [0, 30, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" 
          />
        </div>

        <div className="max-w-5xl mx-auto text-center space-y-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-primary font-bold text-sm"
          >
            <Sparkles size={16} />
            <span>AI-Powered Mental Wellness</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]"
          >
            Your safe space for <br />
            <span className="text-primary">emotional growth.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-500 max-w-2xl mx-auto font-medium"
          >
            MindCare AI combines advanced artificial intelligence with proven therapeutic techniques to support your mental well-being 24/7.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/auth')}
              className="btn-primary flex items-center gap-2 text-lg px-10 py-5"
            >
              Get Started for Free
              <ArrowRight size={20} />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary text-lg px-10 py-5"
            >
              How it works
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              icon: Brain, 
              title: "AI Support", 
              desc: "Compassionate AI assistant available 24/7 for empathetic listening and support.",
              color: "bg-blue-500"
            },
            { 
              icon: Activity, 
              title: "Mood Tracking", 
              desc: "Visualize your emotional patterns and gain insights into your mental well-being.",
              color: "bg-indigo-500"
            },
            { 
              icon: Wind, 
              title: "Guided Meditation", 
              desc: "Personalized meditation sessions tailored to your current mood and stress levels.",
              color: "bg-emerald-500"
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass p-10 rounded-[3rem] space-y-6 card-hover"
            >
              <div className={`w-16 h-16 ${feature.color} rounded-[1.5rem] flex items-center justify-center text-white shadow-xl`}>
                <feature.icon size={32} />
              </div>
              <h3 className="text-2xl font-black tracking-tight">{feature.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <h2 className="text-4xl font-black tracking-tight">Built with your <span className="text-secondary">privacy</span> in mind.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start gap-6 text-left">
              <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Shield className="text-primary" />
              </div>
              <div>
                <h4 className="font-black text-lg">End-to-End Privacy</h4>
                <p className="text-slate-500 font-medium">Your data is encrypted and stored securely. You have full control over your information.</p>
              </div>
            </div>
            <div className="flex items-start gap-6 text-left">
              <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Zap className="text-primary" />
              </div>
              <div>
                <h4 className="font-black text-lg">Instant Support</h4>
                <p className="text-slate-500 font-medium">No wait times. Get immediate support whenever you need someone to talk to.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <footer className="py-12 border-t border-slate-100 text-center">
        <p className="text-slate-400 font-medium">© 2026 MindCare AI. Made by Tanya Agarahari.</p>
      </footer>
    </div>
  );
}

const Activity = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);
