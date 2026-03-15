import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Lock, 
  Eye, 
  Moon, 
  Sun,
  Globe,
  ShieldCheck,
  ChevronRight,
  Trash2
} from 'lucide-react';

export function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const settingsGroups = [
    {
      title: "Preferences",
      items: [
        { 
          icon: darkMode ? Moon : Sun, 
          label: "Appearance", 
          value: darkMode ? "Dark Mode" : "Light Mode",
          action: () => setDarkMode(!darkMode)
        },
        { 
          icon: Globe, 
          label: "Language", 
          value: "English (US)",
          action: () => {}
        },
      ]
    },
    {
      title: "Privacy & Security",
      items: [
        { 
          icon: Lock, 
          label: "Password", 
          value: "Last changed 3 months ago",
          action: () => {}
        },
        { 
          icon: Eye, 
          label: "Data Visibility", 
          value: "Private",
          action: () => {}
        },
        { 
          icon: ShieldCheck, 
          label: "Two-Factor Auth", 
          value: "Enabled",
          action: () => {}
        },
      ]
    },
    {
      title: "Notifications",
      items: [
        { 
          icon: Bell, 
          label: "Push Notifications", 
          value: notifications ? "On" : "Off",
          action: () => setNotifications(!notifications)
        },
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <header className="text-center space-y-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-md border border-white/20 text-primary font-bold text-sm"
        >
          <SettingsIcon size={16} />
          <span>Application Settings</span>
        </motion.div>
        <h1 className="text-5xl font-black tracking-tighter">Customize your <span className="text-primary">experience.</span></h1>
        <p className="text-slate-500 font-medium">Manage your account preferences and privacy settings.</p>
      </header>

      <div className="space-y-8">
        {settingsGroups.map((group, i) => (
          <section key={i} className="space-y-4">
            <h3 className="px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">{group.title}</h3>
            <div className="glass rounded-[2.5rem] overflow-hidden">
              {group.items.map((item, j) => (
                <button
                  key={j}
                  onClick={item.action}
                  className={`w-full flex items-center justify-between p-8 hover:bg-slate-50 transition-all ${
                    j !== group.items.length - 1 ? 'border-b border-slate-100' : ''
                  }`}
                >
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500">
                      <item.icon size={22} />
                    </div>
                    <div className="text-left">
                      <p className="font-black text-lg">{item.label}</p>
                      <p className="text-xs text-slate-400 font-medium">{item.value}</p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-slate-300" />
                </button>
              ))}
            </div>
          </section>
        ))}

        <section className="space-y-4">
          <h3 className="px-6 text-[10px] font-black uppercase tracking-widest text-red-400">Danger Zone</h3>
          <div className="glass rounded-[2.5rem] border-red-100 bg-red-50/30">
            <button className="w-full flex items-center justify-between p-8 hover:bg-red-50 transition-all">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-500">
                  <Trash2 size={22} />
                </div>
                <div className="text-left">
                  <p className="font-black text-lg text-red-600">Delete Account</p>
                  <p className="text-xs text-red-400 font-medium">Permanently remove all your data</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-red-200" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
