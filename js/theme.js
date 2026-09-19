const ICONS = {
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>',
  moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>'
};

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);

  const icon = document.getElementById('themeIcon');
  icon.innerHTML = theme === 'dark' ? ICONS.sun : ICONS.moon;

  safeSet(THEME_KEY, theme);
}

function initTheme() {
  const stored = safeGet(THEME_KEY);

  if (stored === 'dark' || stored === 'light') {
    applyTheme(stored);
    return;
  }

  const prefersDark =
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  applyTheme(prefersDark ? 'dark' : 'light');
}

function toggleTheme() {
  const current =
    document.documentElement.getAttribute('data-theme') || 'light';

  applyTheme(current === 'dark' ? 'light' : 'dark');
}
