import { Pressable, StyleSheet, Text, type ViewStyle } from 'react-native';

interface ActionButtonProps {
    title: string;
    subtitle?: string;
    onPress?: () => void;
    variant?: 'primary' | 'secondary';
    style?: ViewStyle;
}

export function ActionButton({
    title,
    subtitle,
    onPress,
    variant = 'primary',
    style,
}: ActionButtonProps) {
    const containerStyle = [
        styles.button,
        variant === 'secondary' ? styles.secondaryButton : styles.primaryButton,
        style,
    ];

    return (
        <Pressable onPress={onPress} style={containerStyle}>
            <Text style={styles.title}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 18,
        paddingHorizontal: 20,
        paddingVertical: 18,
        minHeight: 88,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 3,
    },
    primaryButton: {
        backgroundColor: '#1F6FEB',
    },
    secondaryButton: {
        backgroundColor: '#EAF2FF',
        borderWidth: 1,
        borderColor: '#DCE8FF',
    },
    title: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '700',
        textAlign: 'center',
    },
    subtitle: {
        color: '#dfeaff',
        marginTop: 6,
        fontSize: 13,
        textAlign: 'center',
    },
});
