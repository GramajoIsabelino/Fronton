import React, { useEffect, useMemo, useState } from 'react';
import { Alert, ImageBackground, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';


import { ActionButton } from '../components/ActionButton';
import {
    guardarPartido,
    getJugadores,
    obtenerJornada,
    obtenerEstadisticasJornada,
    cerrarJornada,
} from '../api/client';
import type { Session } from '../types';
import { useTheme } from '../theme';

const TEAM_LIMIT = 2;

// type StandingRow = PlayerScore & {
//     position: number;
//     status: 'leader' | 'rising' | 'falling' | 'neutral';
// };

export default function SessionScreen() {
    const { colors } = useTheme();
    const [session, setSession] = useState<Session | null>(null);
    const [teamA, setTeamA] = useState<string[]>([]);
    const [teamB, setTeamB] = useState<string[]>([]);
    const [winner, setWinner] = useState<'teamA' | 'teamB' | null>(null);
    const [players, setPlayers] = useState<any[]>([]);
    const [estadisticas, setEstadisticas] = useState<any[]>([]);


    const router = useRouter();
    const { jornadaId } = useLocalSearchParams<{
        jornadaId: string;
    }>();


    useEffect(() => {
        (async () => {
            try {
                if (!jornadaId) {
                    Alert.alert(
                        'Error',
                        'No se encontró el ID de la jornada.'
                    );
                    return;
                }

                const [jornada, jugadores] = await Promise.all([
                    obtenerJornada(Number(jornadaId)),
                    getJugadores(),
                ]);

                let estadisticasJornada;

                try {
                    estadisticasJornada = await obtenerEstadisticasJornada(
                        Number(jornadaId)
                    );
                } catch (error) {
                    console.error('Error cargando estadísticas:', error);

                    estadisticasJornada = {
                        jugadores: [],
                    };
                }
                setEstadisticas(
                    estadisticasJornada.jugadores ?? []
                );
                const jugadoresJornada = new Set(
                    (jornada.jugadores ?? []).map((id: number) => String(id))
                );

                const jugadoresSeleccionados = jugadores.filter(
                    (player: any) =>
                        jugadoresJornada.has(String(player.id))
                );

                setPlayers(jugadoresSeleccionados);

                const matches = (jornada.partidos ?? []).map((partido: any) => ({
                    id: String(partido.id),
                    sessionId: String(jornada.id),
                    winner: partido.ganador,
                    players: [
                        ...(partido.equipo_a ?? []).map((jugador: any) => ({
                            playerId: String(jugador.jugador_id),
                            team: 'A' as const,
                            points: Number(jugador.puntos),
                        })),
                        ...(partido.equipo_b ?? []).map((jugador: any) => ({
                            playerId: String(jugador.jugador_id),
                            team: 'B' as const,
                            points: Number(jugador.puntos),
                        })),
                    ],
                    createdAt: '',
                }));

                setSession({
                    id: String(jornada.id),
                    date: jornada.fecha,
                    seasonId: String(jornada.temporada_id),
                    groupId: '',
                    status:
                        jornada.estado === 'finalizada'
                            ? 'finalizada'
                            : 'en juego',
                    matches,
                    players: jugadoresSeleccionados.map((jugador: any) =>
                        String(jugador.id)
                    ),
                    createdAt: '',
                });

                console.log('SESSION CON PARTIDOS:', matches);


            } catch (error) {
                console.error(
                    'Error cargando jornada:',
                    error
                );

                Alert.alert(
                    'Error',
                    'No se pudo cargar la jornada.'
                );
            }
        })();
    }, [jornadaId]);

    const availablePlayers = useMemo(() => {
        return players.map((player) => ({
            id: String(player.id),
            name: player.nombre,
        }));
    }, [players]);

    const standings = useMemo(() => {
        return estadisticas.map((row, index) => ({
            playerId: String(row.jugador_id),
            name: row.nombre,
            points: row.puntos,
            wins: row.partidos_ganados,
            losses: row.partidos_perdidos,
            matchesPlayed: row.partidos_jugados,
            matchesNotPlayed: row.partidos_no_jugados,
            position: index + 1,
        }));
    }, [estadisticas]);

    const isSessionClosed = session?.status === 'finalizada';

    const togglePlayer = (team: 'teamA' | 'teamB', playerId: string) => {
        if (isSessionClosed) return;

        const target = team === 'teamA' ? teamA : teamB;
        const other = team === 'teamA' ? teamB : teamA;

        if (target.includes(playerId)) {
            if (team === 'teamA') setTeamA((prev) => prev.filter((id) => id !== playerId));
            else setTeamB((prev) => prev.filter((id) => id !== playerId));
            return;
        }

        if (target.length >= TEAM_LIMIT) {
            Alert.alert('Límite de equipo', 'Cada equipo puede tener máximo 2 jugadores.');
            return;
        }

        if (other.includes(playerId)) {
            if (team === 'teamA') setTeamB((prev) => prev.filter((id) => id !== playerId));
            else setTeamA((prev) => prev.filter((id) => id !== playerId));
        }

        if (team === 'teamA') setTeamA((prev) => [...prev, playerId]);
        else setTeamB((prev) => [...prev, playerId]);
    };



    const onSaveMatch = async () => {
        if (!session || isSessionClosed) return;

        if (teamA.length !== TEAM_LIMIT || teamB.length !== TEAM_LIMIT) {
            Alert.alert(
                'Faltan jugadores',
                'Debes seleccionar 2 jugadores para cada cuadro.'
            );
            return;
        }

        if (!winner) {
            Alert.alert(
                'Falta ganador',
                'Elegí qué equipo ganó el partido.'
            );
            return;
        }

        try {
            const idJornada = Number(jornadaId);

            if (!Number.isInteger(idJornada)) {
                Alert.alert(
                    'Error',
                    'La jornada actual no tiene un ID válido.'
                );
                return;
            }

            const equipoA = teamA.map(Number);
            const equipoB = teamB.map(Number);

            if (
                equipoA.some(Number.isNaN) ||
                equipoB.some(Number.isNaN)
            ) {
                Alert.alert(
                    'Error',
                    'Uno de los jugadores seleccionados no tiene un ID válido.'
                );
                return;
            }

            await guardarPartido(
                idJornada,
                equipoA,
                equipoB,
                winner === 'teamA' ? 'A' : 'B'
            );

            const nuevasEstadisticas =
                await obtenerEstadisticasJornada(idJornada);

            setEstadisticas(
                nuevasEstadisticas.jugadores ?? []
            );

            setTeamA([]);
            setTeamB([]);
            setWinner(null);

            Alert.alert(
                'Partido guardado',
                'El partido se guardó correctamente.'
            );
        } catch (error) {
            console.error('Error guardando partido:', error);

            Alert.alert(
                'Error',
                'No se pudo guardar el partido.'
            );
        }
    };



    const onFinishSession = async () => {
        console.log('CLICK FINALIZAR JORNADA');

        if (!session) {
            console.log('No hay session');
            return;
        }

        const idJornada = Number(jornadaId);

        console.log('ID JORNADA:', idJornada);

        if (!Number.isInteger(idJornada)) {
            Alert.alert('Error', 'La jornada actual no tiene un ID válido.');
            return;
        }

        try {
            console.log('Cerrando jornada...');

            const resultado = await cerrarJornada(idJornada);

            console.log('JORNADA CERRADA:', resultado);

            setSession((current) =>
                current
                    ? {
                        ...current,
                        status: 'finalizada',
                    }
                    : current
            );

            Alert.alert(
                'Jornada finalizada',
                'La jornada se cerró correctamente.',
                [
                    {
                        text: 'Aceptar',
                        onPress: () => router.replace('/'),
                    },
                ]
            );
        } catch (error) {
            console.error('ERROR CERRANDO JORNADA:', error);

            Alert.alert(
                'Error',
                'No se pudo finalizar la jornada.'
            );
        }
    };



    if (!session) {
        return (
            <ImageBackground source={require('../images/0a4a026d4364efb0c8cbd442b8d9a805.jpg')} style={styles.background} imageStyle={styles.backgroundImage} resizeMode="cover">
            <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
                <View style={styles.container}>
                    <Text style={[styles.title, { color: colors.text }]}>Jornada en juego</Text>
                    <Text style={styles.placeholder}>
                        Cargando sesión...
                    </Text>
                </View>
            </SafeAreaView>
            </ImageBackground>
        );
    }



    return (
        <ImageBackground source={require('../images/0a4a026d4364efb0c8cbd442b8d9a805.jpg')} style={styles.background} imageStyle={styles.backgroundImage} resizeMode="cover">
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={styles.container}>

                <Text style={[styles.title, { color: colors.text }]}>Jornada en juego</Text>

                <Text style={styles.description}>
                    Seleccioná 2 jugadores para cada equipo.
                </Text>

                {/* EQUIPO A */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Equipo A
                    </Text>

                    <View style={styles.playerGrid}>
                        {availablePlayers.map((player) => {
                            const selected = teamA.includes(player.id);

                            return (
                                <Pressable
                                    key={player.id}
                                    onPress={() =>
                                        togglePlayer('teamA', player.id)
                                    }
                                    style={[
                                        styles.playerChip,
                                        selected &&
                                        styles.playerChipSelected,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.playerChipText,
                                            selected &&
                                            styles.playerChipTextSelected,
                                        ]}
                                    >
                                        {player.name}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>
                </View>

                {/* EQUIPO B */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Equipo B
                    </Text>

                    <View style={styles.playerGrid}>
                        {availablePlayers.map((player) => {
                            const selected = teamB.includes(player.id);

                            return (
                                <Pressable
                                    key={player.id}
                                    onPress={() =>
                                        togglePlayer('teamB', player.id)
                                    }
                                    style={[
                                        styles.playerChip,
                                        selected &&
                                        styles.playerChipSelectedAlt,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.playerChipText,
                                            selected &&
                                            styles.playerChipTextSelected,
                                        ]}
                                    >
                                        {player.name}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>
                </View>

                {/* GANADOR */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Ganador
                    </Text>

                    <View style={styles.winnerRow}>
                        <Pressable
                            disabled={
                                isSessionClosed ||
                                teamA.length !== TEAM_LIMIT ||
                                teamB.length !== TEAM_LIMIT
                            }
                            onPress={() => setWinner('teamA')}
                            style={[
                                styles.winnerButton,
                                winner === 'teamA' &&
                                styles.winnerButtonActive,
                            ]}
                        >
                            <Text style={styles.winnerButtonText}>
                                Equipo A
                            </Text>
                        </Pressable>

                        <Pressable
                            disabled={
                                isSessionClosed ||
                                teamA.length !== TEAM_LIMIT ||
                                teamB.length !== TEAM_LIMIT
                            }
                            onPress={() => setWinner('teamB')}
                            style={[
                                styles.winnerButton,
                                winner === 'teamB' &&
                                styles.winnerButtonActiveAlt,
                            ]}
                        >
                            <Text style={styles.winnerButtonText}>
                                Equipo B
                            </Text>
                        </Pressable>
                    </View>
                </View>

                {/* GUARDAR PARTIDO */}
                <ActionButton
                    title="Guardar partido"
                    onPress={onSaveMatch}
                />

                {/* CLASIFICACIÓN */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Clasificación
                    </Text>

                    {standings.length === 0 ? (
                        <Text style={styles.placeholder}>
                            Todavía no hay partidos registrados.
                        </Text>
                    ) : (
                        standings.map((row) => (
                            <View
                                key={row.playerId}
                                style={styles.standingRow}
                            >
                                <View style={styles.standingMeta}>
                                    <View style={styles.positionBadge}>
                                        <Text
                                            style={
                                                styles.positionBadgeText
                                            }
                                        >
                                            {row.position}
                                        </Text>
                                    </View>

                                    <View>
                                        <Text style={styles.scoreName}>
                                            {row.name}
                                        </Text>

                                        <Text style={styles.scoreSubtext}>
                                            {row.wins} ganados ·{' '}
                                            {row.losses} perdidos ·{' '}
                                            {row.matchesPlayed} jugados
                                        </Text>
                                    </View>
                                </View>

                                <Text style={styles.scoreValue}>
                                    {row.points} pts
                                </Text>
                            </View>
                        ))
                    )}
                </View>

                {/* FINALIZAR */}
                {!isSessionClosed && (
                    <ActionButton
                        title="Finalizar jornada"
                        onPress={onFinishSession}
                        variant="secondary"
                    />
                )}

                {isSessionClosed && (
                    <View style={styles.alertBanner}>
                        <Text style={styles.alertBannerText}>
                            Esta jornada ya está finalizada.
                        </Text>
                    </View>
                )}

                <Link href="/" asChild>
                    <ActionButton
                        title="Volver al inicio"
                        variant="secondary"
                    />
                </Link>

            </ScrollView>
        </SafeAreaView>
        </ImageBackground>
    );

}

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    backgroundImage: {
        opacity: 0.38,
    },
    safeArea: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    container: {
        flexGrow: 1,
        padding: 24,
        gap: 20,
    },
    title: {
        color: '#16263C',
        fontSize: 32,
        fontWeight: '800',
        marginBottom: 6,
    },
    description: {
        color: '#465A75',
        fontSize: 16,
        lineHeight: 24,
    },
    alertBanner: {
        backgroundColor: '#FFF7ED',
        borderWidth: 1,
        borderColor: '#F59E0B',
        padding: 12,
        borderRadius: 12,
    },
    alertBannerText: {
        color: '#9A5B00',
        fontWeight: '700',
    },
    section: {
        // backgroundColor: '#fff',
        borderRadius: 18,
        padding: 16,
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    sectionTitle: {
        color: '#16263C',
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 12,
    },
    playerGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    playerChip: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: '#D9E3F2',
        backgroundColor: '#F5F8FE',
    },
    playerChipSelected: {
        backgroundColor: '#E8F3FF',
        borderColor: '#3A82F7',
    },
    playerChipSelectedAlt: {
        backgroundColor: '#F9F3FF',
        borderColor: '#8B5CF6',
    },
    playerChipText: {
        color: '#1A2433',
        fontSize: 13,
        fontWeight: '600',
    },
    playerChipTextSelected: {
        color: '#0B57D0',
    },
    winnerRow: {
        flexDirection: 'row',
        gap: 12,
    },
    winnerButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: '#EEF3FF',
        alignItems: 'center',
    },
    winnerButtonActive: {
        backgroundColor: '#DCEEFF',
    },
    winnerButtonActiveAlt: {
        backgroundColor: '#F0E7FF',
    },
    winnerButtonText: {
        color: '#16263C',
        fontWeight: '700',
    },
    placeholder: {
        color: '#7284A0',
        fontSize: 15,
    },
    standingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#E6ECF6',
        backgroundColor: '#F9FBFF',
        marginBottom: 8,
    },
    standingRowLeader: {
        backgroundColor: '#E9F9EE',
        borderColor: '#B7EDC7',
    },
    standingRowRising: {
        backgroundColor: '#EAF3FF',
        borderColor: '#CDE2FF',
    },
    standingRowFalling: {
        backgroundColor: '#FFF1F1',
        borderColor: '#F8C9C9',
    },
    standingMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flex: 1,
    },
    positionBadge: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: '#E7EEF9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    positionBadgeFalling: {
        backgroundColor: '#FDECEC',
    },
    positionBadgeText: {
        color: '#15263C',
        fontSize: 12,
        fontWeight: '800',
    },
    scoreSubtext: {
        color: '#697F9D',
        fontSize: 12,
        marginTop: 2,
    },
    scoreName: {
        color: '#16263C',
        fontSize: 15,
        fontWeight: '600',
    },
    scoreValue: {
        color: '#16263C',
        fontSize: 15,
        fontWeight: '700',
    },
});
