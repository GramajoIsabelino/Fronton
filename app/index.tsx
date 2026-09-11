import React, { useEffect, useState } from 'react';
import { Link, useRouter } from 'expo-router';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
    Pressable,
    Alert,
} from 'react-native';

import { ActionButton } from '../components/ActionButton';
import { getSessions } from '../storage';
import { obtenerJornadaActiva } from '../api/client';
import type { Session } from '../types';
import { ThemeToggle, useTheme } from '../theme';

export default function HomeScreen() {
    const { colors } = useTheme();
    const [sessions, setSessions] = useState<Session[]>([]);
    const [jornadaActiva, setJornadaActiva] = useState<any | null>(null);
    const router = useRouter();

    useEffect(() => {
        (async () => {
            const s = await getSessions();
            setSessions(s);

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
        <SafeAreaView style={[styles.safeArea,]}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <View style={styles.topLine}><View><Text style={[styles.eyebrow, { color: colors.accent }]}>FRONTÓN · ONWARD</Text><Text style={[styles.title, { color: colors.text }]}>a lo azul!!!!</Text></View><ThemeToggle /></View>
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

                    <View style={{ marginTop: 30 }}>
                        <Text
                            style={{
                                fontSize: 19,
                                fontWeight: '700',
                                marginBottom: 12,
                                color: colors.text,
                            }}
                        >
                            Jornadas guardadas
                        </Text>

                        {sessions.length === 0 ? (
                            <Text style={{ color: colors.muted }}>
                                No hay jornadas aún.
                            </Text>
                        ) : (
                            sessions.map((s) => (
                                <Link
                                    key={s.id}
                                    href={`/session-detail/${s.id}`}
                                    asChild
                                >
                                    <Pressable
                                        style={[styles.sessionCard, { backgroundColor: colors.surfaceRaised, shadowColor: colors.shadow }]}
                                    >
                                        <Text
                                            style={{
                                                fontWeight: '700', color: colors.text,
                                            }}
                                        >
                                            {s.date}
                                        </Text>

                                        <Text
                                            style={{
                                                color: colors.muted,
                                            }}
                                        >
                                            {s.players.length} jugadores
                                        </Text>
                                    </Pressable>
                                </Link>
                            ))
                        )}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'transparent',
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
        color: '#4B6584',
        fontSize: 13,
        fontWeight: '600',
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        marginBottom: 8,
    },

    title: {
        color: '#16263C',
        fontSize: 28,
        fontWeight: '700',
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