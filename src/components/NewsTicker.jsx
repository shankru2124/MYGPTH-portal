import React, { useState, useEffect } from 'react';
import { BellRing, ChevronRight, AlertCircle, X, ExternalLink, Calendar } from 'lucide-react';

export default function NewsTicker({ notices, onSelectNotice }) {
  const urgentNotices = notices.filter(n => n.urgent);
  const displayNotices = urgentNotices.length > 0 ? urgentNotices : notices.slice(0, 3);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (displayNotices.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayNotices.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [displayNotices.length]);

  if (!displayNotices.length) return null;
  const current = displayNotices[currentIndex];

  return (
    <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between text-xs sm:text-sm">
        <div className="flex items-center space-x-2.5 overflow-hidden flex-1 mr-2">
          <div className="flex items-center space-x-1.5 bg-black/25 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide shrink-0">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
            <BellRing className="w-3.5 h-3.5 text-white" />
            <span>Latest Circular</span>
          </div>

          <div 
            onClick={() => onSelectNotice(current)}
            className="cursor-pointer truncate hover:underline flex items-center space-x-2 font-medium"
            title="Click to read full notification"
          >
            <span className="truncate">{current.title}</span>
            <span className="hidden sm:inline-block bg-white/20 text-[10px] px-1.5 py-0.5 rounded">
              {current.category}
            </span>
          </div>
        </div>

        <button
          onClick={() => onSelectNotice(current)}
          className="shrink-0 flex items-center space-x-1 text-xs font-semibold bg-white text-amber-900 px-2.5 py-1 rounded-md shadow-xs hover:bg-amber-50 transition"
        >
          <span>Read</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
