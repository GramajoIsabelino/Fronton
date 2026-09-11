import React, { useEffect, useState } from 'react';
import { Link, useRouter } from 'expo-router';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
    Alert,
    ImageBackground, // <-- 1. Importamos ImageBackground
} from 'react-native';

import { ActionButton } from '../components/ActionButton';
import { obtenerJornadaActiva } from '../api/client';
import { useTheme } from '../theme';

export default function HomeScreen() {
    const { colors } = useTheme();
    const [jornadaActiva, setJornadaActiva] = useState<any | null>(null);
    const router = useRouter();

    useEffect(() => {
        (async () => {
            try {
                const jornada = await obtenerJornadaActiva();
                setJornadaActiva(jornada);
            } catch (error) {
                setJornadaActiva(null);
            }
        })();
    }, []);

    const abrirJornadaActiva = async () => {
        try {
            const jornada = await obtenerJornadaActiva();

            router.push({
                pathname: '/session',
                params: {
                    jornadaId: String(jornada.id),
                },
            });
        } catch (error) {
            console.error('Error obteniendo jornada activa:', error);

            Alert.alert(
                'Jornada en juego',
                'No hay una jornada en juego actualmente.'
            );
        }
    };

    return (
        /* 2. Envolvemos todo en ImageBackground apuntando a tu imagen */
        <ImageBackground
            source={require('../images/0a4a026d4364efb0c8cbd442b8d9a805.jpg')} // <-- Cambia esta ruta por la real de tu imagen
            style={styles.backgroundImage}
            resizeMode="cover"
        >
            <SafeAreaView style={[styles.safeArea]}>
                <ScrollView contentContainerStyle={styles.container}>
                    <View style={styles.header}>
                        <View style={styles.topLine}>
                            <View>
                                <Text style={[styles.eyebrow, { color: '#FFFFFF' }]}>FRONTÓN · ONWARD</Text>
                                <Text style={[styles.title, { color: '#FFFFFF' }]}>a lo azul!!!!</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.actions}>
                        <Link href="/create-session" asChild>
                            <ActionButton
                                title="Crear jornada"
                                subtitle="Nueva fecha y jugadores"
                            />
                        </Link>

                        <Link href="/statistics" asChild>
                            <ActionButton
                                title="Estadísticas"
                                subtitle="Historial y temporada"
                                variant="secondary"
                            />
                        </Link>

                        {jornadaActiva ? (
                            <ActionButton
                                title="Jornada en juego"
                                subtitle={`Hoy · ${jornadaActiva.fecha}`}
                                variant="primary"
                                onPress={abrirJornadaActiva}
                            />
                        ) : null}

                    </View>
                </ScrollView>
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    /* 3. Estilo clave para que la imagen cubra toda la pantalla */
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },

    safeArea: {
        flex: 1,
        backgroundColor: 'transparent', // Fundamental para que no tape la imagen de fondo
    },

    container: {
        flexGrow: 1,
        padding: 24,
        justifyContent: 'center',
    },

    header: {
        marginBottom: 24,
    },
    topLine: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 12,
    },

    eyebrow: {
        fontSize: 15,
        fontWeight: '800',
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        marginBottom: 8,
    },

    title: {
        fontSize: 34,
        fontWeight: '800',
        letterSpacing: -0.7,
    },

    actions: {
        gap: 16,
    },
    sessionCard: {
        paddingVertical: 15,
        paddingHorizontal: 16,
        borderRadius: 15,
        marginBottom: 9,
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 3 },
        elevation: 2,
    },
});