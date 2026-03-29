import React from 'react';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  ArrowUpRight, 
  Receipt,
  Zap,
  MoreVertical
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { twMerge } from 'tailwind-merge';

const data = [
  { name: 'Jan', amount: 4000 },
  { name: 'Feb', amount: 3000 },
  { name: 'Mar', amount: 2000 },
  { name: 'Apr', amount: 2780 },
  { name: 'May', amount: 1890 },
  { name: 'Jun', amount: 2390 },
  { name: 'Jul', amount: 3490 },
];

const categoryData = [
  { name: 'Travel', value: 45, color: '#1e3a8a' },
  { name: 'Meals', value: 30, color: '#10b981' },
  { name: 'Supplies', value: 15, color: '#f59e0b' },
  { name: 'Others', value: 10, color: '#ef4444' },
];

const Dashboard = () => {
  const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
    <motion.div 
      whileHover={{ y: -5 }}
      className="card border-none shadow-lg bg-white overflow-hidden relative"
    >
      <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-5 ${color}`}></div>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
               <span className="text-accent-success text-xs font-bold flex items-center gap-0.5">
                 <ArrowUpRight size={12} /> {trend}%
               </span>
               <span className="text-gray-400 text-[10px] font-medium tracking-tight">vs last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-opacity-100`}>
          <Icon size={22} className={color.replace('bg-', 'text-')} />
        </div>
      </div>
    </motion.div>
  );

  const TrustScore = () => (
    <div className="card border-none shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-accent-success" size={24} />
          <h2 className="text-lg font-bold text-primary">Trust Score</h2>
        </div>
        <span className="px-2 py-1 bg-accent-success/10 text-accent-success text-[10px] font-bold rounded-full uppercase tracking-widest">Safe</span>
      </div>
      
      <div className="flex items-center justify-center py-4 relative">
        <svg className="w-40 h-40 transform -rotate-90">
          <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-100" />
          <circle 
            cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" 
            strokeDasharray={440} strokeDashoffset={440 - (440 * 92) / 100}
            className="text-accent-success" strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-extrabold text-primary">92</span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Excellent</span>
        </div>
      </div>

      <div className="space-y-3 mt-6">
        <div className="flex items-center justify-between text-sm">
           <span className="text-gray-500">Normal Range</span>
           <span className="text-accent-success font-bold">100%</span>
        </div>
        <div className="flex items-center justify-between text-sm">
           <span className="text-gray-500">Anomaly Rate</span>
           <span className="text-accent-success font-bold">0.4%</span>
        </div>
        <div className="flex items-center justify-between text-sm">
           <span className="text-gray-500">Match Accuracy</span>
           <span className="text-accent-success font-bold">98.2%</span>
        </div>
      </div>

      <div className="mt-8 p-4 bg-primary/5 rounded-xl border border-primary/10">
        <div className="flex items-center gap-2 mb-2">
           <Zap className="text-primary" size={16} />
           <span className="text-xs font-bold text-primary uppercase tracking-widest">AI Insights</span>
        </div>
        <p className="text-xs text-primary/70 leading-relaxed italic">
          "This expense is within normal range and matches your historical spending behavior. Highly likely to be auto-approved."
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-primary tracking-tight">Employee Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Efficiently manage your reimbursements with AI power.</p>
        </div>
        <button className="btn-primary shadow-lg shadow-primary/20 gap-2">
          <Receipt size={18} /> New Expense
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Spent" value="$12,480.00" icon={TrendingUp} color="bg-primary" trend="12.5" />
        <StatCard title="Pending Approval" value="$2,450.00" icon={Clock} color="bg-accent-warning" />
        <StatCard title="Approved" value="$9,800.00" icon={CheckCircle2} color="bg-accent-success" trend="4.2" />
        <StatCard title="Rejected" value="$230.00" icon={AlertCircle} color="bg-accent-risk" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="card border-none shadow-lg bg-white overflow-hidden p-0">
             <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                <div>
                   <h2 className="text-lg font-bold text-primary">Monthly Expense Trend</h2>
                   <p className="text-xs text-gray-400">Past 7 months overview</p>
                </div>
                <div className="flex items-center gap-2">
                   <button className="px-3 py-1 text-xs font-bold rounded-full bg-primary/10 text-primary">Yearly</button>
                   <button className="px-3 py-1 text-xs font-bold rounded-full text-gray-400 hover:bg-gray-50 transition duration-200">Monthly</button>
                </div>
             </div>
             <div className="h-80 w-full p-6">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={data}>
                   <defs>
                     <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.1}/>
                       <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                   <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                   <Tooltip 
                     contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} 
                   />
                   <Area type="monotone" dataKey="amount" stroke="#1e3a8a" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
          </div>

          <div className="card border-none shadow-lg bg-white p-0 overflow-hidden">
             <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                <h2 className="text-lg font-bold text-primary">Recent Expenses</h2>
                <button className="text-xs text-primary font-bold hover:underline">View All</button>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left text-sm">
                 <thead className="bg-gray-50/50 text-gray-400 uppercase text-[10px] font-bold tracking-widest">
                   <tr>
                     <th className="px-6 py-4">Expense ID</th>
                     <th className="px-6 py-4">Category</th>
                     <th className="px-6 py-4">Date</th>
                     <th className="px-6 py-4">Amount</th>
                     <th className="px-6 py-4">Status</th>
                     <th className="px-6 py-4">Action</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50">
                   {[
                     { id: '#EXP-9021', cat: 'Meals', date: '24 Sep, 2025', amt: '$420.00', status: 'Approved' },
                     { id: '#EXP-9022', cat: 'Travel', date: '25 Sep, 2025', amt: '$1,200.00', status: 'Pending' },
                     { id: '#EXP-9023', cat: 'Supplies', date: '26 Sep, 2025', amt: '$310.00', status: 'Draft' },
                   ].map((row, idx) => (
                     <tr key={idx} className="hover:bg-gray-50/50 transition duration-200">
                        <td className="px-6 py-4 font-bold text-primary">{row.id}</td>
                        <td className="px-6 py-4 text-gray-600">{row.cat}</td>
                        <td className="px-6 py-4 text-gray-500">{row.date}</td>
                        <td className="px-6 py-4 font-bold">{row.amt}</td>
                        <td className="px-6 py-4">
                           <span className={twMerge(
                             "px-2 py-1 rounded-full text-[10px] font-bold",
                             row.status === 'Approved' ? "bg-accent-success/10 text-accent-success" :
                             row.status === 'Pending' ? "bg-accent-warning/10 text-accent-warning" : "bg-gray-100 text-gray-400"
                           )}>
                             {row.status}
                           </span>
                        </td>
                        <td className="px-6 py-4">
                           <button className="text-gray-400 hover:text-primary transition duration-200">
                             <MoreVertical size={16} />
                           </button>
                        </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        </div>

        <div className="space-y-8">
           <TrustScore />
           <div className="card border-none shadow-lg bg-white">
              <h2 className="text-lg font-bold text-primary mb-6">Distribution</h2>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} width={70} />
                    <Tooltip 
                       cursor={{fill: 'transparent'}}
                       contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} 
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                 {categoryData.map((item, idx) => (
                   <div key={idx} className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full" style={{backgroundColor: item.color}}></div>
                     <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{item.name}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
