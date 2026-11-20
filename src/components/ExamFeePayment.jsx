import React from 'react';
import { 
  CreditCard, 
  ExternalLink, 
  ShieldCheck, 
  AlertCircle, 
  FileCheck, 
  HelpCircle, 
  Building2,
  Clock,
  CheckCircle2
} from 'lucide-react';

export default function ExamFeePayment() {
  const officialK2Url = "https://k2.karnataka.gov.in/";
  const officialDtekUrl = "https://dtek.karnataka.gov.in/";

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3.5 py-1 rounded-full mb-3">
          <CreditCard className="w-3.5 h-3.5 text-amber-700" />
          <span>Official Government of Karnataka Portal Link</span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Diploma Semester Examination Fee Payment
        </h2>
        <p className="text-slate-500 text-sm mt-2">
          Securely generate and pay your Board of Technical Examinations (BTE) Semester Examination Fee via the official Karnataka Khajane-II (K2) Challan Portal.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Official Payment Card & Direct CTA */}
        <div className="lg:col-span-7 bg-white rounded-3xl border-2 border-blue-600 shadow-xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center font-black text-xl shrink-0">
              K2
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
                Government of Karnataka Integrated Portal
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                Khajane-II (K2) Online Payment Portal
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            All Government Polytechnic, Harihara students must pay their Odd / Even semester theory and practical board examination fees directly through the official Government of Karnataka Khajane-II (K2) system.
          </p>

          {/* Security Disclaimer Banner */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-1.5">
            <div className="flex items-center space-x-2 font-bold text-amber-950">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Official Government Portal Notice:</span>
            </div>
            <p className="leading-relaxed">
              The actual fee transaction takes place <strong>exclusively on the official external Government of Karnataka K2 Portal</strong> (<span className="font-mono text-blue-900 font-semibold">{officialK2Url}</span>). The college website does not process payments or collect student banking credentials.
            </p>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <a
              href={officialK2Url}
              target="_blank"
              rel="noreferrer"
              className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold py-3.5 px-6 rounded-2xl transition flex items-center justify-center space-x-2 text-sm shadow-lg shadow-blue-800/25 group"
            >
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span>Pay Examination Fee on Official K2 Portal</span>
              <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition" />
            </a>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 pt-2 gap-2">
            <span>Verified Portal URL: <code className="text-blue-800 font-mono font-bold">k2.karnataka.gov.in</code></span>
            <a
              href={officialDtekUrl}
              target="_blank"
              rel="noreferrer"
              className="text-blue-700 hover:underline flex items-center space-x-1"
            >
              <span>DTE Karnataka Circulars</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Right: Step-by-Step Payment Instructions */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
          <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
            <FileCheck className="w-4 h-4 text-emerald-600" />
            <span>How to Generate & Pay K2 Challan</span>
          </h4>

          <ol className="space-y-3.5 text-xs text-slate-600 leading-relaxed">
            <li className="flex items-start space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="w-5 h-5 rounded-full bg-blue-800 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                1
              </span>
              <div>
                <strong className="text-slate-900 block font-semibold mb-0.5">Open Khajane-II Portal:</strong>
                Click the button on the left to navigate to the official K2 portal homepage and select <strong>"Generate Challan"</strong>.
              </div>
            </li>

            <li className="flex items-start space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="w-5 h-5 rounded-full bg-blue-800 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                2
              </span>
              <div>
                <strong className="text-slate-900 block font-semibold mb-0.5">Select Department & DDO:</strong>
                Choose <strong>Department of Technical Education</strong> and enter <strong>Harihara Polytechnic Institution Code: 111</strong>.
              </div>
            </li>

            <li className="flex items-start space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="w-5 h-5 rounded-full bg-blue-800 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                3
              </span>
              <div>
                <strong className="text-slate-900 block font-semibold mb-0.5">Enter Candidate Details:</strong>
                Provide your DTE Register Number, Student Name, Branch (CSE, CE, ME, ECE), and Semester.
              </div>
            </li>

            <li className="flex items-start space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="w-5 h-5 rounded-full bg-blue-800 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                4
              </span>
              <div>
                <strong className="text-slate-900 block font-semibold mb-0.5">Payment & Receipt Submission:</strong>
                Complete payment via UPI / Net Banking / Debit Card, or download the challan to pay at any authorized bank. Submit the student receipt copy to Room 3.
              </div>
            </li>
          </ol>

          <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-[11px] text-blue-900">
            <strong>Need Help?</strong> Visit the GPT Harihara Examination Counter during working hours (10:00 AM - 5:30 PM).
          </div>
        </div>
      </div>
    </div>
  );
}
