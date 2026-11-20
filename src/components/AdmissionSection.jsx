import React, { useState } from 'react';
import { 
  GraduationCap, 
  CheckCircle2, 
  FileText, 
  Send, 
  Phone, 
  Mail, 
  Sparkles,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { api } from '../services/api';

export default function AdmissionSection({ collegeInfo }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    branchInterest: 'CSE',
    sscPercentage: '',
    admissionType: 'First Year (After SSLC/10th)',
    scholarshipCategory: 'SSP Scholarship',
    notes: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // ONLY 4 DEPARTMENTS
  const fourBranches = [
    { id: 'CSE', name: 'Computer Science and Engineering (CSE)' },
    { id: 'CE', name: 'Civil Engineering (CE)' },
    { id: 'ME', name: 'Mechanical Engineering (ME)' },
    { id: 'ECE', name: 'Electronics and Communication (ECE)' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('Please fill in candidate name and phone number.');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');
      await api.submitInquiry(formData);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: '',
          phone: '',
          email: '',
          branchInterest: 'CSE',
          sscPercentage: '',
          admissionType: 'First Year (After SSLC/10th)',
          scholarshipCategory: 'SSP Scholarship',
          notes: ''
        });
      }, 5000);
    } catch (err) {
      setErrorMessage('Failed to submit enquiry. Please call the admission desk directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3.5 py-1 rounded-full mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Government of Karnataka • DTE Admissions 2026 – 2027</span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Diploma Admissions & Scholarships
        </h2>
        <p className="text-slate-500 text-sm mt-2">
          Centralized DTE Karnataka Diploma Seat Allotment in 4 branches with 100% government scholarship facilitation.
        </p>
      </div>

      {/* SCHOLARSHIPS STRIP (SSP, LABOUR CARD, VIDYASIRI) */}
      <div className="mb-10 bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-800 gap-3 mb-6">
          <div>
            <span className="text-amber-400 text-xs font-bold uppercase tracking-wider block">
              Official Student Scholarships Facilitated at GPT Harihara
            </span>
            <h3 className="text-xl font-bold text-white mt-0.5">
              Government Financial Assistance Schemes
            </h3>
          </div>
          <span className="text-xs bg-blue-500/20 text-blue-300 border border-blue-400/30 px-3 py-1 rounded-full self-start sm:self-auto font-mono">
            Direct Benefit Transfer (DBT)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* SSP */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded">SCHEME 1</span>
                <span className="text-[11px] text-blue-300 font-mono">Up to ₹5,000/yr</span>
              </div>
              <h4 className="text-base font-bold text-white mb-2">SSP Karnataka Post-Matric</h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                State Scholarship Portal for SC, ST, OBC (Cat-1, 2A, 2B, 3A, 3B), and Minority diploma students covering tuition and examination fees.
              </p>
            </div>
            <a
              href="https://ssp.postmatric.karnataka.gov.in/"
              target="_blank"
              rel="noreferrer"
              className="w-full bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold py-2 rounded-xl transition flex items-center justify-center space-x-1.5"
            >
              <span>SSP Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Labour Card */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded">SCHEME 2</span>
                <span className="text-[11px] text-amber-300 font-mono">Up to ₹12,000/yr</span>
              </div>
              <h4 className="text-base font-bold text-white mb-2">Labour Card Scholarship</h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Assistance for children of registered construction and building workers (Karmika Card holders) via Karnataka Labour Welfare Board.
              </p>
            </div>
            <a
              href="https://kbocwwb.karnataka.gov.in/"
              target="_blank"
              rel="noreferrer"
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold py-2 rounded-xl transition flex items-center justify-center space-x-1.5"
            >
              <span>Labour Board Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Vidyasiri */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded">SCHEME 3</span>
                <span className="text-[11px] text-emerald-300 font-mono">₹1,500 / month</span>
              </div>
              <h4 className="text-base font-bold text-white mb-2">Vidyasiri (FAAS) Scheme</h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Food & Accommodation stipend for rural backward classes students studying in Harihara who reside &gt; 5 km away without hostel allotment.
              </p>
            </div>
            <a
              href="https://karepass.cgg.gov.in/"
              target="_blank"
              rel="noreferrer"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 rounded-xl transition flex items-center justify-center space-x-1.5"
            >
              <span>Vidyasiri Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Eligibility & Documents */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <GraduationCap className="w-5 h-5 text-blue-800" />
              <span>DTE Karnataka Admission Eligibility</span>
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100">
                <h4 className="font-bold text-blue-950 mb-1">1. First Year 3-Year Diploma (After SSLC / 10th)</h4>
                <p className="text-slate-600 leading-relaxed">
                  Candidate must be an Indian citizen and have passed Karnataka SSLC (10th) with minimum <strong className="text-slate-900">35% aggregate marks</strong> with Science and Mathematics. Centralized online seat allotment through DTE Karnataka.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1">2. Direct Second Year Lateral Entry (3rd Semester)</h4>
                <p className="text-slate-600 leading-relaxed">
                  Passed 12th Science / PUC-2 (Physics & Math) or 2-Year ITI trade. Direct admission into 3rd Semester across CSE, CE, ME, and ECE.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center space-x-2">
              <FileText className="w-4 h-4 text-slate-700" />
              <span>Mandatory Documents Checklist for Admission & Scholarships</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Original SSLC Marks Card</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>7-Year Karnataka Study Certificate (BEO signed)</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Caste & Income Certificate (RD Number for SSP)</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Parent's Labour Card (for Labour Scholarship)</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Aadhaar Card (Linked with Bank Account NPCI)</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Transfer Certificate (TC) & 4 Passport Photos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Admission Inquiry Form (ONLY 4 BRANCHES) */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 bg-white p-6 sm:p-7 rounded-3xl border-2 border-blue-800 shadow-xl">
            <div className="mb-4">
              <span className="text-xs font-bold text-blue-800 uppercase tracking-wider block mb-1">
                Direct Guidance
              </span>
              <h3 className="text-xl font-bold text-slate-900">
                Online Admission & Scholarship Enquiry
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Submit your inquiry to receive admission counselling and scholarship e-attestation guidance.
              </p>
            </div>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-5 text-center text-emerald-900 animate-fadeIn space-y-1">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-1" />
                <h4 className="font-bold text-base">Enquiry Submitted to College Desk!</h4>
                <p className="text-xs text-emerald-700">
                  Our admission officer will contact you shortly on your provided phone number.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Candidate Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter student full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-blue-700 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 9448X XXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-blue-700 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      SSLC Score (%)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 78.50%"
                      value={formData.sscPercentage}
                      onChange={(e) => setFormData({ ...formData, sscPercentage: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-blue-700 focus:outline-none"
                    />
                  </div>
                </div>

                {/* ONLY 4 BRANCHES SELECTION */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Interested Diploma Branch (4 Branches Only) *
                  </label>
                  <select
                    value={formData.branchInterest}
                    onChange={(e) => setFormData({ ...formData, branchInterest: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-blue-900 focus:ring-2 focus:ring-blue-700 focus:outline-none"
                  >
                    {fourBranches.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Applicable Scholarship Scheme
                  </label>
                  <select
                    value={formData.scholarshipCategory}
                    onChange={(e) => setFormData({ ...formData, scholarshipCategory: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-blue-700 focus:outline-none"
                  >
                    <option value="SSP Scholarship">SSP Karnataka Post-Matric (Up to ₹5,000)</option>
                    <option value="Labour Card Scholarship">Labour Card Scholarship (Up to ₹12,000)</option>
                    <option value="Vidyasiri Scholarship">Vidyasiri FAAS (₹1,500/month)</option>
                    <option value="Need Guidance">Need guidance on scholarship eligibility</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Questions / Notes (Optional)
                  </label>
                  <textarea
                    rows="2"
                    placeholder="Bus route from Davanagere/Ranebennur, scholarship e-attestation question..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-700 focus:outline-none"
                  ></textarea>
                </div>

                {errorMessage && (
                  <p className="text-xs text-red-600 font-bold">{errorMessage}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold py-3 rounded-xl transition flex items-center justify-center space-x-2 text-xs sm:text-sm shadow-md shadow-blue-800/20 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Submitting...' : 'Submit Inquiry to GPT Harihara'}</span>
                </button>
              </form>
            )}

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Office: <strong className="text-slate-800 font-mono">{collegeInfo?.phone?.split('/')[0]}</strong></span>
              <span className="text-blue-800 font-bold">10:00 AM - 5:30 PM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
