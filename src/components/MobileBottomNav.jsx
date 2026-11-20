import React from 'react';
import { Home, BookOpen, FileText, CreditCard, Bell, Lock } from 'lucide-react';

export default function MobileBottomNav({ activeTab, setActiveTab, onOpenAdmin }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'internalmarks', label: 'CIE Marks', icon: FileText },
    { id: 'academics', label: 'Syllabus', icon: BookOpen },
    { id: 'examfee', label: 'K2 Fee', icon: CreditCard },
    { id: 'notices', label: 'Notices', icon: Bell },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center py-1 px-2 rounded-xl transition cursor-pointer ${
                isActive ? 'text-blue-800 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-blue-800 stroke-[2.5]' : 'text-slate-400'}`} />
              <span className="text-[10px] mt-0.5">{tab.label}</span>
            </button>
          );
        })}

        {/* Admin CMS Button */}
        <button
          onClick={onOpenAdmin}
          className="flex flex-col items-center py-1 px-2 rounded-xl text-amber-700 font-bold transition cursor-pointer"
        >
          <div className="p-1 rounded-lg bg-amber-100 text-amber-800">
            <Lock className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] mt-0.5">Admin</span>
        </button>
      </div>
    </div>
  );
}
