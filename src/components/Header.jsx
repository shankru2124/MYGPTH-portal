import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Menu, 
  X, 
  Lock, 
  BookOpen, 
  Calendar, 
  Bell, 
  FileText, 
  Users, 
  Award,
  PhoneCall,
  Image,
  CreditCard,
  Calculator,
  ExternalLink,
  Download
} from 'lucide-react';
import { checkIsApp } from '../utils/appDetector';

export default function Header({ 
  collegeInfo = {}, 
  activeTab, 
  setActiveTab, 
  onOpenAdmin 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isApp, setIsApp] = useState(() => checkIsApp());

  useEffect(() => {
    setIsApp(checkIsApp());
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', icon: GraduationCap },
    { id: 'internalmarks', label: 'Internal Marks (CIE)', icon: FileText, highlight: true },
    { id: 'academics', label: 'Syllabus (C-25 & C-20)', icon: BookOpen },
    { id: 'examfee', label: 'Exam Fee (K2)', icon: CreditCard },
    { id: 'scholarships', label: 'Scholarships', icon: Calculator },
    { id: 'timetable', label: 'Timetable', icon: Calendar },
    { id: 'notices', label: 'Notices', icon: Bell },
    { id: 'departments', label: '4 Branches', icon: Award },
    { id: 'usefullinks', label: 'Useful Links', icon: ExternalLink },
    { id: 'gallery', label: 'Campus & Labs', icon: Image },
    { id: 'principal', label: "Principal's Desk", icon: Users },
    { id: 'admissions', label: 'Admissions 2026-27', icon: PhoneCall, cta: true }
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs transition-all">
      {/* Top Bar for Official Government Details */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center space-x-2 text-[11px] sm:text-xs">
            <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold border border-amber-500/30">
              ಕರ್ನಾಟಕ ಸರ್ಕಾರ • Govt. of Karnataka
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden sm:inline font-mono text-slate-300">
              {collegeInfo.code || 'Govt. Inst. Code: 111 | DTE Karnataka'}
            </span>
          </div>

          <div className="flex items-center space-x-2.5 text-[11px] sm:text-xs">
            {!isApp && (
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('trigger-pwa-install'))}
                className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white px-2.5 py-0.5 rounded font-bold transition shadow-xs cursor-pointer"
                title="Install MYGPTH App on your Android phone or computer"
              >
                <Download className="w-3 h-3 text-white" />
                <span>Install App</span>
              </button>
            )}
            <span className="hidden lg:inline text-slate-400">
              📞 Office: <span className="text-white font-medium">{collegeInfo.phone ? collegeInfo.phone.split('/')[0] : '+91 (08192) 242250'}</span>
            </span>
            <button
              onClick={onOpenAdmin}
              className="flex items-center space-x-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-2.5 py-0.5 rounded font-medium border border-amber-500/40 transition cursor-pointer"
              title="Staff & Admin Portal to upload Internal Marks, notices, syllabus"
            >
              <Lock className="w-3 h-3 text-amber-400" />
              <span>Admin / Staff CMS</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex items-center justify-between">
          {/* Logo & College Bilingual Name */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            {/* Official MYGPTH Logo */}
            <div className="h-12 w-auto sm:h-14 flex items-center justify-center group-hover:scale-105 transition transform shrink-0">
              <img 
                src="/logo.png" 
                alt="MYGPTH Logo" 
                className="h-11 sm:h-13 w-auto object-contain drop-shadow-xs" 
              />
            </div>
            <div>
              <div className="text-[11px] sm:text-xs font-bold text-amber-700 tracking-wide">
                {collegeInfo.kannadaName || 'ಸರ್ಕಾರಿ ಪಾಲಿಟೆಕ್ನಿಕ್, ಹರಿಹರ'}
              </div>
              <h1 className="text-sm sm:text-lg font-black tracking-tight text-slate-900 group-hover:text-blue-800 transition leading-tight">
                {collegeInfo.name || 'Government Polytechnic, Harihara'}
              </h1>
              <p className="text-[10px] sm:text-[11px] text-slate-500 line-clamp-1 max-w-md sm:max-w-xl font-medium">
                <span className="font-bold text-blue-900">MYGPTH</span> • Learn • Explore • Excel | {collegeInfo.code || 'Code: 111'}
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden xl:flex items-center space-x-1">
            {navItems.slice(0, 9).map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition cursor-pointer ${
                    isActive
                      ? 'bg-blue-50 text-blue-800 font-bold border border-blue-200 shadow-xs'
                      : 'text-slate-600 hover:text-blue-800 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-700' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Admissions CTA */}
            <button
              onClick={() => handleNavClick('admissions')}
              className={`ml-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'admissions'
                  ? 'bg-amber-600 text-white shadow-amber-600/30'
                  : 'bg-blue-800 hover:bg-blue-900 text-white shadow-blue-800/20'
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Admissions</span>
            </button>
          </div>

          {/* Tablet & Compact Nav Button */}
          <div className="hidden lg:flex xl:hidden items-center space-x-2">
            <button
              onClick={() => handleNavClick('internalmarks')}
              className="text-xs bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1.5 rounded-lg font-bold cursor-pointer"
            >
              Internal Marks
            </button>
            <button
              onClick={() => handleNavClick('examfee')}
              className="text-xs bg-amber-50 text-amber-900 border border-amber-300 px-3 py-1.5 rounded-lg font-bold cursor-pointer"
            >
              Pay Fee (K2)
            </button>
            <button
              onClick={() => handleNavClick('admissions')}
              className="text-xs bg-blue-800 text-white px-3 py-1.5 rounded-lg font-bold cursor-pointer"
            >
              Admissions
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer"
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 lg:hidden">
            <button
              onClick={() => handleNavClick('internalmarks')}
              className="text-[11px] bg-blue-50 text-blue-900 border border-blue-300 px-2 py-1 rounded-lg font-bold"
            >
              CIE Marks
            </button>
            <button
              onClick={() => handleNavClick('examfee')}
              className="text-[11px] bg-amber-50 text-amber-900 border border-amber-300 px-2 py-1 rounded-lg font-bold"
            >
              K2 Fee
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile / Tablet Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-1 shadow-xl animate-fadeIn max-h-[80vh] overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between cursor-pointer ${
                  isActive
                    ? 'bg-blue-50 text-blue-800 font-bold border border-blue-200'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-700' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.highlight && (
                  <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                    CIE PDFs
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full text-center py-2.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-300 font-semibold text-xs flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              <span>Staff & Admin Management Dashboard</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
