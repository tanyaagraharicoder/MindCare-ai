import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { signInWithGoogle } from '../firebase';
import { Sparkles, Heart, Shield, Loader2 } from 'lucide-react';

export function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error('Auth error:', err);
      setError('Failed to sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full glass p-12 rounded-[3rem] space-y-10 relative z-10"
      >
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-primary/20 mx-auto">
            <Sparkles size={40} />
          </div>
          <h1 className="text-4xl font-black tracking-tighter">Welcome to <span className="text-primary">MindCare</span></h1>
          <p className="text-slate-500 font-medium">Your journey to mental wellness starts here.</p>
        </div>

        <div className="space-y-6">
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-4 px-8 py-5 bg-white border border-slate-200 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm active:scale-95 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : (
              <>
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                Continue with Google
              </>
            )}
          </button>

          {error && (
            <p className="text-red-500 text-center text-sm font-bold">{error}</p>
          )}
        </div>

        <div className="pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 text-slate-400">
            <Shield size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">Secure</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400 justify-end">
            <Heart size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">Private</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
