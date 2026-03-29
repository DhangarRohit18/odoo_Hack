import React, { useState } from 'react';
import { Mail, ArrowLeft, Send, CheckCircle2, ShieldAlert, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-10">
           <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-4 border border-primary/20">
              <ShieldAlert size={32} />
           </div>
           <h1 className="text-3xl font-black text-primary tracking-tight">Recover ID</h1>
           <p className="text-gray-400 font-medium mt-2">Reset your security credentials via email.</p>
        </div>

        <div className="card border-none shadow-2xl bg-white p-8 overflow-hidden relative min-h-[400px] flex flex-col justify-center">
           <AnimatePresence mode="wait">
             {!isSent ? (
               <motion.div 
                 key="form"
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 className="space-y-8"
               >
                  <div className="space-y-4">
                     <p className="text-sm text-gray-500 leading-relaxed font-medium">
                       Enter the work email associated with your account and we'll send an automated recovery link to reset your password.
                     </p>
                     
                     <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Work Email</label>
                        <div className="relative group">
                           <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                           <input 
                             type="email" required
                             value={email}
                             onChange={(e) => setEmail(e.target.value)}
                             placeholder="name@company.com" 
                             className="w-full bg-gray-50 border border-transparent rounded-xl pl-12 pr-4 py-4 text-sm focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                           />
                        </div>
                     </div>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <button 
                      type="submit" 
                      disabled={isLoading || !email}
                      className="w-full h-14 bg-primary text-white rounded-xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
                    >
                       {isLoading ? (
                         <Loader2 className="animate-spin" size={24} />
                       ) : (
                         <>
                           Transmit Recovery Link
                           <Send size={20} />
                         </>
                       )}
                    </button>
                  </form>
               </motion.div>
             ) : (
               <motion.div 
                 key="success"
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="text-center space-y-6"
               >
                  <div className="w-20 h-20 bg-accent-success/10 rounded-full flex items-center justify-center text-accent-success mx-auto shadow-glow shadow-accent-success/10">
                     <CheckCircle2 size={40} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-primary">Transmission Sent</h3>
                    <p className="text-sm text-gray-400 font-medium mt-2 max-w-xs mx-auto">
                      A unique recovery link has been dispatched to <b>{email}</b>. Please check your inbox (and spam folder).
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 italic text-xs text-gray-400 font-medium">
                    Link expires in 15 minutes for security reasons.
                  </div>
               </motion.div>
             )}
           </AnimatePresence>

           <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center">
              <Link to="/login" className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-primary transition-all group">
                 <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                 Back to Login Portal
              </Link>
           </div>
        </div>

        <div className="mt-12 text-center">
           <p className="text-[10px] font-black uppercase text-gray-200 tracking-[0.3em] cursor-default select-none">
             Automated Recovery System
           </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;

