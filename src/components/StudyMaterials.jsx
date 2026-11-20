import React, { useState } from 'react';
import { FileText, Download, Search, BookOpen, Filter, Eye, CheckCircle } from 'lucide-react';

export default function StudyMaterials({ materials }) {
  const [selectedSem, setSelectedSem] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const types = ['ALL', 'Lecture Notes', 'Question Bank', 'Lab Manual', 'Formula Sheet'];

  const filtered = materials.filter((m) => {
    const matchesSem = selectedSem === 'ALL' || Number(m.semester) === Number(selectedSem);
    const matchesType = selectedType === 'ALL' || m.type === selectedType;
    const matchesSearch = 
      searchQuery === '' ||
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSem && matchesType && matchesSearch;
  });

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md mb-2">
            <FileText className="w-3.5 h-3.5" />
            <span>Digital Academic Repository</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Study Material & Previous Question Papers
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Download DTE Karnataka solved model answer papers, C-20 scheme unit-wise lecture notes, and laboratory manuals.
          </p>
        </div>

        <div className="text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg self-start md:self-auto">
          Available Resources: <span className="font-bold text-slate-900">{materials.length} Documents</span>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-8 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3">
          <div className="md:col-span-4">
            <select
              value={selectedSem}
              onChange={(e) => setSelectedSem(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-purple-600 focus:outline-none shadow-xs"
            >
              <option value="ALL">All Semesters (1 to 6)</option>
              <option value="1">Semester 1 (First Year)</option>
              <option value="2">Semester 2 (First Year)</option>
              <option value="3">Semester 3 (Second Year)</option>
              <option value="4">Semester 4 (Second Year)</option>
              <option value="5">Semester 5 (Third Year)</option>
              <option value="6">Semester 6 (Third Year)</option>
            </select>
          </div>

          <div className="md:col-span-4">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-purple-600 focus:outline-none shadow-xs"
            >
              {types.map((t) => (
                <option key={t} value={t}>{t === 'ALL' ? 'All Document Types' : t}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search notes, topics, or subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-600 focus:outline-none shadow-xs"
            />
          </div>
        </div>
      </div>

      {/* Materials List */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className="md:col-span-2 text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="font-bold text-slate-700">No study materials found</h4>
            <p className="text-xs text-slate-500 mt-1">Try selecting another semester or document category.</p>
          </div>
        ) : (
          filtered.map((mat) => (
            <div
              key={mat.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-purple-300 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] font-bold bg-purple-50 text-purple-800 px-2.5 py-0.5 rounded-full border border-purple-200/60">
                    {mat.type}
                  </span>
                  <span className="text-xs font-mono font-medium text-slate-400">
                    Sem {mat.semester} • {mat.fileSize}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base leading-snug mb-1">
                  {mat.title}
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Course: <span className="font-semibold text-slate-700">{mat.subject}</span>
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>{mat.downloads || 0} downloads</span>
                <a
                  href={mat.downloadUrl || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-3.5 py-1.5 rounded-xl flex items-center space-x-1.5 transition shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
