import React from 'react';
import { Bell, Search, Settings, HelpCircle, ChevronDown, UserCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Header = () => {
  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-50">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-80 max-w-sm group">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition duration-200" />
          <input 
            type="text" 
            placeholder="Search expenses, reports..." 
            className="w-full bg-gray-50 border border-transparent rounded-full pl-10 pr-4 py-2 text-sm focus:bg-white focus:border-primary/20 outline-none transition duration-200"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 border-r border-gray-100 pr-6">
          <button className="text-gray-400 hover:text-primary transition duration-200 relative">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent-risk rounded-full border-2 border-white"></span>
          </button>
          <button className="text-gray-400 hover:text-primary transition duration-200">
            <HelpCircle size={20} />
          </button>
          <button className="text-gray-400 hover:text-primary transition duration-200">
            <Settings size={20} />
          </button>
        </div>

        <div className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 px-2 py-1 rounded-lg transition duration-200">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
             <UserCircle size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold group-hover:text-primary transition duration-200">Sarah Mitchell</span>
            <span className="text-[10px] text-gray-400 flex items-center gap-1 font-bold tracking-wider">
               MANAGEMENT <ChevronDown size={10} />
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

