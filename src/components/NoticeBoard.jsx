import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  AlertCircle, 
  Calendar, 
  User, 
  Download, 
  ExternalLink, 
  ChevronRight,
  Filter,
  Sparkles
} from 'lucide-react';

export default function NoticeBoard({ notices, onSelectNotice }) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['ALL', 'Examination', 'Academic', 'Scholarship', 'Event'];

  const filteredNotices = notices.filter((n) => {
    const matchesCat = selectedCategory === 'ALL' || n.category === selectedCategory;
    const matchesSearch = 
      searchQuery === '' ||
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-red-700 bg-red-50 px-2.5 py-1 rounded-md mb-2">
            <Bell className="w-3.5 h-3.5" />
            <span>Digital Circulars & Notices</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Official College Notice Board
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Real-time board notifications, exam timetables, fee circulars, and campus recruitment drives.
          </p>
        </div>

        <div className="text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg self-start md:self-auto">
          Total Notifications: <span className="font-bold text-slate-900">{notices.length}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="mt-8 space-y-4">
        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  isSelected
                    ? 'bg-blue-800 text-white shadow-md shadow-blue-800/20'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat === 'ALL' ? 'All Notices' : cat}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search circulars by keywords (e.g. Hall ticket, Scholarship, Winter 2026, TCS)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none shadow-xs"
          />
        </div>
      </div>

      {/* Notice List */}
      <div className="mt-6 space-y-4">
        {filteredNotices.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="font-bold text-slate-700">No notices match your filter</h4>
            <p className="text-xs text-slate-500 mt-1">Try resetting the category filter or search query.</p>
          </div>
        ) : (
          filteredNotices.map((notice) => (
            <div
              key={notice.id}
              onClick={() => onSelectNotice(notice)}
              className={`group bg-white rounded-2xl border p-5 shadow-xs hover:shadow-md transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                notice.urgent
                  ? 'border-amber-300 bg-amber-50/20 hover:border-amber-400'
                  : 'border-slate-200 hover:border-blue-300'
              }`}
            >
              <div className="space-y-2 flex-1">
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2">
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
                    <span>{new Date(notice.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-700 transition">
                  {notice.title}
                </h3>

                {/* Brief description */}
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {notice.description}
                </p>

                {/* Author */}
                {notice.author && (
                  <div className="text-[11px] text-slate-400 flex items-center space-x-1.5 pt-1">
                    <User className="w-3 h-3 text-slate-400" />
                    <span>Issued by: {notice.author}</span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="shrink-0 flex items-center space-x-2 self-end sm:self-center">
                <button
                  className="bg-slate-100 group-hover:bg-blue-600 group-hover:text-white text-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-xs"
                >
                  <span>Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
