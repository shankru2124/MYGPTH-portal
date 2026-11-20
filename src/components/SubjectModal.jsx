import React from 'react';
import { X, BookOpen, Clock, Download, Award, User, CheckCircle, FileText, ExternalLink, Calendar } from 'lucide-react';

export default function SubjectModal({ subject, onClose }) {
  if (!subject) return null;

  const notesUrl = subject.notesUrl || subject.pdfUrl;
  const hasNotes = Boolean(notesUrl && notesUrl.trim());

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 sm:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="font-mono text-xs font-extrabold bg-blue-100 text-blue-800 px-3 py-1 rounded-lg border border-blue-200">
            Course Code: {subject.code}
          </span>
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
            Semester {subject.semester} • {subject.scheme || 'C-25'} Scheme
          </span>
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
            Dept: {subject.department}
          </span>
          {hasNotes && (
            <span className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Notes Available</span>
            </span>
          )}
        </div>

        {/* Subject Title */}
        <h3 className="text-2xl font-extrabold text-slate-900 mb-2">
          {subject.name}
        </h3>

        {/* Course Coordinator */}
        {subject.faculty && (
          <p className="text-xs text-slate-500 mb-6 flex items-center space-x-1.5">
            <User className="w-4 h-4 text-blue-600" />
            <span>Course Coordinator / Faculty: <strong className="text-slate-800">{subject.faculty}</strong></span>
          </p>
        )}

        {/* Teaching Scheme Matrix */}
        <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center mb-6">
          <div>
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Theory Hours</span>
            <span className="text-lg font-extrabold text-slate-900">{subject.theoryHours || 0} Hrs / Wk</span>
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Practical Hours</span>
            <span className="text-lg font-extrabold text-slate-900">{subject.practicalHours || 0} Hrs / Wk</span>
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Total Credits</span>
            <span className="text-lg font-extrabold text-blue-700">{subject.credits || 4} Credits</span>
          </div>
        </div>

        {/* Course Notes & Study Materials Section (Highlighted Feature) */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2.5">
            <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Subject Notes & Study Materials</span>
            </h4>
            {hasNotes && (
              <span className="text-[11px] text-emerald-700 font-extrabold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Ready to Download
              </span>
            )}
          </div>

          {hasNotes ? (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50/90 via-teal-50/50 to-blue-50/70 border border-emerald-200 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-900">
                      {subject.notesTitle || `${subject.name} — Comprehensive Notes & Materials`}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                    <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                      {subject.notesFileName || 'Subject_Notes.pdf'}
                    </span>
                    {subject.notesFileSize && (
                      <span className="font-semibold text-slate-600">
                        • {subject.notesFileSize}
                      </span>
                    )}
                    {subject.notesUploadedAt && (
                      <span className="text-slate-400">
                        • Uploaded: {new Date(subject.notesUploadedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <a
                    href={notesUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-white hover:bg-slate-100 text-slate-700 font-bold px-3 py-2 rounded-xl text-xs flex items-center space-x-1 border border-slate-200 transition"
                    title="Preview in new tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </a>
                  <a
                    href={notesUrl}
                    target="_blank"
                    rel="noreferrer"
                    download
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 transition shadow-sm shadow-emerald-600/30"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Notes</span>
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center space-x-3">
              <Clock className="w-5 h-5 text-slate-400 shrink-0" />
              <div>
                <p className="font-semibold text-slate-700">No notes uploaded yet for this subject.</p>
                <p className="text-[11px] text-slate-500">The course coordinator will upload lecture notes and study material shortly.</p>
              </div>
            </div>
          )}
        </div>

        {/* Syllabus Outline */}
        <div className="space-y-2 mb-6">
          <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>Curriculum Outline & Course Outcomes</span>
          </h4>
          <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 text-xs sm:text-sm text-slate-700 leading-relaxed">
            {subject.syllabusSummary || 'Course encompasses outcome-based engineering fundamentals, laboratory exercises, and continuous evaluation.'}
          </div>
        </div>

        {/* Evaluation scheme */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-6 text-xs text-slate-600 space-y-1.5">
          <div className="font-bold text-slate-800">Examination Scheme (DTE Karnataka / BTE Standard):</div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div>• Theory Board Exam: 100/75 Marks</div>
            <div>• Continuous Internal Evaluation (CIE): 25/50 Marks</div>
            <div>• End Semester Lab Practical: 50 Marks</div>
            <div>• Skill Test & Continuous Lab Record: 25 Marks</div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end space-x-3 pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            Close
          </button>

          {hasNotes && (
            <a
              href={notesUrl}
              target="_blank"
              rel="noreferrer"
              download
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center space-x-2 transition shadow-md shadow-emerald-600/20"
            >
              <Download className="w-4 h-4" />
              <span>Download Notes ({subject.notesFileSize || 'PDF'})</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
