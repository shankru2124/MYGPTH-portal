import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Search, 
  Filter, 
  Calendar, 
  Building2, 
  BookOpen, 
  AlertCircle,
  Clock,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api';

export default function InternalMarks() {
  const [marksList, setMarksList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedSem, setSelectedSem] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const departments = [
    { id: 'ALL', name: 'All Departments' },
    { id: 'CSE', name: 'Computer Science (CSE)' },
    { id: 'CE', name: 'Civil Engineering (CE)' },
    { id: 'ME', name: 'Mechanical Engineering (ME)' },
    { id: 'ECE', name: 'Electronics & Comm (ECE)' }
  ];

  const semesters = ['ALL', '1', '2', '3', '4', '5', '6'];

  const fetchMarks = async () => {
    try {
      setLoading(true);
      const data = await api.getInternalMarks(selectedDept, selectedSem);
      setMarksList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load internal marks', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarks();
  }, [selectedDept, selectedSem]);

  const filteredMarks = marksList.filter((m) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.examName?.toLowerCase().includes(q) ||
      m.subjectName?.toLowerCase().includes(q) ||
      m.description?.toLowerCase().includes(q) ||
      m.fileName?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full mb-2">
            <FileText className="w-3.5 h-3.5" />
            <span>Continuous Internal Evaluation (CIE)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Semester-Wise Internal Marks
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Download official department internal assessment (CIE-1, CIE-2, and Lab Test) marks PDF statements.
          </p>
        </div>

        <div className="text-xs bg-slate-100 text-slate-700 font-medium px-3.5 py-1.5 rounded-xl self-start md:self-auto border border-slate-200">
          Showing: <span className="font-bold text-blue-900">{filteredMarks.length} Documents</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="mt-8 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        {/* Department Pills (ONLY 4 BRANCHES: CSE, CE, ME, ECE) */}
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Filter by Department (4 Branches)
          </label>
          <div className="flex items-center space-x-2 overflow-x-auto pb-1">
            {departments.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDept(d.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  selectedDept === d.id
                    ? 'bg-blue-800 text-white shadow-md shadow-blue-800/20'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {d.name}
              </button>
            ))}
          </div>
        </div>

        {/* Semester & Search */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2 border-t border-slate-100">
          {/* Semester Selector */}
          <div className="md:col-span-4">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Select Semester
            </label>
            <select
              value={selectedSem}
              onChange={(e) => setSelectedSem(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none"
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

          {/* Search Box */}
          <div className="md:col-span-8">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Search by Exam or Subject Name
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
              <input
                type="text"
                placeholder="Search (e.g. CIE 1, Python, Surveying, Mechanical, Sem 5)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Marks List */}
      <div className="mt-6">
        {loading ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-slate-500">Loading semester internal marks statements...</p>
          </div>
        ) : filteredMarks.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-6">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="font-bold text-slate-800 text-base">No Internal Marks Documents Found</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              No internal marks PDFs have been published yet for this department and semester. Authorized faculty can upload marks statements from the Admin CMS.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMarks.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-blue-400 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  {/* Department & Semester Badges */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-black bg-blue-100 text-blue-900 px-2.5 py-0.5 rounded-md border border-blue-200">
                        {item.department}
                      </span>
                      <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md">
                        Semester {item.semester}
                      </span>
                    </div>

                    <span className="text-[11px] font-mono text-slate-400">
                      {item.fileSize || 'PDF'}
                    </span>
                  </div>

                  {/* Exam Name */}
                  <h3 className="font-bold text-slate-900 text-base mb-1">
                    {item.examName}
                  </h3>

                  {/* Subject Name */}
                  <div className="text-xs text-blue-800 font-semibold mb-2 flex items-center space-x-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>{item.subjectName}</span>
                  </div>

                  {/* Description if provided */}
                  {item.description && (
                    <p className="text-xs text-slate-500 mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mt-2">
                  <div className="flex items-center space-x-1.5 text-[11px]">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Uploaded: {item.createdAt || item.examDate}</span>
                  </div>

                  <a
                    href={item.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-blue-800 hover:bg-blue-900 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 transition shadow-xs"
                    download={item.fileName || 'Internal_Marks.pdf'}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
