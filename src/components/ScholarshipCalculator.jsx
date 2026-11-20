import React, { useState } from 'react';
import { 
  Calculator, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  ShieldCheck,
  Building2,
  Wallet
} from 'lucide-react';

export default function ScholarshipCalculator() {
  const [actualFee, setActualFee] = useState(2075); // Standard DTE Karnataka Govt Polytechnic annual tuition fee
  const [selectedScheme, setSelectedScheme] = useState('SSP');
  const [casteCategory, setCasteCategory] = useState('SC_ST');

  // Exact scholarship maximum caps as specified by user
  const scholarshipCaps = {
    SSP: 5000,         // SSP Scholarship: Up to ₹5,000
    LABOUR_CARD: 12000, // Labour Card Scholarship: Up to ₹12,000
    VIDYASIRI: 15000,   // Vidyasiri (FAAS): Up to ₹15,000 (₹1,500 x 10 months)
    NONE: 0
  };

  const calculateRemaining = () => {
    const fee = Number(actualFee) || 0;
    const maxAssistance = scholarshipCaps[selectedScheme] || 0;

    // Remaining fee payable: if assistance exceeds the fee, remaining payable is ₹0
    const remainingFee = Math.max(0, fee - maxAssistance);
    const assistanceApplied = Math.min(fee, maxAssistance);

    return {
      fee,
      maxAssistance,
      assistanceApplied,
      remainingFee
    };
  };

  const results = calculateRemaining();

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3.5 py-1 rounded-full mb-3">
          <Calculator className="w-3.5 h-3.5 text-emerald-700" />
          <span>Government of Karnataka Guidelines</span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Diploma Scholarship & Fee Estimator
        </h2>
        <p className="text-slate-500 text-sm mt-2">
          Calculate your estimated financial scholarship assistance and net fee payable under official Karnataka Government schemes.
        </p>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          
          {/* Left Form: Inputs */}
          <div className="md:col-span-7 p-6 sm:p-8 space-y-5 border-b md:border-b-0 md:border-r border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Enter Your Actual Semester / Annual College Fee (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-sm font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={actualFee}
                  onChange={(e) => setActualFee(e.target.value)}
                  placeholder="e.g. 2075"
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Standard DTE Karnataka Govt Polytechnic tuition fee is ₹2,075/year.
              </span>
            </div>

            {/* Applicable Scholarship Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Select Applicable Scholarship Scheme
              </label>
              <div className="space-y-2">
                <label className={`flex items-start space-x-3 p-3 rounded-xl border cursor-pointer transition ${
                  selectedScheme === 'SSP' ? 'bg-blue-50/70 border-blue-400 shadow-xs' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}>
                  <input
                    type="radio"
                    name="scholarshipScheme"
                    value="SSP"
                    checked={selectedScheme === 'SSP'}
                    onChange={() => setSelectedScheme('SSP')}
                    className="mt-1 w-4 h-4 text-blue-700"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      State Scholarship Portal (SSP Karnataka)
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Post-Matric scholarship for SC/ST/OBC/Minority students. <strong className="text-blue-900">Up to ₹5,000 assistance</strong>.
                    </div>
                  </div>
                </label>

                <label className={`flex items-start space-x-3 p-3 rounded-xl border cursor-pointer transition ${
                  selectedScheme === 'LABOUR_CARD' ? 'bg-amber-50/70 border-amber-400 shadow-xs' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}>
                  <input
                    type="radio"
                    name="scholarshipScheme"
                    value="LABOUR_CARD"
                    checked={selectedScheme === 'LABOUR_CARD'}
                    onChange={() => setSelectedScheme('LABOUR_CARD')}
                    className="mt-1 w-4 h-4 text-amber-700"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      Karnataka Labour Card Scholarship (KBOCWWB)
                    </div>
                    <div className="text-[11px] text-slate-500">
                      For children of registered construction workers. <strong className="text-amber-900">Up to ₹12,000 assistance</strong>.
                    </div>
                  </div>
                </label>

                <label className={`flex items-start space-x-3 p-3 rounded-xl border cursor-pointer transition ${
                  selectedScheme === 'VIDYASIRI' ? 'bg-emerald-50/70 border-emerald-400 shadow-xs' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}>
                  <input
                    type="radio"
                    name="scholarshipScheme"
                    value="VIDYASIRI"
                    checked={selectedScheme === 'VIDYASIRI'}
                    onChange={() => setSelectedScheme('VIDYASIRI')}
                    className="mt-1 w-4 h-4 text-emerald-700"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      Vidyasiri Food & Accommodation Scheme (FAAS)
                    </div>
                    <div className="text-[11px] text-slate-500">
                      For rural students residing &gt; 5 km without govt hostel seat. <strong className="text-emerald-900">₹1,500/month (Up to ₹15,000/year)</strong>.
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Category selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Social Welfare Category
              </label>
              <select
                value={casteCategory}
                onChange={(e) => setCasteCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-none"
              >
                <option value="SC_ST">SC / ST (Social Welfare Department)</option>
                <option value="CAT_1">Category-1 (BCWD)</option>
                <option value="2A_2B_3A_3B">2A / 2B / 3A / 3B (Backward Classes)</option>
                <option value="MINORITY">Minorities Welfare (Muslim / Christian / Jain / Sikh / Buddhist)</option>
                <option value="GENERAL">General / Open Merit (EWS)</option>
              </select>
            </div>
          </div>

          {/* Right Panel: Result Breakdown */}
          <div className="md:col-span-5 bg-slate-900 text-white p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
                <Wallet className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Estimated Fee Calculation
                </h4>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Actual College Fee:</span>
                  <span className="font-mono font-bold text-white">₹{results.fee}</span>
                </div>

                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>Max Scholarship Assistance:</span>
                  <span className="font-mono">Up to ₹{results.maxAssistance}</span>
                </div>

                <div className="flex justify-between text-slate-400 pt-2 border-t border-slate-800">
                  <span>Assistance Applicable:</span>
                  <span className="font-mono text-emerald-300">- ₹{results.assistanceApplied}</span>
                </div>
              </div>

              {/* Final Remaining Payable Amount */}
              <div className="pt-4 border-t-2 border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                  ESTIMATED REMAINING PAYABLE FEE
                </span>
                <div className="text-3xl font-black text-amber-400 font-mono mt-1">
                  ₹{results.remainingFee}
                </div>
                {results.remainingFee === 0 && (
                  <span className="inline-block text-[11px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2.5 py-0.5 rounded-full mt-2">
                    ✓ Full Scholarship Coverage
                  </span>
                )}
              </div>
            </div>

            {/* Mandatory Government Rules Disclaimer */}
            <div className="mt-6 pt-4 border-t border-slate-800 space-y-1.5 text-[10px] text-slate-400 leading-relaxed">
              <div className="flex items-center space-x-1.5 text-amber-300 font-bold">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Important Government Guidelines:</span>
              </div>
              <p>
                • These are maximum assistance amounts. Actual eligibility and sanctioned amounts depend on latest Government of Karnataka rules, income certificate validity, and departmental e-attestation.
              </p>
              <p>
                • This calculator is for estimation and student guidance only and does not constitute a legal guarantee of scholarship sanction.
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
