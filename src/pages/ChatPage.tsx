import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Sparkles, 
  Trash2,
  MoreVertical,
  Heart,
  Brain,
  Zap,
  MessageSquare,
  Shield
} from 'lucide-react';
import { auth, db } from '../firebase';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp, deleteDoc, getDocs } from 'firebase/firestore';

const FALLBACK_RESPONSES = [
  "I'm here for you. It sounds like you're going through a lot right now. Remember to take things one step at a time.",
  "I hear you. Your feelings are completely valid. How can I best support you in this moment?",
  "Thank you for sharing that with me. It takes strength to open up. I'm listening and I care about your well-being.",
  "I'm sorry you're feeling this way. Sometimes a deep breath and a moment of stillness can help. I'm right here with you.",
  "That sounds challenging. Please know that you don't have to carry everything alone. I'm here to listen whenever you need."
];

const CRISIS_PHRASES = [
  "i want to die",
  "kill myself",
  "suicide",
  "end my life",
  "don't want to live",
  "better off dead"
];

const CRISIS_MESSAGE = "I'm very concerned about what you're sharing. Please know that you're not alone and there is help available. If you're in immediate danger, please contact emergency services or a crisis hotline:\n\n• National Suicide Prevention Lifeline: 988\n• Crisis Text Line: Text HOME to 741741\n• Emergency: 911\n\nPlease reach out to one of these resources or a trusted person in your life right now.";

function TypewriterText({ text, onComplete }: { text: string, onComplete?: () => void }) {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[index]);
        setIndex(prev => prev + 1);
      }, 15); // Adjust speed here
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [index, text, onComplete]);

  return <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{displayedText}</p>;
}

export function ChatPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'chats'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user || isLoading) return;

    const userMessage = input.trim();
    const isCrisis = CRISIS_PHRASES.some(phrase => userMessage.toLowerCase().includes(phrase));
    
    setInput('');
    setIsLoading(true);

    try {
      // 1. Save user message to Firestore
      await addDoc(collection(db, 'chats'), {
        userId: user.uid,
        role: 'user',
        text: userMessage,
        timestamp: serverTimestamp()
      });

      if (isCrisis) {
        // Immediate crisis response
        const crisisDoc = await addDoc(collection(db, 'chats'), {
          userId: user.uid,
          role: 'model',
          text: CRISIS_MESSAGE,
          timestamp: serverTimestamp(),
          isCrisis: true
        });
        setTypingMessageId(crisisDoc.id);
        setIsLoading(false);
        return;
      }

      // 2. Get AI response from our server
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage,
          history: messages.map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
          })).slice(-10)
        })
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error);

      // 3. Save AI response to Firestore
      const aiDoc = await addDoc(collection(db, 'chats'), {
        userId: user.uid,
        role: 'model',
        text: data.text,
        timestamp: serverTimestamp()
      });
      
      setTypingMessageId(aiDoc.id);

    } catch (error) {
      console.error('Chat Error:', error);
      const fallback = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
      const fallbackDoc = await addDoc(collection(db, 'chats'), {
        userId: user.uid,
        role: 'model',
        text: fallback,
        timestamp: serverTimestamp()
      });
      setTypingMessageId(fallbackDoc.id);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = async () => {
    if (!user || !window.confirm('Are you sure you want to clear your chat history?')) return;
    try {
      const q = query(collection(db, 'chats'), where('userId', '==', user.uid));
      const snapshot = await getDocs(q);
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
    } catch (err) {
      console.error('Error clearing history:', err);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50 lg:pl-0">
      {/* Chat Header */}
      <header className="h-24 glass border-b border-slate-100 px-8 flex items-center justify-between flex-shrink-0 z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/20">
            <Bot size={28} />
          </div>
          <div>
            <h1 className="font-black text-xl tracking-tight">MindCare AI</h1>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Always here to listen</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={clearHistory}
            className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
            title="Clear History"
          >
            <Trash2 size={20} />
          </button>
          <button className="p-3 text-slate-400 hover:bg-slate-100 rounded-xl transition-all">
            <MoreVertical size={20} />
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 lg:p-12 space-y-8 custom-scrollbar"
      >
        <AnimatePresence initial={false}>
          {messages.length === 0 && !isLoading && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto text-center space-y-8 py-20"
            >
              <div className="w-24 h-24 bg-primary/5 rounded-[2.5rem] flex items-center justify-center text-primary mx-auto">
                <Brain size={48} />
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-black tracking-tight">How can I support you today?</h2>
                <p className="text-slate-500 font-medium">I'm your AI companion, here to listen, support, and help you navigate your emotions in a safe, private space.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "I'm feeling a bit overwhelmed lately.",
                  "Can you help me with some anxiety relief?",
                  "I just need someone to talk to.",
                  "How can I improve my sleep?"
                ].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(suggestion)}
                    className="p-6 glass rounded-3xl text-left text-sm font-bold hover:bg-white hover:border-primary/30 transition-all group"
                  >
                    <span className="text-slate-400 group-hover:text-primary transition-colors">"{suggestion}"</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-4 max-w-[85%] lg:max-w-[70%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center shadow-sm ${
                  msg.role === 'user' ? 'bg-secondary text-white' : 'bg-white text-primary border border-slate-100'
                }`}>
                  {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                </div>
                <div className={`space-y-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-6 rounded-[2rem] shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-primary text-white rounded-tr-none' 
                      : msg.isCrisis 
                        ? 'bg-red-50 text-red-800 rounded-tl-none border border-red-100'
                        : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                  }`}>
                    {msg.id === typingMessageId ? (
                      <TypewriterText 
                        text={msg.text} 
                        onComplete={() => setTypingMessageId(null)} 
                      />
                    ) : (
                      <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    )}
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">
                    {msg.timestamp?.toDate() ? new Date(msg.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-white text-primary border border-slate-100 flex items-center justify-center shadow-sm">
                  <Bot size={20} />
                </div>
                <div className="bg-white p-6 rounded-[2rem] rounded-tl-none border border-slate-100 flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="p-6 lg:p-12 bg-white/50 backdrop-blur-md border-t border-slate-100 flex-shrink-0">
        <form 
          onSubmit={handleSend}
          className="max-w-4xl mx-auto relative"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            className="w-full bg-white border border-slate-200 rounded-[2.5rem] pl-8 pr-20 py-6 text-sm font-medium focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all shadow-xl"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
          </button>
        </form>
        <p className="text-center text-[10px] font-black uppercase tracking-widest text-slate-400 mt-6 flex items-center justify-center gap-2">
          <Shield size={12} />
          Your conversation is private and secure
        </p>
      </div>
    </div>
  );
}
