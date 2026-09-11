import { StyleSheet } from 'react-native';
import type { AppColors } from '../../theme';

export function createScreenStyles(colors: AppColors) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    background: { flex: 1 },
    backgroundImage: { opacity: 0.38 },
    backgroundImageContainer: {
      flex: 1,
      width: '100%',
      height: '100%',
    },
    container: { flexGrow: 1, padding: 22, paddingBottom: 42 },
    title: { color: '#000000', fontSize: 32, lineHeight: 38, fontWeight: '800', letterSpacing: -0.7 },
    description: { color: '#1F2937', fontSize: 16, lineHeight: 23, letterSpacing: 0.3, marginBottom: 20 },
    placeholder: { color: '#1F2937', fontSize: 16, marginBottom: 20 },
    header: { color: '#000000', fontSize: 22, lineHeight: 28, fontWeight: '800', letterSpacing: 0.6, marginBottom: 10 },
    section: { marginTop: 22 },
    dateButton: { backgroundColor: colors.surfaceRaised, borderRadius: 16, padding: 16, shadowColor: colors.shadow, shadowOpacity: 0.12, shadowRadius: 12, shadowOffset: { width: 0, height: 5 }, elevation: 3 },
    dateLabel: { color: '#1F2937', fontSize: 14, marginBottom: 5 },
    dateText: { color: '#000000', fontSize: 18, fontWeight: '800' },
    list: { backgroundColor: colors.surfaceRaised, borderRadius: 16, overflow: 'hidden', shadowColor: colors.shadow, shadowOpacity: 0.1, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
    item: { alignItems: 'center', flexDirection: 'row', minHeight: 54, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: colors.track },
    lastItem: { borderBottomWidth: 0 },
    itemText: { color: '#000000', flex: 1, fontSize: 17, marginLeft: 12 },
    itemSelected: { backgroundColor: colors.accentSoft },
    itemTextSelected: { color: colors.accent, fontWeight: '700' },
    selectionCount: { color: '#1F2937', fontSize: 15, marginBottom: 8 },
    helperText: { color: '#1F2937', fontSize: 16, padding: 14 },
    loading: { alignItems: 'center', flexDirection: 'row', marginTop: 22, gap: 10 },
    checkbox: { alignItems: 'center', borderColor: colors.muted, borderRadius: 7, borderWidth: 2, height: 22, justifyContent: 'center', width: 22 },
    checkmark: { color: colors.accent, fontSize: 16, fontWeight: '800' },
    actions: { gap: 12, marginTop: 28 },
    error: { color: colors.danger, fontSize: 16, marginTop: 12 },
    retry: { color: colors.accent, fontSize: 16, fontWeight: '700', marginTop: 8 },
    radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.muted, justifyContent: 'center', alignItems: 'center' },
    radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.accent },
  });
}
