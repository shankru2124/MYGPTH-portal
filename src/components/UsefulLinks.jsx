import React, { useState, useEffect } from 'react';
import { ExternalLink, Globe, ShieldCheck, Bookmark, Search } from 'lucide-react';
import { api } from '../services/api';

export default function UsefulLinks({ links: initialLinks = [] }) {
  const [links, setLinks] = useState(initialLinks);
  const [loading, setLoading] = useState(!initialLinks.length);

  useEffect(() => {
    if (initialLinks && initialLinks.length > 0) {
      setLinks(initialLinks);
      setLoading(false);
      return;
    }

    api.getExternalLinks()
      .then(data => setLinks(Array.isArray(data) ? data : []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [initialLinks]);

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full mb-3">
          <Globe className="w-3.5 h-3.5" />
          <span>Official Portals & Resources</span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Useful Government & Academic Links
        </h2>
        <p className="text-slate-500 text-sm mt-2">
          Direct links to verified Government of Karnataka portals for exam fees, scholarships, and e-learning resources.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="group bg-white rounded-2xl border border-slate-200 hover:border-blue-500 p-5 shadow-xs hover:shadow-lg transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold bg-blue-50 text-blue-800 px-2.5 py-0.5 rounded-full border border-blue-200/60">
                  {link.category}
                </span>

                {link.official && (
                  <span className="flex items-center space-x-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Official Portal</span>
                  </span>
                )}
              </div>

              <h3 className="font-bold text-slate-900 text-base mb-2 group-hover:text-blue-800 transition">
                {link.title}
              </h3>

              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                {link.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-blue-700 font-bold">
              <span className="truncate max-w-[200px] text-[11px] text-slate-400 font-mono font-normal">
                {link.url.replace('https://', '').replace(/\/$/, '')}
              </span>
              <span className="flex items-center space-x-1 group-hover:translate-x-1 transition">
                <span>Visit Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
