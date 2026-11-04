import { Monitor, Moon, Sun } from 'lucide-react';
import type { Theme } from '../hooks/useTheme';
import type { Copy } from '../data/translations';

export default function ThemeControl({
  t,
  theme,
  onChange,
}: {
  t: Copy;
  theme: Theme;
  onChange: (theme: Theme) => void;
}) {
  const Icon = theme === 'system' ? Monitor : theme === 'dark' ? Moon : Sun;
  return (
    <div className="theme-control">
      <Icon size={19} aria-hidden="true" />
      <select
        aria-label={t.themeLabel}
        value={theme}
        onChange={(e) => onChange(e.target.value as Theme)}
      >
        <option value="light">{t.themeLight}</option>
        <option value="dark">{t.themeDark}</option>
        <option value="system">{t.themeSystem}</option>
      </select>
    </div>
  );
}
