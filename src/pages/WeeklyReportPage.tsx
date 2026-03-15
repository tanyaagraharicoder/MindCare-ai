import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Brain, 
  Target, 
  Lightbulb,
  ArrowRight,
  Download,
  Share2,
  Calendar,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

const moodData = [
  { day: 'Mon', score: 4, color: '#3b82f6' },
  { day: 'Tue', score: 3, color: '#6366f1' },
  { day: 'Wed', score: 2, color: '#8b5cf6' },
  { day: 'Thu', score: 5, color: '#3b82f6' },
  { day: 'Fri', score: 4, color: '#6366f1' },
  { day: 'Sat', score: 5, color: '#8b5cf6' },
  { day: 'Sun', score: 4, color: '#3b82f6' },
];

export function WeeklyReportPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm"
          >
            <BarChart3 size={16} />
            <span>Weekly Insights</span>
          </motion.div>
          <h1 className="text-5xl font-black tracking-tighter">Your <span className="text-primary">Progress</span></h1>
          <p className="text-slate-500 font-medium">Analysis of your well-being from Mar 7 - Mar 13.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-4 glass rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all shadow-sm">
            <Download size={18} />
            Export
          </button>
          <button className="flex items-center gap-2 px-6 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary/90 transition-all shadow-xl shadow-primary/20">
            <Share2 size={18} />
            Share
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Summary Stats */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { label: 'Avg Mood', value: '4.2', icon: BarChart3, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+12%', trendIcon: TrendingUp },
              { label: 'Stress', value: 'Low', icon: Brain, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: '-5%', trendIcon: TrendingDown },
              { label: 'Goals', value: '85%', icon: Target, color: 'text-violet-600', bg: 'bg-violet-50', trend: '+8%', trendIcon: TrendingUp },
            ].map((stat, i) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass p-8 rounded-[2.5rem] border border-white/20 shadow-xl shadow-blue-500/5"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center ${stat.color} shadow-inner`}>
                    <stat.icon size={24} />
                  </div>
                  <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-blue-500'}`}>
                    <stat.trendIcon size={12} />
                    {stat.trend}
                  </div>
                </div>
                <h4 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</h4>
                <p className="text-3xl font-black tracking-tight">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Mood Distribution */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass p-10 rounded-[3rem] border border-white/20 shadow-2xl shadow-blue-500/5"
          >
            <div className="flex items-center justify-between mb-10">
              <div className="space-y-1">
                <h3 className="text-2xl font-black tracking-tight">Mood Distribution</h3>
                <p className="text-xs text-slate-400 font-medium">Daily emotional tracking</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 glass rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400">
                <Calendar size={14} />
                <span>Last 7 Days</span>
              </div>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={moodData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                    dy={15}
                  />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ fill: 'rgba(59, 130, 246, 0.05)', radius: 20 }}
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                      backdropFilter: 'blur(10px)',
                      borderRadius: '24px', 
                      border: '1px solid rgba(255, 255, 255, 0.2)', 
                      boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                      padding: '16px'
                    }} 
                    itemStyle={{ fontWeight: 900, fontSize: '12px', textTransform: 'uppercase' }}
                  />
                  <Bar dataKey="score" radius={[12, 12, 12, 12]} barSize={45}>
                    {moodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* AI Insights & Recommendations */}
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass p-10 rounded-[3rem] bg-gradient-to-br from-primary to-secondary text-white relative overflow-hidden shadow-2xl shadow-primary/20"
          >
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                  <Sparkles size={24} />
                </div>
                <h3 className="text-2xl font-black tracking-tight">AI Insights</h3>
              </div>
              <p className="text-white/80 text-sm font-medium leading-relaxed">
                "Your mood has been consistently positive this week, especially on days when you completed your meditation sessions. There's a slight dip on Wednesday, which correlates with your notes about work stress. Keep up the breathing exercises!"
              </p>
              <button className="w-full py-5 bg-white text-primary rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-xl shadow-black/10">
                Full Analysis
                <ArrowRight size={16} />
              </button>
            </div>
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="glass p-10 rounded-[3rem] border border-white/20 shadow-2xl shadow-blue-500/5"
          >
            <h3 className="text-2xl font-black tracking-tight mb-8">Next Steps</h3>
            <div className="space-y-4">
              {[
                { title: 'Morning Routine', desc: 'Try a 5-min breathing session at 8 AM.', icon: TrendingUp, color: 'text-blue-500' },
                { title: 'Sleep Hygiene', desc: 'Aim for 8 hours of sleep tonight.', icon: Brain, color: 'text-indigo-500' },
                { title: 'Social Connection', desc: 'Reach out to a friend today.', icon: Target, color: 'text-violet-500' },
              ].map((rec) => (
                <div key={rec.title} className="flex gap-4 p-5 rounded-[2rem] glass hover:bg-white transition-all border border-white/10 group">
                  <div className={`w-12 h-12 bg-white rounded-2xl flex items-center justify-center ${rec.color} shadow-sm group-hover:scale-110 transition-transform`}>
                    <rec.icon size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-xs uppercase tracking-widest mb-1">{rec.title}</h4>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{rec.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
