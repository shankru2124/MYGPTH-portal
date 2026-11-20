import React from 'react';
import { Laptop, Wrench, Building, Cpu, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Departments({ departments, onSelectDepartment, collegeInfo = {} }) {
  // Map icons for the ONLY 4 departments
  const iconMap = {
    CSE: Laptop,
    CE: Building,
    ME: Wrench,
    ECE: Cpu
  };

  // Strictly filter only the 4 departments: CSE, CE, ME, ECE
  const validBranchIds = ['CSE', 'CE', 'ME', 'ECE'];
  const fourDepartments = (departments || []).filter(d => validBranchIds.includes(d.id));

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full mb-3">
          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
          <span>DTE Karnataka Approved Branches</span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Diploma Engineering Departments
        </h2>
        <p className="text-slate-500 text-sm mt-2">
          {collegeInfo?.name || 'Government Polytechnic, Harihara'} offers 3-year AICTE-approved diploma programs in four core engineering disciplines with modern laboratories and experienced government faculty.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {fourDepartments.map((dept) => {
          const Icon = iconMap[dept.id] || Laptop;
          return (
            <div
              key={dept.id}
              className="bg-white rounded-3xl border border-slate-200 hover:border-blue-500 p-6 shadow-xs hover:shadow-xl transition flex flex-col justify-between group"
            >
              <div>
                {/* Header Icon & Intake Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-800 group-hover:scale-110 group-hover:bg-blue-800 group-hover:text-white transition">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                    Intake: {dept.intake} Seats
                  </span>
                </div>

                <div className="flex items-center space-x-2 mb-1.5">
                  <span className="font-mono text-xs font-black text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200/60">
                    Branch: {dept.code}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">
                  {dept.name}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {dept.description}
                </p>

                {/* HOD Info */}
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 mb-4 text-xs">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                    HEAD OF DEPARTMENT
                  </span>
                  <span className="font-bold text-slate-900">{dept.hod}</span>
                </div>

                {/* Core Laboratories */}
                <div className="space-y-1.5 mb-6">
                  <span className="text-[11px] font-bold text-slate-700 block uppercase tracking-wider">
                    Specialized Laboratories:
                  </span>
                  {dept.labs?.map((lab, i) => (
                    <div key={i} className="text-xs text-slate-500 flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0"></span>
                      <span className="line-clamp-1">{lab}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onSelectDepartment(dept.id)}
                className="w-full bg-slate-50 group-hover:bg-blue-800 group-hover:text-white text-slate-700 text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center space-x-2 border border-slate-200 group-hover:border-blue-800"
              >
                <span>View {dept.code} Syllabus</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
