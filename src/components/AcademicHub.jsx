import React, { useState } from 'react';
import { 
  BookOpen, 
  Calendar as CalendarIcon, 
  Clock, 
  Award, 
  FileText, 
  Download, 
  Search, 
  CheckCircle, 
  GraduationCap, 
  Layers,
  Filter,
  ExternalLink,
  Sparkles
} from 'lucide-react';

export default function AcademicHub({ 
  departments, 
  subjects, 
  academicCalendar, 
  onSelectSubject,
  onOpenAdmin
}) {
  // ONLY 4 BRANCHES: CSE, CE, ME, ECE
  const fourBranches = [
    { id: 'CSE', name: 'Computer Science and Engineering (CSE)' },
    { id: 'CE', name: 'Civil Engineering (CE)' },
    { id: 'ME', name: 'Mechanical Engineering (ME)' },
    { id: 'ECE', name: 'Electronics and Communication (ECE)' }
  ];

  const [selectedBranch, setSelectedBranch] = useState('CSE');
  const [selectedSemester, setSelectedSemester] = useState('5');
  const [selectedScheme, setSelectedScheme] = useState('C-25'); // STRICT: 'C-25' | 'C-20'
  const [subView, setSubView] = useState('subjects'); // 'subjects' | 'calendar'
  const [searchQuery, setSearchQuery] = useState('');
  const [filterNotesOnly, setFilterNotesOnly] = useState(false);

  const semesters = [1, 2, 3, 4, 5, 6];

  // STRICT SEPARATION: When C-25 is selected, ONLY match C-25 subjects!
  // When C-20 is selected, ONLY match C-20 subjects!
  const filteredSubjects = (subjects || []).filter((s) => {
    // Branch filter: course must belong to selected branch or common First Year (ALL)
    const matchesBranch = 
      selectedBranch === 'ALL' || 
      s.department === 'ALL' || 
      s.department === selectedBranch;

    // Semester filter
    const matchesSemester = Number(s.semester) === Number(selectedSemester);

    // STRICT SCHEME MATCH: Check exact prefix or scheme string
    const sScheme = (s.scheme || '').trim();
    let matchesScheme = false;

    if (selectedScheme === 'C-25') {
      matchesScheme = !sScheme.includes('20') && !s.code.startsWith('20') && (sScheme.includes('25') || s.code.startsWith('25'));
    } else if (selectedScheme === 'C-20') {
      matchesScheme = !sScheme.includes('25') && !s.code.startsWith('25') && (sScheme.includes('20') || s.code.startsWith('20'));
    } else {
      matchesScheme = true;
    }

    // Notes filter
    const hasNotes = Boolean((s.notesUrl || s.pdfUrl || '').trim());
    const matchesNotesFilter = !filterNotesOnly || hasNotes;

    // Search filter
    const matchesSearch = 
      searchQuery === '' ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.faculty && s.faculty.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.notesTitle && s.notesTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.notesFileName && s.notesFileName.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesBranch && matchesSemester && matchesScheme && matchesNotesFilter && matchesSearch;
  });

  // Calculate stats for current selection
  const totalCredits = filteredSubjects.reduce((acc, curr) => acc + (Number(curr.credits) || 0), 0);
  const totalTheory = filteredSubjects.reduce((acc, curr) => acc + (Number(curr.theoryHours) || 0), 0);
  const totalPractical = filteredSubjects.reduce((acc, curr) => acc + (Number(curr.practicalHours) || 0), 0);
  const subjectsWithNotesCount = filteredSubjects.filter(s => Boolean((s.notesUrl || s.pdfUrl || '').trim())).length;

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Curriculum, Teaching Scheme & Subject Notes • DTE Karnataka</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Diploma Syllabus & Subject Notes (C-25 & C-20)
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Browse semester-wise teaching schemes, syllabus outlines, and download official subject lecture notes and study materials.
          </p>
        </div>

        {/* Tab Toggle: Subjects vs Academic Calendar */}
        <div className="flex bg-slate-100 p-1 rounded-xl self-start md:self-auto border border-slate-200">
          <button
            onClick={() => setSubView('subjects')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-2 ${
              subView === 'subjects'
                ? 'bg-white text-blue-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Syllabus & Notes</span>
          </button>
          <button
            onClick={() => setSubView('calendar')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-2 ${
              subView === 'calendar'
                ? 'bg-white text-blue-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5 text-amber-600" />
            <span>Academic Calendar</span>
          </button>
        </div>
      </div>

      {subView === 'subjects' ? (
        <div className="mt-8 space-y-6">
          {/* Controls: Scheme Selector, Branch Selector & Search */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            
            {/* SCHEME SELECTOR (STRICTLY SEPARATED) */}
            <div className="md:col-span-4">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span>Select Curriculum Scheme:</span>
              </label>
              <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedScheme('C-25')}
                  className={`py-2 px-3 text-xs font-black rounded-xl transition flex flex-col items-center justify-center ${
                    selectedScheme === 'C-25'
                      ? 'bg-blue-800 text-white shadow-md shadow-blue-800/30'
                      : 'text-slate-700 hover:bg-white hover:text-blue-900'
                  }`}
                >
                  <span className="text-sm">C-25 Scheme</span>
                  <span className={`text-[9px] uppercase tracking-wider ${selectedScheme === 'C-25' ? 'text-amber-300' : 'text-slate-400'}`}>
                    Latest 2025-26
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedScheme('C-20')}
                  className={`py-2 px-3 text-xs font-black rounded-xl transition flex flex-col items-center justify-center ${
                    selectedScheme === 'C-20'
                      ? 'bg-blue-800 text-white shadow-md shadow-blue-800/30'
                      : 'text-slate-700 hover:bg-white hover:text-blue-900'
                  }`}
                >
                  <span className="text-sm">C-20 Scheme</span>
                  <span className={`text-[9px] uppercase tracking-wider ${selectedScheme === 'C-20' ? 'text-blue-200' : 'text-slate-400'}`}>
                    Previous Scheme
                  </span>
                </button>
              </div>
            </div>

            {/* Branch Selector (ONLY 4 BRANCHES: CSE, CE, ME, ECE) */}
            <div className="md:col-span-4">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Department (4 Branches Only)
              </label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 font-bold focus:ring-2 focus:ring-blue-600 focus:outline-none"
              >
                {fourBranches.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Input */}
            <div className="md:col-span-4">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Subject or Notes Search
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder={`Search courses or notes (e.g. 25CS51T, Python)...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Semester Selector Pill Bar & Notes Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 sm:pb-0">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
                Semester:
              </span>
              {semesters.map((sem) => {
                const isSelected = Number(selectedSemester) === sem;
                return (
                  <button
                    key={sem}
                    onClick={() => setSelectedSemester(sem.toString())}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition transform ${
                      isSelected
                        ? 'bg-blue-800 text-white shadow-md shadow-blue-800/20 scale-105'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Sem {sem}
                  </button>
                );
              })}
            </div>

            {/* Quick Toggle: Only With Downloadable Notes */}
            <div className="flex items-center space-x-2 shrink-0">
              <button
                type="button"
                onClick={() => setFilterNotesOnly(!filterNotesOnly)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 border ${
                  filterNotesOnly
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-400'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Downloadable Notes Only</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${filterNotesOnly ? 'bg-white text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                  {subjectsWithNotesCount}
                </span>
              </button>
            </div>
          </div>

          {/* Scheme Banner Strip */}
          <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4 shadow-sm border border-slate-800">
            <div>
              <div className="flex items-center space-x-2">
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                  selectedScheme === 'C-25' ? 'bg-amber-400 text-slate-950' : 'bg-blue-400 text-slate-950'
                }`}>
                  {selectedScheme === 'C-25' ? 'C-25 SCHEME (ACTIVE VIEW)' : 'C-20 SCHEME (ACTIVE VIEW)'}
                </span>
                <span className="text-xs text-slate-300 font-medium">Department of Technical Education, Karnataka</span>
              </div>
              <h3 className="text-xl font-bold mt-1.5 text-white">
                {fourBranches.find(d => d.id === selectedBranch)?.name} — Semester {selectedSemester}
              </h3>
            </div>

            <div className="flex items-center space-x-3 text-xs flex-wrap">
              <div className="bg-white/10 px-3.5 py-2 rounded-xl border border-white/15">
                <span className="text-slate-300 block text-[10px]">TOTAL COURSES</span>
                <span className="font-extrabold text-sm">{filteredSubjects.length} Courses</span>
              </div>
              <div className="bg-white/10 px-3.5 py-2 rounded-xl border border-white/15">
                <span className="text-slate-300 block text-[10px]">NOTES AVAILABLE</span>
                <span className="font-extrabold text-sm text-emerald-400">{subjectsWithNotesCount} Ready</span>
              </div>
              <div className="bg-white/10 px-3.5 py-2 rounded-xl border border-white/15">
                <span className="text-slate-300 block text-[10px]">TOTAL CREDITS</span>
                <span className="font-extrabold text-sm text-amber-300">{totalCredits} Credits</span>
              </div>
            </div>
          </div>

          {/* Subjects Grid */}
          {filteredSubjects.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-6">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="font-bold text-slate-800 text-base">
                No courses found under {selectedScheme} for Semester {selectedSemester} ({selectedBranch})
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                {filterNotesOnly
                  ? 'No subjects currently have uploaded notes for this filter. Switch off "Downloadable Notes Only" to view all curriculum subjects.'
                  : selectedScheme === 'C-20' 
                    ? 'The C-20 scheme curriculum for this semester is archived or not available. Please switch to the C-25 Scheme above to view the latest active curriculum.'
                    : 'Syllabus content for this selection will be updated shortly by the academic coordinator.'}
              </p>
              <div className="mt-4 flex items-center justify-center space-x-3">
                {filterNotesOnly && (
                  <button
                    onClick={() => setFilterNotesOnly(false)}
                    className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
                  >
                    Show All Courses
                  </button>
                )}
                <button
                  onClick={() => setSelectedScheme(selectedScheme === 'C-25' ? 'C-20' : 'C-25')}
                  className="bg-blue-800 text-white text-xs font-bold px-4 py-2 rounded-xl"
                >
                  Switch to {selectedScheme === 'C-25' ? 'C-20 Scheme' : 'C-25 Scheme'}
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredSubjects.map((sub) => {
                const notesUrl = sub.notesUrl || sub.pdfUrl;
                const hasNotes = Boolean(notesUrl && notesUrl.trim());

                return (
                  <div
                    key={sub.id}
                    className="bg-white rounded-3xl border border-slate-200 hover:border-blue-500 p-6 shadow-xs hover:shadow-xl transition flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Row: Code Badge & Scheme Badge */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-xs font-black bg-blue-100 text-blue-900 px-3 py-1 rounded-lg border border-blue-200">
                          Code: {sub.code}
                        </span>
                        <div className="flex items-center space-x-1.5">
                          {hasNotes && (
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center space-x-1">
                              <CheckCircle className="w-3 h-3 text-emerald-600" />
                              <span>Notes</span>
                            </span>
                          )}
                          <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                            sub.code.startsWith('25') || sub.scheme === 'C-25'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-slate-100 text-slate-800 border border-slate-300'
                          }`}>
                            {sub.code.startsWith('25') || sub.scheme === 'C-25' ? 'C-25' : 'C-20'}
                          </span>
                        </div>
                      </div>

                      {/* Subject Name */}
                      <h4 className="font-bold text-slate-900 text-base leading-snug mb-2">
                        {sub.name}
                      </h4>

                      {/* Faculty In Charge if assigned */}
                      {sub.faculty && (
                        <div className="text-xs text-slate-600 mb-3 flex items-center space-x-1.5">
                          <GraduationCap className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                          <span className="truncate">Staff: {sub.faculty}</span>
                        </div>
                      )}

                      {/* Syllabus Overview */}
                      <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        {sub.syllabusSummary || 'Course covers outcome-based engineering fundamentals, laboratory exercises, and continuous evaluation.'}
                      </p>

                      {/* Notes Status Banner */}
                      {hasNotes ? (
                        <div className="mb-4 p-2.5 rounded-2xl bg-emerald-50/90 border border-emerald-200 flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-2 truncate">
                            <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span className="font-bold text-emerald-950 truncate text-[11px]">
                              {sub.notesTitle || sub.notesFileName || 'Study Notes & Materials'}
                            </span>
                          </div>
                          {sub.notesFileSize && (
                            <span className="text-[10px] font-mono text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200 shrink-0 ml-1.5">
                              {sub.notesFileSize}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="mb-4 p-2 rounded-2xl bg-slate-50 border border-slate-100 flex items-center space-x-2 text-[11px] text-slate-400">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>Notes upload in progress</span>
                        </div>
                      )}
                    </div>

                    <div>
                      {/* Credits and Hours breakdown */}
                      <div className="grid grid-cols-3 gap-2 py-2.5 border-t border-b border-slate-100 text-center text-xs mb-4">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-bold">THEORY</span>
                          <span className="font-bold text-slate-800">{sub.theoryHours || 0}h / wk</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-bold">PRACTICAL</span>
                          <span className="font-bold text-slate-800">{sub.practicalHours || 0}h / wk</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-bold">CREDITS</span>
                          <span className="font-extrabold text-blue-800">{sub.credits || 4}</span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      {hasNotes ? (
                        <div className="flex items-center space-x-2">
                          <a
                            href={notesUrl}
                            target="_blank"
                            rel="noreferrer"
                            download
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition shadow-sm shadow-emerald-600/20 text-center"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download Notes</span>
                          </a>
                          <button
                            onClick={() => onSelectSubject(sub)}
                            className="px-3 py-2.5 bg-blue-50 hover:bg-blue-800 hover:text-white text-blue-900 rounded-xl text-xs font-bold transition text-center"
                            title="View Syllabus Outline"
                          >
                            Syllabus
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => onSelectSubject(sub)}
                          className="w-full bg-blue-50 hover:bg-blue-800 hover:text-white text-blue-900 text-xs font-bold py-2.5 rounded-xl transition text-center flex items-center justify-center space-x-1.5"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>View Syllabus Outline</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Academic Calendar View */
        <div className="mt-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Official Academic Calendar 2026 – 2027</h3>
              <p className="text-xs text-slate-500">Key dates for term start, CIE unit tests, vacations, and DTE board examinations.</p>
            </div>
            <span className="text-xs bg-amber-100 text-amber-900 font-bold px-3 py-1 rounded-full">
              DTE Karnataka Schedule
            </span>
          </div>

          <div className="space-y-3">
            {academicCalendar.map((ev, idx) => {
              const isExam = ev.type === 'Exam';
              const isHoliday = ev.type === 'Holiday';

              return (
                <div
                  key={ev.id || idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50/80 transition gap-3"
                >
                  <div className="flex items-start sm:items-center space-x-3.5">
                    <div className={`p-2.5 rounded-xl shrink-0 ${
                      isExam ? 'bg-red-50 text-red-600' : isHoliday ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      <CalendarIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{ev.title}</h4>
                      <p className="text-xs text-slate-500">{ev.description || 'DTE scheduled academic activity'}</p>
                    </div>
                  </div>
                  <div className="text-right sm:text-right text-xs">
                    <span className="font-mono font-bold text-slate-800 block">{ev.date}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      isExam ? 'bg-red-100 text-red-800' : isHoliday ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {ev.type || 'Event'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
