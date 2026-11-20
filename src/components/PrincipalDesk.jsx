import React from 'react';
import { Award, ShieldAlert, FileText, CheckCircle2, Phone, Mail, User, ShieldCheck } from 'lucide-react';

export default function PrincipalDesk({ principal, committees, collegeInfo }) {
  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full mb-3">
          <Award className="w-3.5 h-3.5" />
          <span>Institutional Leadership & Governance</span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Principal's Desk & Mandatory Disclosures
        </h2>
        <p className="text-slate-500 text-sm mt-2">
          {collegeInfo?.name || 'Government Polytechnic, Harihara'} is committed to high ethical standards, academic rigor, and zero-tolerance towards ragging.
        </p>
      </div>

      {/* Principal's Message Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-4 flex flex-col items-center text-center">
            <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl overflow-hidden border-4 border-blue-100 shadow-md mb-4 bg-gradient-to-tr from-blue-900 via-blue-800 to-indigo-900 flex flex-col items-center justify-center text-white">
              {principal.photo && !principal.photo.includes('unsplash') ? (
                <img
                  src={principal.photo}
                  alt={principal.name || 'Principal'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-4">
                  <User className="w-16 h-16 text-blue-200 mb-1.5" />
                  <span className="text-xs font-bold text-amber-300">Office of the Principal</span>
                  <span className="text-[10px] text-blue-200">
                    {collegeInfo?.shortName || 'GPT Harihara'} (Code: {collegeInfo?.examCenterCode || '111'})
                  </span>
                </div>
              )}
            </div>
            <h3 className="text-lg font-bold text-slate-900 leading-tight">
              {principal.name || 'Principal'}
            </h3>
            <p className="text-xs text-blue-700 font-bold mt-0.5">
              {principal.designation || 'Principal & Professor'}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              {principal.qualification}
            </p>
            {principal.experience && (
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-mono mt-2">
                {principal.experience}
              </span>
            )}
          </div>

          <div className="md:col-span-8 space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <h4 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
              Message to Students & Parents
            </h4>
            <p className="italic bg-blue-50/50 p-4 rounded-2xl border border-blue-100 text-slate-800">
              "{principal.message}"
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Our Vision</span>
                <p className="text-xs text-slate-600">
                  {principal.vision || 'To be a premier technical education institution fostering skilled, ethically responsible diploma engineers capable of driving regional and national technological progress.'}
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Our Mission</span>
                <p className="text-xs text-slate-600">
                  {principal.mission || 'Provide quality hands-on laboratory training, promote 100% scholarship reach (SSP, Labour Card, Vidyasiri), and instill professionalism and entrepreneurial mindset.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mandatory Statutory Committees (Anti-Ragging, ICC, RTI) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Anti-Ragging */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-red-600 mb-3">
              <ShieldAlert className="w-5 h-5" />
              <h4 className="font-bold text-base text-slate-900">Anti-Ragging Squad</h4>
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Ragging is strictly prohibited on campus, classrooms, and hostels as per AICTE and Supreme Court directives. Zero tolerance policy enforced.
            </p>
            <div className="space-y-2 text-xs bg-red-50/50 p-3 rounded-xl border border-red-100 text-red-900 mb-4">
              <div><strong>Head:</strong> {committees?.antiRagging?.head}</div>
              <div><strong>Toll-Free Helpline:</strong> {committees?.antiRagging?.tollFree}</div>
              <div><strong>Campus Squad Phone:</strong> {committees?.antiRagging?.phone}</div>
            </div>
          </div>
          <span className="text-[10px] font-bold text-red-700 bg-red-100 px-3 py-1 rounded-full text-center block">
            Strict Punitive Action Guaranteed
          </span>
        </div>

        {/* ICC Women & Student Welfare */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-purple-600 mb-3">
              <ShieldCheck className="w-5 h-5" />
              <h4 className="font-bold text-base text-slate-900">Internal Complaints (ICC)</h4>
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Dedicated committee for prevention, prohibition, and redressal of sexual harassment of women staff and students on campus.
            </p>
            <div className="space-y-2 text-xs bg-purple-50/50 p-3 rounded-xl border border-purple-100 text-purple-900 mb-4">
              <div><strong>Presiding Officer:</strong> {committees?.icc?.presidingOfficer}</div>
              <div><strong>Members:</strong> {committees?.icc?.members}</div>
              <div><strong>Email:</strong> {committees?.icc?.email}</div>
            </div>
          </div>
          <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-3 py-1 rounded-full text-center block">
            Confidential In-Camera Redressal
          </span>
        </div>

        {/* RTI Officers */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-blue-600 mb-3">
              <FileText className="w-5 h-5" />
              <h4 className="font-bold text-base text-slate-900">Right to Information (RTI)</h4>
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Public authority disclosures under Section 4(1)(b) of the Right to Information Act 2005 for transparency in government operations.
            </p>
            <div className="space-y-2 text-xs bg-blue-50/50 p-3 rounded-xl border border-blue-100 text-blue-900 mb-4">
              <div><strong>PIO:</strong> {committees?.rti?.pio}</div>
              <div><strong>Appellate Authority:</strong> {committees?.rti?.faa}</div>
              <div><strong>Location:</strong> {committees?.rti?.office}</div>
            </div>
          </div>
          <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded-full text-center block">
            RTI Act 2005 Compliance
          </span>
        </div>
      </div>
    </div>
  );
}
