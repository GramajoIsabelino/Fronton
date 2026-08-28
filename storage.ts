import { Platform } from 'react-native';
import type { Session } from './types';

type StorageImpl = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

let impl: StorageImpl | null = null;

if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
  impl = {
    getItem: async (k) => localStorage.getItem(k),
    setItem: async (k, v) => localStorage.setItem(k, v),
    removeItem: async (k) => localStorage.removeItem(k),
  };
} else {
  try {
    // require only on native platforms if available
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    impl = {
      getItem: (k) => AsyncStorage.getItem(k),
      setItem: (k, v) => AsyncStorage.setItem(k, v),
      removeItem: (k) => AsyncStorage.removeItem(k),
    };
  } catch (e) {
    // fallback in-memory storage
    console.warn('AsyncStorage not available — using in-memory fallback. Install @react-native-async-storage/async-storage for persistence on native.');
    const mem = new Map<string, string>();
    impl = {
      getItem: async (k) => (mem.has(k) ? mem.get(k)! : null),
      setItem: async (k, v) => { mem.set(k, v); },
      removeItem: async (k) => { mem.delete(k); },
    };
  }
}

const KEY = 'fronton:sessions:v1';

export async function getSessions(): Promise<Session[]> {
  const raw = await impl!.getItem(KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Session[];
  } catch (e) {
    console.warn('Failed to parse sessions from storage', e);
    return [];
  }
}

export async function saveSessions(sessions: Session[]): Promise<void> {
  await impl!.setItem(KEY, JSON.stringify(sessions));
}

export async function saveSession(session: Session): Promise<void> {
  const sessions = await getSessions();
  const idx = sessions.findIndex((s) => s.id === session.id);
  if (idx >= 0) sessions[idx] = session;
  else sessions.unshift(session);
  await saveSessions(sessions);
}

export async function deleteSession(id: string): Promise<void> {
  const sessions = await getSessions();
  await saveSessions(sessions.filter((s) => s.id !== id));
}

export async function getSession(id: string): Promise<Session | null> {
  const sessions = await getSessions();
  return sessions.find((s) => s.id === id) ?? null;
}
