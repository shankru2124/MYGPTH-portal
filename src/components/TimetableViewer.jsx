import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User, Printer, Download, Sparkles, BookOpen } from 'lucide-react';

export default function TimetableViewer({ timetables = {} }) {
  const [selectedBranch, setSelectedBranch] = useState('CSE');
  const [selectedSem, setSelectedSem] = useState('5');
  const [selectedDay, setSelectedDay] = useState('Monday');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // 4 BRANCHES ONLY
  const fourBranches = [
    { id: 'CSE', name: 'Computer Science & Engineering (CSE)' },
    { id: 'CE', name: 'Civil Engineering (CE)' },
    { id: 'ME', name: 'Mechanical Engineering (ME)' },
    { id: 'ECE', name: 'Electronics & Communication (ECE)' }
  ];

  const currentKey = `${selectedBranch}-Sem-${selectedSem}`;
  const schedule = timetables[currentKey] || timetables['CSE-Sem-5'] || [];

  const daySchedule = schedule.find(d => d.day === selectedDay)?.slots || [];

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Class Timetable & Schedule</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Weekly Class & Lab Schedule
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Real-time timetable slots with classroom assignments, practical laboratories, and faculty in-charge for all four diploma branches.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="self-start md:self-auto flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Timetable</span>
        </button>
      </div>

      {/* Selectors Bar (4 Branches Only) */}
      <div className="mt-8 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
            Department (4 Branches Only)
          </label>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-teal-600 focus:outline-none"
          >
            {fourBranches.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
            Semester
          </label>
          <select
            value={selectedSem}
            onChange={(e) => setSelectedSem(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-teal-600 focus:outline-none"
          >
            <option value="1">Semester 1 (First Year)</option>
            <option value="2">Semester 2 (First Year)</option>
            <option value="3">Semester 3 (Second Year)</option>
            <option value="4">Semester 4 (Second Year)</option>
            <option value="5">Semester 5 (Third Year)</option>
            <option value="6">Semester 6 (Third Year)</option>
          </select>
        </div>
      </div>

      {/* Day Selector Pills */}
      <div className="mt-6 flex items-center space-x-2 overflow-x-auto pb-2">
        {days.map((d) => {
          const isSelected = selectedDay === d;
          return (
            <button
              key={d}
              onClick={() => setSelectedDay(d)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                isSelected
                  ? 'bg-teal-700 text-white shadow-md shadow-teal-700/20'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {d}
            </button>
          );
        })}
      </div>

      {/* Schedule Table / Cards */}
      <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base">
              {selectedBranch} — Semester {selectedSem} Schedule ({selectedDay})
            </h3>
            <p className="text-xs text-slate-400">Class In-charge: HOD / Department Coordinator | Room: 101/201</p>
          </div>
          <span className="text-xs bg-teal-500/20 text-teal-300 px-3 py-1 rounded-full border border-teal-500/30">
            6 Periods / Day
          </span>
        </div>

        {daySchedule.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            No lecture slots configured for this selection. (Please consult the department notice board for revised hours!)
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {daySchedule.map((slot, index) => {
              const isBreak = slot.subject.includes('LUNCH') || slot.subject.includes('BREAK');
              return (
                <div
                  key={index}
                  className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition ${
                    isBreak 
                      ? 'bg-amber-50/70 border-l-4 border-amber-500' 
                      : 'hover:bg-slate-50/80'
                  }`}
                >
                  <div className="flex items-start sm:items-center space-x-4">
                    {/* Time Badge */}
                    <div className="flex items-center space-x-1.5 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-mono font-bold shrink-0">
                      <Clock className="w-3.5 h-3.5 text-teal-600" />
                      <span>{slot.time}</span>
                    </div>

                    <div>
                      <h4 className={`text-sm sm:text-base font-bold ${isBreak ? 'text-amber-800' : 'text-slate-900'}`}>
                        {slot.subject}
                      </h4>
                      {!isBreak && slot.teacher && (
                        <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1">
                          <span className="flex items-center space-x-1">
                            <User className="w-3 h-3 text-slate-400" />
                            <span>{slot.teacher}</span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {!isBreak && (
                    <div className="flex items-center space-x-2 text-xs font-medium text-slate-600 bg-slate-100/80 px-3 py-1.5 rounded-lg self-start sm:self-auto">
                      <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>{slot.room}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
