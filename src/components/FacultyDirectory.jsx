import React, { useState } from 'react';
import { Users, Mail, Phone, Award, Search, BookOpen } from 'lucide-react';

export default function FacultyDirectory({ faculty, departments }) {
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = faculty.filter((f) => {
    const matchesDept = selectedDept === 'ALL' || f.department === selectedDept;
    const matchesSearch = 
      searchQuery === '' ||
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.specialization?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Academic Staff & Leadership</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Faculty & Staff Directory
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Connect with Professors, Lecturers, and Laboratory In-charges across all diploma departments.
          </p>
        </div>

        <div className="text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg self-start md:self-auto">
          Total Faculty: <span className="font-bold text-slate-900">{faculty.length} Members</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-4">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none shadow-xs"
          >
            <option value="ALL">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-8 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search faculty by name, qualification, or specialization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none shadow-xs"
          />
        </div>
      </div>

      {/* Faculty Cards */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-2xl border border-slate-200 hover:border-blue-300 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center space-x-3.5 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-700 to-indigo-600 text-white font-bold flex items-center justify-center text-lg shrink-0 shadow-xs">
                  {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base leading-tight">
                    {member.name}
                  </h3>
                  <p className="text-xs text-blue-700 font-semibold mt-0.5">
                    {member.designation}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 font-medium">Qualification:</span>{' '}
                  <span className="font-semibold text-slate-800">{member.qualification}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Experience:</span>{' '}
                  <span className="font-semibold text-slate-800">{member.experience}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Specialization:</span>{' '}
                  <span className="font-semibold text-slate-800">{member.specialization}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs">
              <a
                href={`mailto:${member.email}`}
                className="flex items-center space-x-2 text-slate-600 hover:text-blue-700 transition"
              >
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{member.email}</span>
              </a>
              {member.phone && (
                <div className="flex items-center space-x-2 text-slate-500">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{member.phone}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
