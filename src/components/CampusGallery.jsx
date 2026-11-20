import React, { useState } from 'react';
import { Image as ImageIcon, X, ZoomIn, Building2, Upload } from 'lucide-react';

export default function CampusGallery({ gallery = [] }) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [activePhoto, setActivePhoto] = useState(null);

  const categories = ['ALL', 'Laboratories', 'Workshops', 'Campus', 'Events'];

  const filtered = (gallery || []).filter((item) => {
    return selectedCategory === 'ALL' || item.category === selectedCategory;
  });

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full mb-3">
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Campus Infrastructure & Facilities</span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Campus Life & Laboratory Gallery
        </h2>
        <p className="text-slate-500 text-sm mt-2">
          Genuine campus photographs, workshop machinery, computer laboratories, and academic events at Government Polytechnic, Harihara.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex items-center justify-center space-x-2 overflow-x-auto pb-4 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              selectedCategory === cat
                ? 'bg-teal-700 text-white shadow-md shadow-teal-700/20'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat === 'ALL' ? 'All Facilities' : cat}
          </button>
        ))}
      </div>

      {/* Empty State when no photos uploaded yet */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-xl mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto mb-4 border border-teal-100">
            <Building2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Official Campus Gallery
          </h3>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Unrelated stock photos have been removed to preserve institutional authenticity. Genuine campus and laboratory photographs will appear here as uploaded by the college administration via the Admin CMS.
          </p>
          <div className="mt-5 text-[11px] text-teal-800 bg-teal-50/70 border border-teal-200/60 rounded-xl py-2 px-4 inline-flex items-center space-x-1.5">
            <Upload className="w-3.5 h-3.5 text-teal-600" />
            <span>Authorized staff can upload campus photos in the Admin Dashboard</span>
          </div>
        </div>
      ) : (
        /* Photo Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => {
            const photoSrc = item.imageUrl || item.image;
            return (
              <div
                key={item.id}
                onClick={() => setActivePhoto(item)}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition cursor-pointer flex flex-col"
              >
                <div className="relative h-52 overflow-hidden bg-slate-100">
                  <img
                    src={photoSrc}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="bg-white/90 text-slate-900 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 backdrop-blur-xs">
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span>Enlarge</span>
                    </span>
                  </div>
                  <span className="absolute top-3 left-3 text-[10px] font-bold bg-black/60 text-white px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                    {item.category}
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <h4 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-teal-700 transition">
                    {item.title}
                  </h4>
                  {item.caption && (
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {item.caption}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 right-4 z-10 p-2.5 bg-black/50 text-white rounded-full hover:bg-black/70 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[70vh] bg-black flex items-center justify-center">
              <img
                src={activePhoto.imageUrl || activePhoto.image}
                alt={activePhoto.title}
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>

            <div className="p-6 bg-white">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full">
                  {activePhoto.category}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {activePhoto.title}
              </h3>
              {activePhoto.caption && (
                <p className="text-xs text-slate-600 mt-1">
                  {activePhoto.caption}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
