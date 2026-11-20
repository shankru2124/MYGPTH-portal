import React from 'react';
import { GraduationCap, MapPin, Phone, Mail, Globe, Shield, Lock, ExternalLink, FileText, CreditCard, Calculator } from 'lucide-react';

export default function Footer({ collegeInfo = {}, setActiveTab, onOpenAdmin }) {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-24 md:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Col 1: College Intro */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-auto flex items-center justify-center p-1 bg-white/10 rounded-xl backdrop-blur-sm">
                <img 
                  src="/logo.png" 
                  alt="MYGPTH Logo" 
                  className="h-10 w-auto object-contain brightness-110" 
                />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base sm:text-lg leading-tight">
                  {collegeInfo.name || 'Government Polytechnic, Harihara'}
                </h3>
                <span className="text-[11px] text-amber-400 font-bold block">
                  {collegeInfo.kannadaName || 'ಸರ್ಕಾರಿ ಪಾಲಿಟೆಕ್ನಿಕ್, ಹರಿಹರ'} (MYGPTH)
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {collegeInfo.tagline || 'Department of Technical Education, Government of Karnataka'}. Approved by AICTE New Delhi, Directorate of Technical Education (DTE), Govt. of Karnataka.
            </p>
            <div className="pt-2 text-xs font-mono text-slate-400 space-y-1">
              <div>{collegeInfo.code || 'Govt. Inst. Code: 111'}</div>
              <div>{collegeInfo.accreditation || 'AICTE Approved | DTE Karnataka'}</div>
            </div>
          </div>

          {/* Col 2: Quick Academic Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide uppercase">
              Academic Hub
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveTab('internalmarks')} className="hover:text-white transition cursor-pointer flex items-center space-x-1">
                  <span>•</span>
                  <span>Semester Internal Marks (CIE)</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('academics')} className="hover:text-white transition cursor-pointer flex items-center space-x-1">
                  <span>•</span>
                  <span>C-25 & C-20 Syllabus</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('timetable')} className="hover:text-white transition cursor-pointer flex items-center space-x-1">
                  <span>•</span>
                  <span>Weekly Class Timetables</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('materials')} className="hover:text-white transition cursor-pointer flex items-center space-x-1">
                  <span>•</span>
                  <span>DTE Question Banks (PYQs)</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('faculty')} className="hover:text-white transition cursor-pointer flex items-center space-x-1">
                  <span>•</span>
                  <span>Faculty & HOD Directory</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Student Welfare & Portals */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide uppercase">
              Portals & Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveTab('examfee')} className="hover:text-amber-400 text-amber-300 font-semibold transition cursor-pointer flex items-center space-x-1">
                  <span>•</span>
                  <span>Pay Exam Fee (Khajane-2)</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('scholarships')} className="hover:text-white transition cursor-pointer flex items-center space-x-1">
                  <span>•</span>
                  <span>Scholarship Calculator</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('usefullinks')} className="hover:text-white transition cursor-pointer flex items-center space-x-1">
                  <span>•</span>
                  <span>Official Portals (SSP, Labour, DTE)</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('principal')} className="hover:text-white transition cursor-pointer flex items-center space-x-1">
                  <span>•</span>
                  <span>Anti-Ragging Squad (1800-180-5522)</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('admissions')} className="hover:text-emerald-400 text-emerald-300 font-semibold transition cursor-pointer flex items-center space-x-1">
                  <span>•</span>
                  <span>Admissions 2026-27</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Campus Contact */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide uppercase">
              Campus Contact
            </h4>
            <div className="space-y-2 text-xs text-slate-400 leading-relaxed">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>{collegeInfo.address || 'Shimoga Road, Near KSRTC Depot, Harihara - 577601'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{collegeInfo.phone ? collegeInfo.phone.split('/')[0] : '+91 (08192) 242250'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="truncate">{collegeInfo.email || 'principal.gptharihara@gmail.com'}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center space-x-1.5 text-xs text-amber-400 hover:text-amber-300 font-bold bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg transition cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Staff & Admin Panel</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © {new Date().getFullYear()} {collegeInfo.name || 'Government Polytechnic, Harihara'}. Department of Technical Education, Government of Karnataka.
          </div>
          <div className="flex items-center space-x-4 text-xs">
            <span>DTE Inst Code: 111</span>
            <span>•</span>
            <span>AICTE Approved</span>
            <span>•</span>
            <span>4 Core Branches (CSE, CE, ME, ECE)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
