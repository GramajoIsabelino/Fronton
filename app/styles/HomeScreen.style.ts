import { StyleSheet } from 'react-native';



export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'hsl(218, 28%, 48%)',
    },
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
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
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    itemText: {
        marginLeft: 12,
        fontSize: 16,
    },
    itemSelected: {
        // fontSize: 16,
        // fontWeight: 'bold',
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

    itemTextSelected: {
        fontWeight: 'bold',
        color: '#007AFF',
    },


});
