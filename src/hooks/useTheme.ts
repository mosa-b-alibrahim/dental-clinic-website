import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'system';
const storageKey = 'clinic-theme';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {
      /* System preference remains usable without storage. */
    }
    return 'system';
  });

  useEffect(() => {
    const system = window.matchMedia('(prefers-color-scheme: dark)');
    function apply() {
      const resolved =
        theme === 'system' ? (system.matches ? 'dark' : 'light') : theme;
      document.documentElement.dataset.theme = resolved;
      document.documentElement.dataset.themePreference = theme;
      document.documentElement.style.colorScheme = resolved;
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute('content', resolved === 'dark' ? '#0b1424' : '#103e72');
    }
    apply();
    system.addEventListener('change', apply);
    try {
      localStorage.setItem(storageKey, theme);
    } catch {
      /* Theme still works for this visit. */
    }
    return () => system.removeEventListener('change', apply);
  }, [theme]);

  return { theme, setTheme };
}
