import { useEffect, useState } from 'react';
import { Link } from 'expo-router';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    Image,
} from 'react-native';

import { ActionButton } from '../components/ActionButton';
import { obtenerEstadisticasAnio } from '../api/client';

interface EstadisticaJugador {
    jugador_id: number;
    nombre: string;
    jornadas: number;
    partidos_jugados: number;
    partidos_ganados: number;
    partidos_perdidos: number;
    partidos_no_jugados: number;
    puntos: number;
    promedio_puntos_por_jornada: number;
}

export default function StatisticsScreen() {
    const [jugadores, setJugadores] = useState<EstadisticaJugador[]>([]);
    const [anio, setAnio] = useState(new Date().getFullYear());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        cargarEstadisticas();
    }, []);

    async function cargarEstadisticas() {
        try {
            setLoading(true);
            setError('');

            const anioActual = new Date().getFullYear();

            const data = await obtenerEstadisticasAnio(anioActual);

            setAnio(data.anio);
            setJugadores(data.jugadores ?? []);
        } catch (error) {
            console.error('Error cargando estadísticas:', error);
            setError('No se pudieron cargar las estadísticas.');
        } finally {
            setLoading(false);
        }

    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.titleRow}>
                    <View>
                        <Text style={styles.title}>Estadísticas</Text>
                        <Text style={styles.subtitle}>Temporada {anio}</Text>
                    </View>
                    <Image source={require('../assets/fronton-logo.png')} style={styles.logo} />
                </View>

                {loading ? (
                    <View style={styles.center}>
                        <ActivityIndicator size="large" />
                        <Text style={styles.loadingText}>
                            Cargando estadísticas...
                        </Text>
                    </View>
                ) : error ? (
                    <View style={styles.center}>
                        <Text style={styles.error}>{error}</Text>

                        <ActionButton
                            title="Reintentar"
                            onPress={cargarEstadisticas}
                        />
                    </View>
                ) : jugadores.length === 0 ? (
                    <Text style={styles.empty}>
                        No hay estadísticas disponibles para {anio}.
                    </Text>
                ) : (
                    <View style={styles.ranking}>
                        <Text style={styles.sectionTitle}>
                            Ranking de jugadores
                        </Text>

                        {jugadores.map((jugador, index) => (
                            <View
                                key={jugador.jugador_id}
                                style={styles.playerCard}
                            >
                                <View style={styles.playerHeader}>
                                    <View style={styles.position}>
                                        <Text style={styles.positionText}>
                                            #{index + 1}
                                        </Text>
                                    </View>

                                    <View style={styles.playerInfo}>
                                        <Text style={styles.playerName}>
                                            {jugador.nombre}
                                        </Text>

                                        <Text style={styles.points}>
                                            {jugador.puntos} puntos
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.statsGrid}>
                                    <View style={styles.stat}>
                                        <Text style={styles.statValue}>
                                            {jugador.jornadas}
                                        </Text>
                                        <Text style={styles.statLabel}>
                                            Jornadas
                                        </Text>
                                    </View>

                                    <View style={styles.stat}>
                                        <Text style={styles.statValue}>
                                            {jugador.partidos_jugados}
                                        </Text>
                                        <Text style={styles.statLabel}>
                                            Jugados
                                        </Text>
                                    </View>

                                    <View style={styles.stat}>
                                        <Text style={styles.statValue}>
                                            {jugador.partidos_ganados}
                                        </Text>
                                        <Text style={styles.statLabel}>
                                            Ganados
                                        </Text>
                                    </View>

                                    <View style={styles.stat}>
                                        <Text style={styles.statValue}>
                                            {jugador.partidos_perdidos}
                                        </Text>
                                        <Text style={styles.statLabel}>
                                            Perdidos
                                        </Text>
                                    </View>

                                    <View style={styles.stat}>
                                        <Text style={styles.statValue}>
                                            {jugador.partidos_no_jugados}
                                        </Text>
                                        <Text style={styles.statLabel}>
                                            No jugados
                                        </Text>
                                    </View>

                                    <View style={styles.stat}>
                                        <Text style={styles.statValue}>
                                            {jugador.promedio_puntos_por_jornada.toFixed(
                                                2
                                            )}
                                        </Text>
                                        <Text style={styles.statLabel}>
                                            Promedio
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                <View style={styles.backButton}>
                    <Link href="/" asChild>
                        <ActionButton
                            title="Volver al inicio"
                            variant="secondary"
                        />
                    </Link>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,

    },

    container: {
        padding: 24,
        paddingBottom: 40,
    },
    title: {
        color: '#16263C',
        fontSize: 28,
        fontWeight: '800',
    },

    subtitle: {
        color: '#7284A0',
        fontSize: 16,
        marginTop: 5,
        marginBottom: 16,
    },

    center: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        gap: 16,
    },

    loadingText: {
        color: '#7284A0',
    },

    error: {
        color: '#C0392B',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 8,
    },

    empty: {
        color: '#7284A0',
        fontSize: 16,
        paddingVertical: 30,
    },

    ranking: {
        gap: 10,
    },

    sectionTitle: {
        color: '#16263C',
        fontSize: 19,
        fontWeight: '700',
        marginBottom: 2,
    },

    playerCard: {
        // backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },

    playerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },

    position: {
        width: 42,
        height: 42,
        borderRadius: 21,
        // backgroundColor: '#EAF0F7',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },

    positionText: {
        color: '#16263C',
        fontWeight: '800',
    },

    playerInfo: {
        flex: 1,
    },

    playerName: {
        color: '#16263C',
        fontSize: 17,
        fontWeight: '800',
    },

    points: {
        color: '#4B6584',
        marginTop: 3,
        fontSize: 14,
    },

    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },

    stat: {
        width: '31%',
        // backgroundColor: '#F4F7FB',
        borderRadius: 10,
        paddingVertical: 7,
        alignItems: 'center',
    },

    statValue: {
        color: '#16263C',
        fontSize: 18,
        fontWeight: '800',
    },

    statLabel: {
        color: '#7284A0',
        fontSize: 11,
        marginTop: 2,
        textAlign: 'center',
    },

    backButton: {
        marginTop: 20,
    },
    titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    logo: { width: 42, height: 42, borderRadius: 21, opacity: 0.9 },
});