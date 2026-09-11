import { useEffect, useState } from 'react';
import { Link } from 'expo-router';
import {
    ImageBackground,
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
        <ImageBackground
            source={require('../images/0a4a026d4364efb0c8cbd442b8d9a805.jpg')}
            style={styles.background}
            imageStyle={styles.backgroundImage}
            resizeMode="cover"
        >
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

                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View style={styles.table}>
                                <View style={[styles.tableRow, styles.tableHeader]}>
                                    <Text style={[styles.tableCell, styles.rankCell]}>#</Text>
                                    <Text style={[styles.tableCell, styles.nameCell]}>Jugador</Text>
                                    <Text style={styles.tableCell}>Pts</Text>
                                    <Text style={styles.tableCell}>Jor</Text>
                                    <Text style={styles.tableCell}>PJ</Text>
                                    <Text style={styles.tableCell}>PG</Text>
                                    <Text style={styles.tableCell}>PP</Text>
                                    <Text style={styles.tableCell}>Prom.</Text>
                                </View>
                                {jugadores.map((jugador, index) => (
                                    <View
                                        key={jugador.jugador_id}
                                        style={[styles.tableRow, index % 2 === 0 && styles.tableRowAlternate]}
                                    >
                                        <Text style={[styles.tableCell, styles.rankCell, styles.rankText]}>{index + 1}</Text>
                                        <Text numberOfLines={1} style={[styles.tableCell, styles.nameCell, styles.nameText]}>
                                            {jugador.nombre}
                                        </Text>
                                        <Text style={[styles.tableCell, styles.valueText]}>{jugador.puntos}</Text>
                                        <Text style={[styles.tableCell, styles.valueText]}>{jugador.jornadas}</Text>
                                        <Text style={[styles.tableCell, styles.valueText]}>{jugador.partidos_jugados}</Text>
                                        <Text style={[styles.tableCell, styles.valueText]}>{jugador.partidos_ganados}</Text>
                                        <Text style={[styles.tableCell, styles.valueText]}>{jugador.partidos_perdidos}</Text>
                                        <Text style={[styles.tableCell, styles.valueText]}>
                                            {jugador.promedio_puntos_por_jornada.toFixed(2)}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </ScrollView>
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
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    background: { flex: 1 },
    backgroundImage: { opacity: 0.38 },

    container: {
        padding: 24,
        paddingBottom: 40,
    },
    title: {
        color: '#000000',
        fontSize: 32,
        fontWeight: '800',
    },

    subtitle: {
        color: '#1F2937',
        fontSize: 18,
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
        color: '#1F2937',
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
        gap: 8,
    },

    sectionTitle: {
        color: '#000000',
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 6,
    },

    table: {
        backgroundColor: 'rgba(255,255,255,0.92)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        overflow: 'hidden',
    },

    tableRow: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 42,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },

    tableHeader: {
        minHeight: 36,
        backgroundColor: '#F3F4F6',
    },

    tableRowAlternate: {
        backgroundColor: '#F8FAFC',
    },

    tableCell: {
        width: 52,
        paddingHorizontal: 6,
        color: '#374151',
        fontSize: 13,
        textAlign: 'center',
    },

    rankCell: {
        width: 34,
    },

    nameCell: {
        width: 130,
        textAlign: 'left',
    },

    nameText: {
        color: '#000000',
        fontWeight: '700',
    },

    rankText: {
        color: '#C2410C',
        fontWeight: '800',
    },

    valueText: {
        color: '#000000',
        fontWeight: '700',
    },

    backButton: {
        marginTop: 20,
    },
    titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    logo: { width: 42, height: 42, borderRadius: 21, opacity: 0.9 },
});