import React from 'react';
import { X, Calendar, User, Download, ExternalLink, AlertCircle } from 'lucide-react';

export default function NoticeModal({ notice, onClose }) {
  if (!notice) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 mb-3">
          {notice.urgent && (
            <span className="inline-flex items-center space-x-1 text-[11px] font-extrabold bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full border border-red-200">
              <AlertCircle className="w-3 h-3" />
              <span>URGENT</span>
            </span>
          )}
          <span className="text-[11px] font-bold bg-blue-50 text-blue-800 px-2.5 py-0.5 rounded-full border border-blue-200/60">
            {notice.category}
          </span>
          <span className="text-xs text-slate-400 flex items-center space-x-1">
            <Calendar className="w-3 h-3 text-slate-400" />
            <span>{notice.date}</span>
          </span>
        </div>

        <h3 className="text-xl font-bold text-slate-900 leading-snug mb-4">
          {notice.title}
        </h3>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2 mb-6">
          <p>{notice.description}</p>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <div className="flex items-center space-x-1">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>Issued by: <strong className="text-slate-800">{notice.author || 'Principal Office'}</strong></span>
          </div>

          {notice.fileUrl && (
            <a
              href={notice.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3.5 py-1.5 rounded-xl flex items-center space-x-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Official Circular (PDF)</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
