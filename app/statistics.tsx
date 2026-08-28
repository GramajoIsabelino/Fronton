import { Link } from 'expo-router';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '../components/ActionButton';

export default function StatisticsScreen() {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.title}>Estadísticas</Text>
                <Text style={styles.description}>
                    En esta etapa se mostrarán estadísticas de jornada y temporada.
                </Text>

                <Text style={styles.placeholder}>Pantalla de estadísticas histórica.</Text>

                <Link href="/" asChild>
                    <ActionButton title="Volver al inicio" variant="secondary" />
                </Link>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F4F7FB',
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
});
