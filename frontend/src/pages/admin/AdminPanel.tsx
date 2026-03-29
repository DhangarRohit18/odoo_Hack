import React, { useState } from 'react';
import { 
  Settings, 
  Users, 
  Shield, 
  Activity, 
  Plus, 
  Search, 
  ArrowRight, 
  MoreVertical, 
  Key,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('users');

  const users = [
    { id: '1', name: 'Sarah Mitchell', email: 'sarah@company.com', role: 'Employee', status: 'Active', department: 'Engineering' },
    { id: '2', name: 'John Doe', email: 'john@company.com', role: 'Manager', status: 'Active', department: 'Marketing' },
    { id: '3', name: 'Mike Johnson', email: 'mike@company.com', role: 'Employee', status: 'Suspended', department: 'Product' },
  ];

  const rules = [
    { id: 'R1', name: 'Auto-Approval Threshold', value: '< $50.00', status: 'Enabled' },
    { id: 'R2', name: 'Receipt Required', value: '> $10.00', status: 'Enabled' },
    { id: 'R3', name: 'Duplicate Detection', value: 'High Sensitivity', status: 'Enabled' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-3xl font-extrabold text-primary tracking-tight">System Admin</h1>
           <p className="text-gray-400 text-sm mt-1">Configure global settings and manage platform users.</p>
        </div>
        <button className="btn-primary gap-2">
           <Plus size={18} /> Add New Entity
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <StatsCard title="Total Users" value="1,280" icon={Users} color="text-primary" />
         <StatsCard title="Active Rules" value="24" icon={Settings} color="text-accent-success" />
         <StatsCard title="Security Score" value="98%" icon={Shield} color="text-primary" />
         <StatsCard title="System Load" value="12%" icon={Activity} color="text-accent-warning" />
      </div>

      <div className="card border-none shadow-xl bg-white p-0 overflow-hidden">
        <div className="flex border-b border-gray-100">
           {['users', 'rules', 'settings', 'logs'].map((tab) => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={twMerge(
                 "px-8 py-5 text-sm font-bold uppercase tracking-widest transition-all duration-300 border-b-2",
                 activeTab === tab ? "border-primary text-primary" : "border-transparent text-gray-400 hover:text-gray-600"
               )}
             >
               {tab}
             </button>
           ))}
        </div>

        <div className="p-8">
           <AnimatePresence mode="wait">
             {activeTab === 'users' && (
               <motion.div 
                 key="users"
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 className="space-y-6"
               >
                  <div className="flex items-center justify-between">
                     <div className="relative w-80 group">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                        <input 
                          type="text" 
                          placeholder="Search users..." 
                          className="w-full bg-gray-50 border border-transparent rounded-lg pl-10 pr-4 py-2.5 text-sm focus:bg-white focus:border-primary/20 outline-none transition-all"
                        />
                     </div>
                     <div className="flex gap-2">
                        <button className="px-4 py-2 bg-gray-50 text-gray-400 rounded-lg text-xs font-bold hover:bg-gray-100 italic transition-colors">Filters</button>
                        <button className="px-4 py-2 bg-gray-50 text-gray-400 rounded-lg text-xs font-bold hover:bg-gray-100 italic transition-colors">Bulk Actions</button>
                     </div>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-gray-100">
                     <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50/50 text-gray-400 uppercase text-[10px] font-bold tracking-widest">
                           <tr>
                              <th className="px-6 py-4">User</th>
                              <th className="px-6 py-4">Role</th>
                              <th className="px-6 py-4">Department</th>
                              <th className="px-6 py-4">Status</th>
                              <th className="px-6 py-4"></th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                           {users.map((user) => (
                              <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                                 <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                       <div className="w-9 h-9 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                          <User size={18} />
                                       </div>
                                       <div>
                                          <p className="font-bold text-primary">{user.name}</p>
                                          <p className="text-xs text-gray-400">{user.email}</p>
                                       </div>
                                    </div>
                                 </td>
                                 <td className="px-6 py-4">
                                    <span className={twMerge(
                                       "px-2 py-1 rounded text-[10px] font-bold uppercase",
                                       user.role === 'Manager' ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600"
                                    )}>
                                       {user.role}
                                    </span>
                                 </td>
                                 <td className="px-6 py-4 font-medium text-gray-500">{user.department}</td>
                                 <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                       <div className={twMerge("w-2 h-2 rounded-full", user.status === 'Active' ? "bg-accent-success" : "bg-accent-risk")}></div>
                                       <span className="font-bold text-gray-600">{user.status}</span>
                                    </div>
                                 </td>
                                 <td className="px-6 py-4 text-right">
                                    <button className="p-2 text-gray-300 hover:text-primary transition-colors">
                                       <MoreVertical size={16} />
                                    </button>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </motion.div>
             )}

             {activeTab === 'rules' && (
               <motion.div 
                 key="rules"
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 className="grid grid-cols-1 md:grid-cols-3 gap-6"
               >
                  {rules.map((rule) => (
                     <div key={rule.id} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-primary/20 hover:shadow-lg transition-all duration-300 group">
                        <div className="flex items-center justify-between mb-4">
                           <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                              <Key size={20} />
                           </div>
                           <span className="text-[10px] font-bold text-accent-success bg-accent-success/10 px-2 py-1 rounded uppercase">{rule.status}</span>
                        </div>
                        <h4 className="font-bold text-primary mb-1">{rule.name}</h4>
                        <p className="text-2xl font-black text-primary/80 mb-4">{rule.value}</p>
                        <button className="text-[10px] font-extrabold text-primary uppercase tracking-widest flex items-center gap-2 hover:underline">
                           Edit Rule <ArrowRight size={12} />
                        </button>
                     </div>
                  ))}
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const StatsCard = ({ title, value, icon: Icon, color }: any) => (
  <div className="card border-none shadow-lg bg-white p-6 flex items-center gap-4">
     <div className={twMerge("p-3 bg-opacity-10 rounded-xl", color.replace('text-', 'bg-'))}>
        <Icon size={24} className={color} />
     </div>
     <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{title}</p>
        <p className="text-2xl font-black text-primary">{value}</p>
     </div>
  </div>
);

export default AdminPanel;
