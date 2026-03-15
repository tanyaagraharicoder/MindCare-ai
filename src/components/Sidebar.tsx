import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Activity, 
  Wind, 
  User, 
  Settings as SettingsIcon,
  LogOut,
  X,
  Sparkles,
  Heart
} from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
      onClose();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: MessageSquare, label: 'AI Support', path: '/chat' },
    { icon: Activity, label: 'Mood Tracker', path: '/mood' },
    { icon: Wind, label: 'Meditation', path: '/meditation' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: SettingsIcon, label: 'Settings', path: '/settings' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-0 left-0 bottom-0 w-72 glass border-r border-white/20 z-50
        transition-all duration-500 ease-in-out lg:translate-x-0
        flex flex-col
        ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        <div className="p-10 flex items-center justify-between flex-shrink-0">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-4 cursor-pointer"
            onClick={() => navigate('/dashboard')}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/20">
              <Sparkles size={28} />
            </div>
            <h1 className="font-black text-2xl tracking-tighter uppercase">MindCare</h1>
          </motion.div>
          <button 
            onClick={onClose} 
            className="lg:hidden p-3 hover:bg-white rounded-2xl transition-all hover:rotate-90 duration-300"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-6 space-y-3 overflow-y-auto py-4 custom-scrollbar">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => onClose()}
              className={({ isActive }) => `
                flex items-center gap-4 px-6 py-5 rounded-3xl transition-all duration-500 group relative overflow-hidden
                ${isActive 
                  ? 'bg-primary text-white shadow-2xl shadow-primary/30 scale-[1.02]' 
                  : 'hover:bg-white/80 text-slate-500 hover:text-primary hover:translate-x-2'}
              `}
            >
              {({ isActive }) => (
                <>
                  {!isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                  <item.icon size={22} className={`${isActive ? 'scale-110' : 'group-hover:scale-125'} transition-transform duration-500 relative z-10`} />
                  <span className="font-black text-[11px] uppercase tracking-[0.2em] relative z-10">{item.label}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="activeNav"
                      className="absolute right-4 w-1.5 h-1.5 bg-white rounded-full"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-6 space-y-6 flex-shrink-0">
          <motion.div 
            whileHover={{ y: -5 }}
            className="p-8 glass rounded-[2.5rem] bg-gradient-to-br from-primary/5 to-secondary/5 border border-white/40 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-primary">
                <Heart size={18} fill="currentColor" className="animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest">Daily Progress</span>
              </div>
              <span className="text-[10px] font-black text-primary">65%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '65%' }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" 
              />
            </div>
          </motion.div>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-8 py-5 rounded-3xl text-red-500 hover:bg-red-50 transition-all font-black text-xs uppercase tracking-widest group"
          >
            <LogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
