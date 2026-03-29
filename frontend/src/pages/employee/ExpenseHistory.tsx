import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  ExternalLink, 
  MoreVertical, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  AlertTriangle,
  Receipt,
  Eye,
  Trash2,
  Calendar,
  Tag,
  Hash,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const statusStyles = {
  Approved: "bg-accent-success/10 text-accent-success border-accent-success/10",
  Pending: "bg-accent-warning/10 text-accent-warning border-accent-warning/10",
  Rejected: "bg-accent-risk/10 text-accent-risk border-accent-risk/10",
  Draft: "bg-gray-100 text-gray-500 border-gray-200"
};

const mockExpenses = [
  { id: 'EXP-9021', vendor: 'Starbucks', category: 'Meals', amount: 42.50, currency: 'USD', date: '2025-09-24', status: 'Approved', risk: 'Safe' },
  { id: 'EXP-9022', vendor: 'Uber Technologies', category: 'Travel', amount: 120.00, currency: 'EUR', date: '2025-09-25', status: 'Pending', risk: 'Review' },
  { id: 'EXP-9023', vendor: 'Amazon Web Services', category: 'Supplies', amount: 310.45, currency: 'USD', date: '2025-09-26', status: 'Draft', risk: 'Safe' },
  { id: 'EXP-9024', vendor: 'Grand Hyatt NYC', category: 'Travel', amount: 890.00, currency: 'USD', date: '2025-08-15', status: 'Approved', risk: 'Safe' },
  { id: 'EXP-9025', vendor: 'Cisco Systems', category: 'Others', amount: 2450.00, currency: 'USD', date: '2025-08-10', status: 'Rejected', risk: 'Risk' },
  { id: 'EXP-9026', vendor: 'Delta Airlines', category: 'Travel', amount: 1250.00, currency: 'USD', date: '2025-08-05', status: 'Approved', risk: 'Safe' },
  { id: 'EXP-9027', vendor: 'Office Depot', category: 'Supplies', amount: 15.20, currency: 'USD', date: '2025-08-01', status: 'Approved', risk: 'Safe' },
];

const ExpenseHistory = () => {
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredExpenses = mockExpenses.filter(exp => {
    const matchesStatus = filterStatus === 'All' || exp.status === filterStatus;
    const matchesSearch = exp.vendor.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          exp.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          exp.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-primary tracking-tight">Expense History</h1>
          <p className="text-gray-400 text-sm mt-1">Manage and track your reimbursement requests.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-500 flex items-center gap-2 hover:bg-gray-50 transition duration-200">
             <Download size={18} /> Export CSV
          </button>
          <button className="btn-primary gap-2">
             <Receipt size={18} /> New Request
          </button>
        </div>
      </div>

      <div className="card border-none shadow-xl bg-white p-0 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row items-center justify-between gap-4">
           <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-80 group">
                 <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                 <input 
                   type="text" 
                   placeholder="Search vendor, category or ID..." 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="w-full bg-gray-50 border border-transparent rounded-lg pl-10 pr-4 py-2.5 text-sm focus:bg-white focus:border-primary/20 outline-none transition-all"
                 />
              </div>
              <button className="p-2.5 border border-gray-100 rounded-lg text-gray-400 hover:text-primary hover:bg-gray-50 transition duration-200">
                 <Filter size={20} />
              </button>
           </div>
           
           <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
              {['All', 'Approved', 'Pending', 'Rejected', 'Draft'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={twMerge(
                    "px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 whitespace-nowrap",
                    filterStatus === status 
                      ? "bg-primary text-white shadow-md shadow-primary/20" 
                      : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                  )}
                >
                  {status}
                </button>
              ))}
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50 text-gray-400 uppercase text-[10px] font-bold tracking-widest border-b border-gray-50">
              <tr>
                <th className="px-6 py-5 flex items-center gap-2"><Hash size={12} /> Expense ID</th>
                <th className="px-6 py-5"><User size={12} className="inline mr-2" /> Vendor</th>
                <th className="px-6 py-5"><Tag size={12} className="inline mr-2" /> Category</th>
                <th className="px-6 py-5"><Calendar size={12} className="inline mr-2" /> Date</th>
                <th className="px-6 py-5 text-right">Amount</th>
                <th className="px-6 py-5 text-center">Trust Risk</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50/50">
              <AnimatePresence>
                {filteredExpenses.map((exp, idx) => (
                  <motion.tr 
                    key={exp.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-primary/5 group transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 font-bold text-primary">{exp.id}</td>
                    <td className="px-6 py-4">
                       <span className="font-semibold text-gray-700">{exp.vendor}</span>
                    </td>
                    <td className="px-6 py-4">
                       <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-md text-[10px] font-bold uppercase tracking-tight">{exp.category}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{exp.date}</td>
                    <td className="px-6 py-4 text-right">
                       <span className="font-extrabold text-gray-900">{exp.currency} {exp.amount.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex justify-center">
                         <span className={clsx(
                           "flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                           exp.risk === 'Safe' ? "bg-accent-success/5 text-accent-success border-accent-success/20" :
                           exp.risk === 'Review' ? "bg-accent-warning/5 text-accent-warning border-accent-warning/20" :
                           "bg-accent-risk/5 text-accent-risk border-accent-risk/20"
                         )}>
                            {exp.risk === 'Safe' && <CheckCircle2 size={10} />}
                            {exp.risk === 'Review' && <AlertTriangle size={10} />}
                            {exp.risk === 'Risk' && <XCircle size={10} />}
                            {exp.risk}
                         </span>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className={twMerge(
                         "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest border transition-all duration-300",
                         statusStyles[exp.status as keyof typeof statusStyles]
                       )}>
                          {exp.status === 'Approved' && <CheckCircle2 size={12} />}
                          {exp.status === 'Pending' && <Clock size={12} />}
                          {exp.status === 'Rejected' && <XCircle size={12} />}
                          {exp.status}
                       </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition duration-200">
                         <button className="p-2 text-gray-400 hover:text-primary hover:bg-white rounded-lg transition-colors shadow-sm border border-transparent hover:border-gray-100">
                            <Eye size={16} />
                         </button>
                         <button className="p-2 text-gray-400 hover:text-accent-risk hover:bg-white rounded-lg transition-colors shadow-sm border border-transparent hover:border-gray-100">
                            <Trash2 size={16} />
                         </button>
                         <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors shadow-sm border border-transparent hover:border-gray-100">
                            <MoreVertical size={16} />
                         </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filteredExpenses.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-50/30">
             <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 mb-4 animate-pulse">
                <Receipt size={40} />
             </div>
             <p className="text-xl font-bold text-gray-400">No expenses found</p>
             <p className="text-sm text-gray-300">Try adjusting your filters or search terms.</p>
          </div>
        )}

        <div className="p-6 border-t border-gray-50 flex items-center justify-between">
           <p className="text-xs text-gray-400 font-medium">Showing <span className="font-bold text-gray-600">{filteredExpenses.length}</span> results</p>
           <div className="flex items-center gap-2">
              <button disabled className="p-2 rounded-lg border border-gray-100 text-gray-300 cursor-not-allowed">Previous</button>
              <button className="px-4 py-2 rounded-lg bg-primary/10 text-primary text-xs font-bold ring-1 ring-primary/20">1</button>
              <button className="px-4 py-2 rounded-lg text-xs font-bold text-gray-400 hover:bg-gray-50 transition-colors">2</button>
              <button className="p-2 rounded-lg border border-gray-100 text-gray-500 hover:bg-gray-50 transition-colors">Next</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseHistory;
