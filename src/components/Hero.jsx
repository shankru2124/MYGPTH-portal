import React from 'react';
import { 
  BookOpen, 
  Calendar, 
  Award, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Building2,
  FileText,
  CreditCard,
  Calculator
} from 'lucide-react';

export default function Hero({ collegeInfo = {}, setActiveTab }) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-blue-950 via-slate-900 to-slate-900 text-white pt-8 pb-16 sm:py-20">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <div className="h-12 w-auto px-2 py-1 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/15 flex items-center shadow-xs">
                <img src="/logo.png" alt="MYGPTH Logo" className="h-10 w-auto object-contain brightness-110" />
              </div>
              <div className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>DTE Karnataka • Admissions Open for Academic Year 2026 – 2027</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white">
              Shaping Future Engineers with <span className="bg-gradient-to-r from-blue-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">Polytechnic Excellence</span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
              Premier Government Technical Institution under Department of Technical Education (DTE), Govt. of Karnataka. Offering AICTE-approved 3-year Diploma Engineering in four branches: <strong>Computer Science & Engineering (CSE)</strong>, <strong>Civil Engineering (CE)</strong>, <strong>Mechanical Engineering (ME)</strong>, and <strong>Electronics & Communication Engineering (ECE)</strong> with modern laboratories, C-25 Outcome-Based Syllabus, and direct SSP, Labour Card, and Vidyasiri scholarship support.
            </p>

            {/* Quick CTA Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => setActiveTab('internalmarks')}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-3 rounded-xl shadow-lg shadow-blue-600/30 flex items-center space-x-2 text-sm transition transform hover:-translate-y-0.5 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-amber-300" />
                <span>Internal Marks (CIE)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('academics')}
                className="bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 font-semibold px-5 py-3 rounded-xl flex items-center space-x-2 text-sm transition cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-teal-400" />
                <span>C-25 & C-20 Syllabus</span>
              </button>

              <button
                onClick={() => setActiveTab('examfee')}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-3 rounded-xl shadow-md flex items-center space-x-2 text-sm transition cursor-pointer"
              >
                <CreditCard className="w-4 h-4 text-slate-950" />
                <span>Pay Exam Fee (K2)</span>
              </button>
            </div>

            {/* Accreditation Highlights */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-300">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>AICTE New Delhi Approved</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Govt. DTE Recognized</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>4 Core Diploma Branches</span>
              </div>
            </div>
          </div>

          {/* Right Hero Stats Card */}
          <div className="lg:col-span-5">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between pb-4 border-b border-slate-700/60 mb-5">
                <div>
                  <h3 className="font-bold text-white text-base">Key Academic Indicators</h3>
                  <p className="text-xs text-slate-400">
                    Government Institution Code: {collegeInfo.examCenterCode || '111'}
                  </p>
                </div>
                <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                  ESTD. {collegeInfo.established || '1984'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
                  <div className="text-2xl sm:text-3xl font-extrabold text-blue-400">
                    {collegeInfo.stats?.students || '1,200+'}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Enrolled Diploma Engineers</div>
                </div>

                <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
                    {collegeInfo.stats?.passRate || '94.6%'}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Board Exam Pass Rate</div>
                </div>

                <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
                  <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">
                    {collegeInfo.stats?.labs || '20 Labs'}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Specialized Tech Laboratories</div>
                </div>

                <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
                  <div className="text-2xl sm:text-3xl font-extrabold text-purple-400">
                    {collegeInfo.stats?.faculty || '50+'}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Qualified Faculty & HODs</div>
                </div>
              </div>

              {/* Quick Link Card inside banner */}
              <div className="mt-5 p-3.5 bg-gradient-to-r from-blue-900/50 to-indigo-900/50 border border-blue-600/40 rounded-2xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-600 rounded-xl text-white">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Continuous Internal Evaluation</h4>
                    <p className="text-[11px] text-blue-200">Semester CIE Marks Statements Released</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('internalmarks')}
                  className="text-xs bg-white text-blue-950 font-bold px-3 py-1.5 rounded-lg hover:bg-blue-50 transition cursor-pointer"
                >
                  View Marks
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
