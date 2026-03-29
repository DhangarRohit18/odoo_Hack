import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FilePlus, ScrollText, UserCheck, ShieldCheck, LogOut, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Sidebar = () => {
  const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        twMerge(
          "flex items-center gap-3 px-4 py-3 text-gray-300 rounded-lg transition-all duration-200 hover:bg-white/10 hover:text-white",
          isActive && "bg-white/20 text-white font-medium shadow-sm border-r-4 border-accent-success rounded-r-none pl-5"
        )
      }
    >
      <Icon size={20} />
      <span>{label}</span>
    </NavLink>
  );

  return (
    <motion.aside
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className="w-64 bg-primary text-white flex flex-col h-screen shadow-xl"
    >
      <div className="p-6 flex items-center gap-3 border-b border-white/5">
        <div className="bg-white/10 p-2 rounded-lg">
          <Briefcase className="text-accent-success" size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">ODOO</h1>
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">Intelligent Reimburse</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 flex flex-col gap-1 overflow-y-auto">
        <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest px-4 mb-2">Employee</div>
        <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
        <NavItem to="/submit-expense" icon={FilePlus} label="Submit Expense" />
        <NavItem to="/history" icon={ScrollText} label="Expense History" />

        <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest px-4 mt-6 mb-2">Management</div>
        <NavItem to="/approvals" icon={UserCheck} label="Approvals" />
        <NavItem to="/admin" icon={ShieldCheck} label="Admin Panel" />
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5">
          <div className="w-8 h-8 rounded-full bg-accent-success/20 flex items-center justify-center text-accent-success font-bold text-sm">
            US
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">User Sarah</p>
            <p className="text-xs text-white/40 truncate italic">Employee</p>
          </div>
          <button className="text-white/40 hover:text-accent-risk transition duration-200">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
