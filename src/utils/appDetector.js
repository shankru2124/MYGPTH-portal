/**
 * Helper to detect if user is running inside the installed standalone Android/iOS PWA app
 */
export function checkIsApp() {
  if (typeof window === 'undefined') return false;

  // 1. Check URL query param from manifest start_url
  if (window.location.search.includes('source=pwa') || window.location.search.includes('source=app')) {
    try { localStorage.setItem('mygpth_is_app', 'true'); } catch {}
    return true;
  }

  // 2. Check persisted storage
  try {
    if (localStorage.getItem('mygpth_is_app') === 'true') {
      return true;
    }
  } catch {}

  // 3. Check browser display-mode standalone (PWA window)
  if (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    window.matchMedia('(display-mode: minimal-ui)').matches
  ) {
    try { localStorage.setItem('mygpth_is_app', 'true'); } catch {}
    return true;
  }

  // 4. Check iOS Safari standalone
  if (window.navigator && window.navigator.standalone === true) {
    try { localStorage.setItem('mygpth_is_app', 'true'); } catch {}
    return true;
  }

  // 5. Check Android intent referrer
  if (document.referrer && document.referrer.includes('android-app://')) {
    try { localStorage.setItem('mygpth_is_app', 'true'); } catch {}
    return true;
  }

  return false;
}
