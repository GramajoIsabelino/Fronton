import { Image, Pressable, StyleSheet, Text, View, type ImageSourcePropType, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';

interface ActionButtonProps {
    title: string;
    subtitle?: string;
    onPress?: () => void;
    variant?: 'primary' | 'secondary';
    style?: StyleProp<ViewStyle>;
    disabled?: boolean;
    iconSource?: ImageSourcePropType;
}

export function ActionButton({
    title,
    subtitle,
    onPress,
    variant = 'primary',
    style,
    disabled = false,
    iconSource,
}: ActionButtonProps) {
    const { colors } = useTheme();
    const containerStyle = [
        styles.button,
        { backgroundColor: variant === 'secondary' ? colors.surfaceRaised : colors.accent, shadowColor: colors.shadow },
        disabled && styles.disabledButton,
        style,
    ];

    return (
        <Pressable onPress={disabled ? undefined : onPress} style={containerStyle} disabled={disabled}>
            <View style={styles.content}>
                <View>
                    <Text style={[styles.title, { color: variant === 'secondary' ? colors.text : '#FFFFFF' }, disabled && styles.disabledTitle]}>{title}</Text>
                    {subtitle ? <Text style={[styles.subtitle, { color: variant === 'secondary' ? colors.muted : '#FFF1E8' }, disabled && styles.disabledSubtitle]}>{subtitle}</Text> : null}
                </View>
                {iconSource ? <Image source={iconSource} style={styles.icon} /> : null}
            </View>
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
        shadowOpacity: 0.16,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 5 },
        elevation: 3,
    },
    content: { width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    icon: { width: 48, height: 48, borderRadius: 24, opacity: 0.82 },
    primaryButton: {
    },
    secondaryButton: {
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
