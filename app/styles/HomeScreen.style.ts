import { StyleSheet } from 'react-native';



export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'hsl(218, 28%, 48%)',
    },
    container: {
        flexGrow: 1,
        padding: 24,
        paddingBottom: 40,
    },
    title: {
        color: '#16263C',
        fontSize: 32,
        fontWeight: '800',
        marginBottom: 12,
    },
    description: {
        color: '#465A75',
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 20,
    },
    placeholder: {
        color: '#7284A0',
        fontSize: 15,
        marginBottom: 28,
    },
    // container: {
    //     padding: 16,
    // },
    header: {
        color: '#16263C',
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 10,
    },
    section: {
        marginTop: 22,
    },
    dateButton: {
        backgroundColor: '#FFFFFF',
        borderColor: '#DCE5F0',
        borderRadius: 12,
        borderWidth: 1,
        padding: 14,
    },
    dateLabel: {
        color: '#7284A0',
        fontSize: 12,
        marginBottom: 4,
    },
    dateText: {
        color: '#16263C',
        fontSize: 16,
        fontWeight: '600',
    },
    list: {
        backgroundColor: '#FFFFFF',
        borderColor: '#DCE5F0',
        borderRadius: 12,
        borderWidth: 1,
        overflow: 'hidden',
    },
    item: {
        alignItems: 'center',
        borderBottomColor: '#EDF1F6',
        borderBottomWidth: 1,
        flexDirection: 'row',
        minHeight: 52,
        paddingHorizontal: 14,
    },
    lastItem: {
        borderBottomWidth: 0,
    },
    itemText: {
        color: '#263B55',
        flex: 1,
        fontSize: 15,
        marginLeft: 12,
    },
    itemSelected: {
        backgroundColor: '#EEF5FF',
    },
    itemTextSelected: {
        color: '#1F6FEB',
        fontWeight: '700',
    },
    selectionCount: {
        color: '#7284A0',
        fontSize: 13,
        marginBottom: 8,
    },
    helperText: {
        color: '#7284A0',
        fontSize: 14,
        padding: 14,
    },
    loading: {
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 22,
    },
    checkbox: {
        alignItems: 'center',
        borderColor: '#9BAEC5',
        borderRadius: 5,
        borderWidth: 2,
        height: 22,
        justifyContent: 'center',
        width: 22,
    },
    checkmark: {
        color: '#1F6FEB',
        fontSize: 16,
        fontWeight: '800',
    },
    actions: {
        gap: 12,
        marginTop: 28,
    },
    error: {
        color: '#B42318',
        fontSize: 14,
        marginTop: 12,
    },
    retry: {
        color: '#1F6FEB',
        fontSize: 14,
        fontWeight: '700',
        marginTop: 8,
    },

    radio: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: '#555',
        justifyContent: 'center',
        alignItems: 'center',
    },

    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#007AFF',
    },

});
