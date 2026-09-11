import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export type AppColors = {
  background: string; surface: string; surfaceRaised: string; text: string; muted: string; strong: string;
  track: string; accent: string; accentSoft: string; secondary: string; secondarySoft: string;
  success: string; successSoft: string; danger: string; dangerSoft: string; shadow: string;
};
const palettes: Record<'light' | 'dark', AppColors> = {
  light: { background: 'transparent', surface: 'rgba(248,246,242,0.9)', surfaceRaised: 'rgba(255,255,255,0.94)', text: '#292927', muted: '#77756F', strong: '#111110', track: '#D9D5CF', accent: '#E87932', accentSoft: '#F9E3D3', secondary: '#6D7BCE', secondarySoft: '#E7E9FA', success: '#4A9B69', successSoft: '#E2F2E7', danger: '#C7605B', dangerSoft: '#F8E4E2', shadow: '#8F8B84' },
  dark: { background: 'transparent', surface: 'rgba(34,35,33,0.92)', surfaceRaised: 'rgba(44,45,42,0.95)', text: '#F2F0EB', muted: '#AAA79F', strong: '#FFFFFF', track: '#3A3B37', accent: '#F28A43', accentSoft: '#4A2D1D', secondary: '#9AA5F5', secondarySoft: '#30334E', success: '#75C890', successSoft: '#263E2E', danger: '#E0837B', dangerSoft: '#482A29', shadow: '#000000' },
};
const ThemeContext = createContext<{ mode: 'light' | 'dark'; colors: AppColors; toggleMode: () => void } | null>(null);
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  useEffect(() => { const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('fronton:theme') : null; if (saved === 'dark' || saved === 'light') setMode(saved); }, []);
  const toggleMode = () => setMode((current) => { const next = current === 'light' ? 'dark' : 'light'; if (typeof localStorage !== 'undefined') localStorage.setItem('fronton:theme', next); return next; });
  const value = useMemo(() => ({ mode, colors: palettes[mode], toggleMode }), [mode]);
  return <ThemeContext.Provider value={value}><StatusBar style={mode === 'dark' ? 'light' : 'dark'} />{children}</ThemeContext.Provider>;
}
export function useTheme() { const value = useContext(ThemeContext); if (!value) throw new Error('useTheme must be used inside ThemeProvider'); return value; }
export function ThemeToggle() {
  const { mode, colors, toggleMode } = useTheme();
  return <Pressable accessibilityRole="button" accessibilityLabel={`Cambiar a modo ${mode === 'dark' ? 'claro' : 'oscuro'}`} onPress={toggleMode} style={[styles.button, { backgroundColor: colors.surfaceRaised, shadowColor: colors.shadow }]}><Text style={[styles.icon, { color: colors.strong }]}>{mode === 'dark' ? '☀' : '☾'}</Text></Pressable>;
}
const styles = StyleSheet.create({ button: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', shadowOpacity: 0.12, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 3 }, icon: { fontSize: 18 } });
