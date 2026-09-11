import { ImageBackground, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { ThemeProvider } from '../theme';

export default function RootLayout() {
    return (
        <ThemeProvider>
            <ImageBackground
                source={require('../images/0a4a026d4364efb0c8cbd442b8d9a805.jpg')}
                resizeMode="cover"
                style={styles.background}
            >
                <Stack
                    screenOptions={{
                        headerShown: false,
                        contentStyle: {
                            backgroundColor: 'transparent',
                        },
                    }}
                />
            </ImageBackground>
        </ThemeProvider>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
});