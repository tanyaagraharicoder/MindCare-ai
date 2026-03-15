import React from 'react';
import { motion } from 'framer-motion';
import { 
  Phone, 
  MessageCircle, 
  MapPin, 
  ShieldAlert, 
  ExternalLink,
  HeartHandshake,
  LifeBuoy,
  AlertCircle,
  Sparkles,
  ChevronRight
} from 'lucide-react';

const helplines = [
  { 
    name: 'National Suicide Prevention Lifeline', 
    number: '988', 
    desc: 'Available 24/7 in English and Spanish.',
    type: 'Call'
  },
  { 
    name: 'Crisis Text Line', 
    number: '741741', 
    desc: 'Text HOME to connect with a Crisis Counselor.',
    type: 'Text'
  },
  { 
    name: 'The Trevor Project', 
    number: '1-866-488-7386', 
    desc: 'Crisis intervention for LGBTQ young people.',
    type: 'Call/Text'
  },
  { 
    name: 'SAMHSA National Helpline', 
    number: '1-800-662-4357', 
    desc: 'Treatment referral and information service.',
    type: 'Call'
  },
];

export function EmergencyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      {/* Header */}
      <header className="text-center space-y-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-600 font-bold text-sm"
        >
          <ShieldAlert size={16} />
          <span>Urgent Support</span>
        </motion.div>
        <h1 className="text-5xl font-black tracking-tighter">Emergency <span className="text-red-600">Help</span></h1>
        <p className="text-slate-500 font-medium">If you are in immediate danger, please call emergency services (911) immediately.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Helplines */}
        <div className="space-y-6">
          <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
            <Phone className="text-primary" />
            Crisis Helplines
          </h3>
          <div className="space-y-4">
            {helplines.map((line, i) => (
              <motion.div 
                key={line.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass p-6 rounded-[2.5rem] hover:bg-white transition-all group border border-white/20"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-black text-lg mb-1">{line.name}</h4>
                    <p className="text-xs text-slate-500 font-medium">{line.desc}</p>
                  </div>
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest">
                    {line.type}
                  </span>
                </div>
                <div className="flex gap-3">
                  <a 
                    href={`tel:${line.number}`}
                    className="flex-1 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                  >
                    <Phone size={16} />
                    {line.number}
                  </a>
                  <button className="p-4 glass hover:bg-white rounded-2xl transition-all text-slate-400 hover:text-primary">
                    <ExternalLink size={20} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Resources */}
        <div className="space-y-8">
          <div className="space-y-6">
            <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
              <HeartHandshake className="text-primary" />
              Support Resources
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {[
                { title: 'Find a Therapist', desc: 'Search for mental health professionals near you.', icon: MapPin },
                { title: 'Support Groups', desc: 'Connect with others who understand what you\'re going through.', icon: MessageCircle },
                { title: 'Self-Help Library', desc: 'Access articles and guides on various mental health topics.', icon: LifeBuoy },
              ].map((res) => (
                <button 
                  key={res.title}
                  className="glass p-6 rounded-[2.5rem] flex items-center gap-6 hover:bg-white transition-all text-left group border border-white/20"
                >
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <res.icon size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black mb-1">{res.title}</h4>
                    <p className="text-xs text-slate-500 font-medium">{res.desc}</p>
                  </div>
                  <ChevronRight className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                </button>
              ))}
            </div>
          </div>

          <div className="glass p-8 rounded-[2.5rem] bg-slate-900 text-white relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3">
                <AlertCircle size={20} className="text-amber-500" />
                <h4 className="font-black uppercase tracking-widest text-xs">Medical Disclaimer</h4>
              </div>
              <p className="text-sm text-slate-400 font-medium leading-relaxed">
                MindCare AI is an AI assistant and not a replacement for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
