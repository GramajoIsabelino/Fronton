import { StyleSheet } from 'react-native';
import type { AppColors } from '../../theme';

export function createScreenStyles(colors: AppColors) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    container: { flexGrow: 1, padding: 22, paddingBottom: 42 },
    title: { color: colors.text, fontSize: 28, lineHeight: 34, fontWeight: '700', letterSpacing: -0.7 },
    description: { color: colors.muted, fontSize: 14.5, lineHeight: 20, letterSpacing: 0.3, marginBottom: 20 },
    placeholder: { color: colors.muted, fontSize: 14.5, marginBottom: 20 },
    header: { color: colors.text, fontSize: 19, lineHeight: 24, fontWeight: '700', letterSpacing: 0.6, marginBottom: 10 },
    section: { marginTop: 22 },
    dateButton: { backgroundColor: colors.surfaceRaised, borderRadius: 16, padding: 16, shadowColor: colors.shadow, shadowOpacity: 0.12, shadowRadius: 12, shadowOffset: { width: 0, height: 5 }, elevation: 3 },
    dateLabel: { color: colors.muted, fontSize: 12, marginBottom: 5 },
    dateText: { color: colors.text, fontSize: 16, fontWeight: '700' },
    list: { backgroundColor: colors.surfaceRaised, borderRadius: 16, overflow: 'hidden', shadowColor: colors.shadow, shadowOpacity: 0.1, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
    item: { alignItems: 'center', flexDirection: 'row', minHeight: 54, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: colors.track },
    lastItem: { borderBottomWidth: 0 },
    itemText: { color: colors.text, flex: 1, fontSize: 14.5, marginLeft: 12 },
    itemSelected: { backgroundColor: colors.accentSoft },
    itemTextSelected: { color: colors.accent, fontWeight: '700' },
    selectionCount: { color: colors.muted, fontSize: 13, marginBottom: 8 },
    helperText: { color: colors.muted, fontSize: 14, padding: 14 },
    loading: { alignItems: 'center', flexDirection: 'row', marginTop: 22, gap: 10 },
    checkbox: { alignItems: 'center', borderColor: colors.muted, borderRadius: 7, borderWidth: 2, height: 22, justifyContent: 'center', width: 22 },
    checkmark: { color: colors.accent, fontSize: 16, fontWeight: '800' },
    actions: { gap: 12, marginTop: 28 },
    error: { color: colors.danger, fontSize: 14, marginTop: 12 },
    retry: { color: colors.accent, fontSize: 14, fontWeight: '700', marginTop: 8 },
    radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.muted, justifyContent: 'center', alignItems: 'center' },
    radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.accent },
  });
}
