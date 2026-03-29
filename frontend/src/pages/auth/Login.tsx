import React, { useState } from 'react';
import { Mail, Lock, LogIn, ArrowRight, Eye, EyeOff, Briefcase, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
           <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-xl shadow-primary/20">
              <ShieldCheck size={32} />
           </div>
           <h1 className="text-3xl font-black text-primary tracking-tight">Welcome Back</h1>
           <p className="text-gray-400 font-medium mt-2">Sign in to your intelligent reimbursement portal.</p>
        </div>

        <div className="card border-none shadow-2xl bg-white p-8">
           <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-1">
                 <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                 <div className="relative group">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input 
                      type="email" required
                      placeholder="name@company.com" 
                      className="w-full bg-gray-50 border border-transparent rounded-xl pl-12 pr-4 py-4 text-sm focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                    />
                 </div>
              </div>

              <div className="space-y-1">
                 <div className="flex items-center justify-between px-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Password</label>
                    <Link to="/forgot-password" title="Forgot password" className="text-xs font-bold text-primary hover:underline transition-all">Forgot password?</Link>
                 </div>
                 <div className="relative group">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input 
                      type={showPassword ? 'text' : 'password'} required
                      placeholder="••••••••" 
                      className="w-full bg-gray-50 border border-transparent rounded-xl pl-12 pr-12 py-4 text-sm focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-primary transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                 </div>
              </div>

              <div className="flex items-center gap-3 px-1">
                 <input type="checkbox" id="remember" className="w-4 h-4 rounded text-primary focus:ring-primary border-gray-100 cursor-pointer" />
                 <label htmlFor="remember" className="text-xs font-bold text-gray-400 select-none cursor-pointer hover:text-gray-600 transition-colors">Keep me signed in for 30 days</label>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-14 bg-primary text-white rounded-xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
              >
                 {isLoading ? (
                   <>
                     <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                     Processing...
                   </>
                 ) : (
                   <>
                     Sign In Account
                     <ArrowRight size={20} />
                   </>
                 )}
              </button>
           </form>

           <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-400 font-medium">
                 Don't have an account yet? 
                 <Link to="/signup" className="text-primary font-black ml-1.5 hover:underline decoration-2">Create Account</Link>
              </p>
           </div>
        </div>

        <div className="mt-12 text-center">
           <div className="flex items-center justify-center gap-3 text-gray-300">
              <div className="flex items-center gap-1.5 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
                 <Briefcase size={14} />
                 <span className="text-[10px] font-black uppercase tracking-[0.2em]">Enterprise Secure</span>
              </div>
              <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
              <div className="flex items-center gap-1.5 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
                 <LogIn size={14} />
                 <span className="text-[10px] font-black uppercase tracking-[0.2em]">SOC2 Compliant</span>
              </div>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

