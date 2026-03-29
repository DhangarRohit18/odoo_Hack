import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, Globe, ArrowRight, UserPlus, ShieldCheck, CheckCircle2, MoreHorizontal } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const Signup = () => {
  const [countries, setCountries] = useState<{name: string, code: string, currency: string}[]>([]);
  const [formStep, setFormStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {

    const mockCountries = [
      { name: 'United States', code: 'US', currency: 'USD' },
      { name: 'United Kingdom', code: 'UK', currency: 'GBP' },
      { name: 'Germany', code: 'DE', currency: 'EUR' },
      { name: 'India', code: 'IN', currency: 'INR' },
      { name: 'Canada', code: 'CA', currency: 'CAD' },
      { name: 'Australia', code: 'AU', currency: 'AUD' },
      { name: 'France', code: 'FR', currency: 'EUR' },
    ];
    setCountries(mockCountries);
  }, []);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (formStep === 1) {
      setFormStep(2);
    } else {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        navigate('/login');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full"
      >
        <div className="text-center mb-8">
           <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-xl shadow-primary/20">
              <UserPlus size={32} />
           </div>
           <h1 className="text-3xl font-black text-primary tracking-tight">Create Enterprise ID</h1>
           <p className="text-gray-400 font-medium mt-2">Join ODOO's intelligent reimbursement ecosystem.</p>
        </div>

        <div className="card border-none shadow-2xl bg-white p-8 overflow-hidden relative">
           {}
           <div className="flex items-center gap-2 mb-10 overflow-hidden px-1">
              {[1, 2].map((step) => (
                <div key={step} className="flex-1 h-1.5 rounded-full relative bg-gray-100">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: formStep >= step ? '100%' : '0%' }}
                     className="absolute inset-0 bg-primary rounded-full shadow-glow-sm"
                   />
                </div>
              ))}
           </div>

           <form onSubmit={handleSignup} className="space-y-6">
              <AnimatePresence mode="wait">
                 {formStep === 1 ? (
                   <motion.div 
                     key="step1"
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: 20 }}
                     className="space-y-6"
                   >
                      <div className="space-y-1">
                         <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                         <div className="relative group">
                            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                            <input 
                              type="text" required
                              placeholder="Alex Mitchell" 
                              className="w-full bg-gray-50 border border-transparent rounded-xl pl-12 pr-4 py-4 text-sm focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                            />
                         </div>
                      </div>

                      <div className="space-y-1">
                         <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Work Email</label>
                         <div className="relative group">
                            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                            <input 
                              type="email" required
                              placeholder="alex@company.com" 
                              className="w-full bg-gray-50 border border-transparent rounded-xl pl-12 pr-4 py-4 text-sm focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                            />
                         </div>
                      </div>

                      <div className="space-y-1">
                         <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Residence Country</label>
                         <div className="relative group">
                            <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors z-10" />
                            <select 
                              required
                              className="w-full bg-gray-50 border border-transparent rounded-xl pl-12 pr-4 py-4 text-sm focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 outline-none transition-all cursor-pointer appearance-none"
                            >
                               <option value="">Select your country</option>
                               {countries.map(c => (
                                 <option key={c.code} value={c.code}>{c.name} ({c.currency})</option>
                               ))}
                            </select>
                         </div>
                      </div>
                   </motion.div>
                 ) : (
                   <motion.div 
                     key="step2"
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: 20 }}
                     className="space-y-6"
                   >
                      <div className="space-y-1">
                         <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Access Password</label>
                         <div className="relative group">
                            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                            <input 
                              type="password" required
                              placeholder="••••••••" 
                              className="w-full bg-gray-50 border border-transparent rounded-xl pl-12 pr-4 py-4 text-sm focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                            />
                         </div>
                      </div>

                      <div className="space-y-1">
                         <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Confirm Identity</label>
                         <div className="relative group">
                            <ShieldCheck size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                            <input 
                              type="password" required
                              placeholder="••••••••" 
                              className="w-full bg-gray-50 border border-transparent rounded-xl pl-12 pr-4 py-4 text-sm focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                            />
                         </div>
                      </div>

                      <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 flex gap-4">
                         <div className="w-8 h-8 rounded-full bg-accent-success/10 flex items-center justify-center text-accent-success shrink-0 mt-0.5">
                            <CheckCircle2 size={16} />
                         </div>
                         <p className="text-xs text-primary/70 italic leading-relaxed font-medium">
                           "By creating an account, you agree to comply with system-wide reimbursement policies and automated auditing procedures."
                         </p>
                      </div>
                   </motion.div>
                 )}
              </AnimatePresence>

              <div className="flex items-center gap-4 pt-4">
                 {formStep === 2 && (
                   <button 
                     type="button"
                     onClick={() => setFormStep(1)}
                     className="h-14 px-6 border border-gray-100 rounded-xl font-bold text-gray-400 hover:bg-gray-50 transition-colors"
                   >
                      Back
                   </button>
                 )}
                 <button 
                   type="submit" 
                   disabled={isLoading}
                   className="flex-1 h-14 bg-primary text-white rounded-xl font-extrabold text-lg flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
                 >
                    {isLoading ? (
                       <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                    ) : (
                       <>
                         {formStep === 1 ? "Next Progression" : "Initialize Account"}
                         <ArrowRight size={20} />
                       </>
                    )}
                 </button>
              </div>
           </form>

           <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-400 font-medium tracking-tight">
                 Already have a corporate ID? 
                 <Link to="/login" className="text-primary font-black ml-1.5 hover:underline decoration-2">Login Securely</Link>
              </p>
           </div>
        </div>

        <div className="mt-12 text-center flex items-center justify-center gap-6 overflow-hidden">
           {['GDPR', 'SOC2', 'PCI-DSS'].map((compliance) => (
             <div key={compliance} className="flex items-center gap-2 group cursor-default">
                <div className="w-1 h-1 bg-gray-200 rounded-full group-hover:bg-primary transition-colors"></div>
                <span className="text-[10px] font-black text-gray-300 group-hover:text-primary transition-colors tracking-widest">{compliance}</span>
             </div>
           ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;

