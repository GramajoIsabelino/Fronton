import { Image, StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';

import { ThemeProvider } from '../theme';

export default function RootLayout() {
    return (
        <ThemeProvider>
            <View style={styles.root}>
                <Image
                    source={require('../images/0a4a026d4364efb0c8cbd442b8d9a805.jpg')} // Cambia por la ruta de tu imagen
                    style={styles.background}
                    resizeMode="cover"
                />
                <View style={styles.overlay} pointerEvents="none" />

                <View style={styles.content}>
                    <Stack
                        screenOptions={{
                            headerShown: false,
                            contentStyle: {
                                backgroundColor: 'transparent',
                            },
                        }}
                    />
                </View>
            </View>
        </ThemeProvider>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },

    background: {
        ...StyleSheet.absoluteFill,
        width: '100%',
        height: '100%',
    },

    content: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    overlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(255, 255, 255, 0.42)',
    },
});