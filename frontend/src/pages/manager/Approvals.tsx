import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  User, 
  Calendar, 
  Tag, 
  Receipt,
  AlertTriangle,
  ExternalLink,
  Loader2,
  Check,
  X,
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

const approvalsData = [
  {
    id: 'REQ-101',
    user: 'Sarah Mitchell',
    role: 'Senior Developer',
    vendor: 'Starbucks NYC',
    category: 'Meals',
    date: '24 Sep, 2025',
    originalAmt: '42.50 USD',
    convertedAmt: '42.50 USD',
    trustScore: 98,
    risk: 'Safe',
    aiExplanation: 'Total amount is within the user\'s typical range for this category. No anomalies detected.',
    hasReceipt: true
  },
  {
    id: 'REQ-102',
    user: 'John Doe',
    role: 'Marketing Associate',
    vendor: 'Luxury Hotel Paris',
    category: 'Travel',
    date: '25 Sep, 2025',
    originalAmt: '1,200.00 EUR',
    convertedAmt: '1,296.00 USD',
    trustScore: 65,
    risk: 'Review',
    aiExplanation: 'Amount is 40% higher than typical travel expenses for this role. Matches user\'s travel itinerary.',
    hasReceipt: true
  },
  {
    id: 'REQ-103',
    user: 'Mike Johnson',
    role: 'Product Manager',
    vendor: 'Tech Conference 2025',
    category: 'Subscription',
    date: '26 Sep, 2025',
    originalAmt: '2,450.00 INR',
    convertedAmt: '30.00 USD',
    trustScore: 42,
    risk: 'Risk',
    aiExplanation: 'Duplicate detection: This receipt pattern matches an expense submitted 3 months ago.',
    hasReceipt: true
  }
];

const Approvals = () => {
  const [approvals, setApprovals] = useState(approvalsData);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleAction = (id: string, action: 'approve' | 'reject') => {
    setProcessingId(id);
    setTimeout(() => {
      setApprovals(prev => prev.filter(a => a.id !== id));
      setProcessingId(null);
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-extrabold text-primary tracking-tight">Manager Approvals</h1>
           <p className="text-gray-400 text-sm mt-1">Review and process reimbursement requests using AI-driven insights.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 rounded-full border border-primary/10">
           <History size={16} className="text-primary" />
           <span className="text-[10px] font-bold text-primary uppercase tracking-widest">View Historical Decisions</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence initial={false}>
          {approvals.length > 0 ? (
            approvals.map((req, idx) => (
              <motion.div 
                key={req.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="card border-none shadow-xl bg-white p-0 overflow-hidden flex flex-col lg:flex-row"
              >
                <div className="p-8 lg:w-1/3 border-b lg:border-b-0 lg:border-r border-gray-100 bg-gray-50/30">
                   <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary border-2 border-primary/20">
                         <User size={24} />
                      </div>
                      <div>
                         <h3 className="font-bold text-lg text-primary leading-tight">{req.user}</h3>
                         <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">{req.role}</p>
                      </div>
                   </div>

                   <div className="space-y-4">
                     <div className="flex items-center gap-3 text-sm">
                        <Receipt size={16} className="text-gray-400" />
                        <span className="text-gray-500 flex-1">{req.vendor}</span>
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px] font-bold uppercase">{req.category}</span>
                     </div>
                     <div className="flex items-center gap-3 text-sm">
                        <Calendar size={16} className="text-gray-400" />
                        <span className="text-gray-500">{req.date}</span>
                     </div>
                     <div className="flex items-center gap-3 text-sm">
                        <Tag size={16} className="text-gray-400" />
                        <span className="text-primary font-bold">{req.id}</span>
                     </div>
                   </div>

                   <div className="mt-8 pt-8 border-t border-gray-100">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Original Amount</p>
                      <h4 className="text-xl font-bold text-gray-700">{req.originalAmt}</h4>
                      <div className="flex items-center gap-2 mt-4 p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                         <div className="w-8 h-8 rounded-lg bg-accent-success/10 flex items-center justify-center text-accent-success">
                            <Zap size={16} fill="currentColor" />
                         </div>
                         <div className="flex-1">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Base Value (USD)</p>
                            <p className="text-lg font-black text-primary leading-tight">{req.convertedAmt}</p>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="flex-1 p-8 flex flex-col justify-between">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                           <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">AI Trust Score</h4>
                           <span className={twMerge(
                             "px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                             req.risk === 'Safe' ? "bg-accent-success/10 text-accent-success border-accent-success/20" :
                             req.risk === 'Review' ? "bg-accent-warning/10 text-accent-warning border-accent-warning/20" :
                             "bg-accent-risk/10 text-accent-risk border-accent-risk/20"
                           )}>
                             {req.risk}
                           </span>
                        </div>
                        <div className="flex items-center gap-4">
                           <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${req.trustScore}%` }}
                                className={twMerge(
                                  "h-full rounded-full transition-all duration-1000",
                                  req.trustScore > 80 ? "bg-accent-success shadow-[0_0_10px_rgba(16,185,129,0.3)]" :
                                  req.trustScore > 50 ? "bg-accent-warning shadow-[0_0_10px_rgba(245,158,11,0.3)]" : 
                                  "bg-accent-risk shadow-[0_0_10px_rgba(239,68,68,0.3)]"
                                )}
                              />
                           </div>
                           <span className="text-2xl font-black text-primary leading-none w-12">{req.trustScore}</span>
                        </div>
                        
                        <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 flex items-start gap-3">
                           <Zap size={18} className="text-primary shrink-0 mt-0.5" />
                           <p className="text-sm text-primary/80 italic leading-snug">
                             "{req.aiExplanation}"
                           </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                         <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Policy Scan Results</h4>
                         <div className="space-y-2">
                            <PolicyCheck label="Receipt Verification" valid={req.hasReceipt} />
                            <PolicyCheck label="Budget Limit Check" valid={req.risk !== 'Risk'} />
                            <PolicyCheck label="Duplicate Scan" valid={req.id !== 'REQ-103'} />
                            <PolicyCheck label="Merchant Credibility" valid={true} />
                         </div>
                         <button className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2">
                           <ExternalLink size={14} /> View Full Breakdown
                         </button>
                      </div>
                   </div>

                   <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
                      {processingId === req.id ? (
                        <div className="w-full h-14 bg-gray-50 rounded-xl flex items-center justify-center gap-3">
                           <Loader2 className="animate-spin text-primary" size={24} />
                           <p className="font-bold text-primary animate-pulse">Processing decision...</p>
                        </div>
                      ) : (
                        <>
                          <button 
                            onClick={() => handleAction(req.id, 'reject')}
                            className="flex-1 h-14 bg-white border-2 border-accent-risk text-accent-risk hover:bg-accent-risk hover:text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-accent-risk/10"
                          >
                             <XCircle size={20} /> Reject Request
                          </button>
                          <button 
                            onClick={() => handleAction(req.id, 'approve')}
                            className="flex-1 h-14 bg-accent-success text-white hover:bg-accent-success/90 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-accent-success/20"
                          >
                             <CheckCircle2 size={20} /> Approve & Settle
                          </button>
                        </>
                      )}
                   </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-32 flex flex-col items-center justify-center bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100">
               <div className="w-24 h-24 bg-accent-success/10 rounded-full flex items-center justify-center text-accent-success mb-6 shadow-glow shadow-accent-success/10">
                  <Check size={48} strokeWidth={3} />
               </div>
               <h3 className="text-3xl font-black text-primary">Inbox Empty!</h3>
               <p className="text-gray-400 font-medium max-w-sm text-center mt-2 leading-relaxed">
                 You've processed all reimbursement requests. Your inbox is sparkling clean.
               </p>
               <button onClick={() => window.location.reload()} className="mt-8 text-primary font-bold hover:underline flex items-center gap-2">
                  <Clock size={16} /> Load simulated data
               </button>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const PolicyCheck = ({ label, valid }: { label: string, valid: boolean }) => (
  <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-default group">
    <span className="text-xs font-semibold text-gray-500 group-hover:text-primary transition-colors">{label}</span>
    {valid ? (
      <div className="w-5 h-5 bg-accent-success text-white rounded-full flex items-center justify-center shadow-sm shadow-accent-success/20">
         <Check size={12} strokeWidth={4} />
      </div>
    ) : (
      <div className="w-5 h-5 bg-accent-risk text-white rounded-full flex items-center justify-center shadow-sm shadow-accent-risk/20">
         <X size={12} strokeWidth={4} />
      </div>
    )}
  </div>
);

export default Approvals;
