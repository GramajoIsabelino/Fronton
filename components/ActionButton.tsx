import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

interface ActionButtonProps {
    title: string;
    subtitle?: string;
    onPress?: () => void;
    variant?: 'primary' | 'secondary';
    style?: StyleProp<ViewStyle>;
    disabled?: boolean;
}

export function ActionButton({
    title,
    subtitle,
    onPress,
    variant = 'primary',
    style,
    disabled = false,
}: ActionButtonProps) {
    const containerStyle = [
        styles.button,
        variant === 'secondary' ? styles.secondaryButton : styles.primaryButton,
        disabled && styles.disabledButton,
        style,
    ];

    return (
        <Pressable onPress={disabled ? undefined : onPress} style={containerStyle} disabled={disabled}>
            <Text style={[styles.title, disabled && styles.disabledTitle]}>{title}</Text>
            {subtitle ? <Text style={[styles.subtitle, disabled && styles.disabledSubtitle]}>{subtitle}</Text> : null}
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
        backgroundColor: '#1F6FEB',
        borderWidth: 1,
        borderColor: '#1F6FEB',
    },
    primaryButton: {
        backgroundColor: '#1F6FEB',
        borderColor: '#1F6FEB',
    },
    secondaryButton: {
        backgroundColor: '#1F6FEB',
        borderColor: '#1F6FEB',
    },
    disabledButton: {
        opacity: 0.55,
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
    disabledTitle: {
        color: '#fff',
    },
    disabledSubtitle: {
        color: '#edf4ff',
    },
});
