import React, { createContext, useContext, useMemo } from 'react';
import { StatusBar } from 'expo-status-bar';

export type AppColors = {
  background: string; surface: string; surfaceRaised: string; text: string; muted: string; strong: string;
  track: string; accent: string; accentSoft: string; secondary: string; secondarySoft: string;
  success: string; successSoft: string; danger: string; dangerSoft: string; shadow: string;
};
const colors: AppColors = {
  background: 'transparent', surface: '#F7F3EC', surfaceRaised: '#FFFFFF',
  text: '#000000', muted: '#1F2937', strong: '#000000', track: '#D5DCE5',
  accent: '#C2410C', accentSoft: '#FFEDD5', secondary: '#315BA6',
  secondarySoft: '#E8EEF9', success: '#217346', successSoft: '#DCFCE7',
  danger: '#B42318', dangerSoft: '#FEE4E2', shadow: '#475569',
};
const ThemeContext = createContext<{ colors: AppColors } | null>(null);
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const value = useMemo(() => ({ colors }), []);
  return <ThemeContext.Provider value={value}><StatusBar style="dark" />{children}</ThemeContext.Provider>;
}
export function useTheme() { const value = useContext(ThemeContext); if (!value) throw new Error('useTheme must be used inside ThemeProvider'); return value; }
