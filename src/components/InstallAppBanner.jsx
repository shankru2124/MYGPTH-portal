import React, { useState, useEffect } from 'react';
import { Download, Smartphone, X, CheckCircle2, Share2, MoreVertical } from 'lucide-react';
import { checkIsApp } from '../utils/appDetector';

export default function InstallAppBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [isInstalled, setIsInstalled] = useState(() => checkIsApp());

  useEffect(() => {
    // Check if already in standalone (installed app) mode
    if (checkIsApp()) {
      setIsInstalled(true);
      setShowBanner(false);
      return;
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show install banner if user hasn't dismissed it in this session
      const dismissed = sessionStorage.getItem('pwa_banner_dismissed');
      if (!dismissed && !checkIsApp()) {
        setShowBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    const triggerHandler = () => handleInstallClick();
    window.addEventListener('trigger-pwa-install', triggerHandler);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowBanner(false);
      setDeferredPrompt(null);
      try { localStorage.setItem('mygpth_is_app', 'true'); } catch {}
    });

    // Also auto-show banner on mobile browser after 2 seconds if not installed
    const timer = setTimeout(() => {
      const dismissed = sessionStorage.getItem('pwa_banner_dismissed');
      if (!dismissed && !checkIsApp()) {
        setShowBanner(true);
      }
    }, 2000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('trigger-pwa-install', triggerHandler);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowBanner(false);
        setDeferredPrompt(null);
      }
    } else {
      // If browser hasn't provided prompt yet, show interactive guide
      setShowHelpModal(true);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    sessionStorage.setItem('pwa_banner_dismissed', 'true');
  };

  if (isInstalled) return null;

  return (
    <>
      {/* Floating Mobile/Desktop Banner */}
      {showBanner && (
        <div className="fixed bottom-16 md:bottom-5 left-4 right-4 md:left-auto md:right-5 z-40 max-w-md bg-slate-900/95 backdrop-blur-md text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl border border-blue-500/30 animate-bounce-once">
          <div className="flex items-center justify-between gap-3">
            {/* App Icon */}
            <div className="w-12 h-12 rounded-xl bg-white/10 p-1.5 flex items-center justify-center shrink-0 border border-white/15">
              <img src="/logo.png" alt="MYGPTH Logo" className="w-full h-full object-contain" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h5 className="font-extrabold text-sm text-white flex items-center space-x-1.5">
                <span>Install MYGPTH App</span>
                <span className="text-[10px] bg-blue-600 px-1.5 py-0.2 rounded font-mono font-bold">Android</span>
              </h5>
              <p className="text-[11px] text-slate-300 line-clamp-1">
                Fast CIE marks, C-25 syllabus, and timetables on your phone
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center space-x-1.5 shrink-0">
              <button
                onClick={handleInstallClick}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-md transition flex items-center space-x-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install</span>
              </button>
              <button
                onClick={handleDismiss}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
                aria-label="Dismiss banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Installation Guide Modal (For browsers that don't auto-prompt) */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Smartphone className="w-5 h-5 text-blue-700" />
                <h4 className="font-bold text-slate-900 text-base">Install on Your Phone</h4>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <p className="font-semibold text-slate-800">
                To install the official MYGPTH college app on your device:
              </p>

              {/* Android Chrome Instructions */}
              <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-2xl space-y-2">
                <span className="font-bold text-blue-900 text-xs flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  <span>On Android (Google Chrome):</span>
                </span>
                <ol className="list-decimal list-inside space-y-1.5 pl-1 text-[11px] text-slate-700">
                  <li>Tap the <strong>three dots (⋮)</strong> at the top-right corner of Chrome.</li>
                  <li>Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</li>
                  <li>Confirm by tapping <strong>"Install"</strong>.</li>
                </ol>
              </div>

              {/* iOS Safari Instructions */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <span className="font-bold text-slate-900 text-xs flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-600"></span>
                  <span>On iPhone / iPad (Safari):</span>
                </span>
                <ol className="list-decimal list-inside space-y-1.5 pl-1 text-[11px] text-slate-700">
                  <li>Tap the <strong>Share</strong> button (box with upward arrow).</li>
                  <li>Scroll down and tap <strong>"Add to Home Screen"</strong>.</li>
                  <li>Tap <strong>"Add"</strong> at the top right.</li>
                </ol>
              </div>
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer"
            >
              Got It, Thanks!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
