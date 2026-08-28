import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';

import { ActionButton } from '../components/ActionButton';
import { activeSession, players as mockPlayers } from '../data/mockData';
import { getSessions, saveSession } from '../storage';
import type { MatchResult, PlayerScore, Session } from '../types';

const TEAM_LIMIT = 2;

export default function SessionScreen() {
    const [session, setSession] = useState<Session | null>(null);
    const [teamA, setTeamA] = useState<string[]>([]);
    const [teamB, setTeamB] = useState<string[]>([]);
    const [winner, setWinner] = useState<'teamA' | 'teamB' | null>(null);

    useEffect(() => {
        (async () => {
            const sessions = await getSessions();
            const active = sessions.find((item) => item.status === 'en juego') ?? sessions[0] ?? activeSession;
            setSession(active);
        })();
    }, []);

    const availablePlayers = useMemo(() => {
        if (!session) return [];
        return session.players.map((playerRef) => {
            const found = mockPlayers.find((player) => player.id === playerRef);
            return {
                id: playerRef,
                name: found?.name ?? String(playerRef),
            };
        });
    }, [session]);

    const togglePlayer = (team: 'teamA' | 'teamB', playerId: string) => {
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

    const scoreRows = useMemo<PlayerScore[]>(() => {
        if (!session) return [];

        const allPlayers = availablePlayers;
        const scoreMap = new Map<string, PlayerScore>();

        for (const player of allPlayers) {
            scoreMap.set(player.id, {
                playerId: player.id,
                name: player.name,
                points: 0,
                wins: 0,
                losses: 0,
                matchesPlayed: 0,
            });
        }

        const matches = session.matches ?? [];

        for (const match of matches) {
            const markPlayers = (team: string[], isWinner: boolean) => {
                for (const playerId of team) {
                    const row = scoreMap.get(playerId);
                    if (!row) continue;
                    row.matchesPlayed += 1;
                    if (isWinner) {
                        row.points += 1;
                        row.wins += 1;
                    } else {
                        row.losses += 1;
                    }
                }
            };

            markPlayers(match.teamA, match.winner === 'teamA');
            markPlayers(match.teamB, match.winner === 'teamB');
        }

        return Array.from(scoreMap.values()).sort((a, b) => b.points - a.points || a.name.localeCompare(b.name));
    }, [availablePlayers, session]);

    const onSaveMatch = async () => {
        if (!session) return;
        if (teamA.length !== TEAM_LIMIT || teamB.length !== TEAM_LIMIT) {
            Alert.alert('Faltan jugadores', 'Debes seleccionar 2 jugadores para cada cuadro.');
            return;
        }
        if (!winner) {
            Alert.alert('Falta ganador', 'Elegí qué equipo ganó el partido.');
            return;
        }

        const match: MatchResult = {
            id: `match-${Date.now()}`,
            teamA,
            teamB,
            winner,
            createdAt: new Date().toISOString(),
        };

        const updatedSession: Session = {
            ...session,
            matches: [...(session.matches ?? []), match],
            status: 'en juego',
        };

        await saveSession(updatedSession);
        setSession(updatedSession);
        setTeamA([]);
        setTeamB([]);
        setWinner(null);
    };

    if (!session) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <Text style={styles.title}>Jornada en juego</Text>
                    <Text style={styles.placeholder}>Cargando sesión...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Jornada en juego</Text>
                <Text style={styles.description}>Anotá cada partido y se actualiza la tabla del día.</Text>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Cuadro A</Text>
                    <View style={styles.playerGrid}>
                        {availablePlayers.map((player) => {
                            const selected = teamA.includes(player.id);
                            return (
                                <Pressable
                                    key={`a-${player.id}`}
                                    onPress={() => togglePlayer('teamA', player.id)}
                                    style={[styles.playerChip, selected && styles.playerChipSelected]}
                                >
                                    <Text style={[styles.playerChipText, selected && styles.playerChipTextSelected]}>{player.name}</Text>
                                </Pressable>
                            );
                        })}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Cuadro B</Text>
                    <View style={styles.playerGrid}>
                        {availablePlayers.map((player) => {
                            const selected = teamB.includes(player.id);
                            return (
                                <Pressable
                                    key={`b-${player.id}`}
                                    onPress={() => togglePlayer('teamB', player.id)}
                                    style={[styles.playerChip, selected && styles.playerChipSelectedAlt]}
                                >
                                    <Text style={[styles.playerChipText, selected && styles.playerChipTextSelected]}>{player.name}</Text>
                                </Pressable>
                            );
                        })}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>¿Quién ganó?</Text>
                    <View style={styles.winnerRow}>
                        <Pressable
                            onPress={() => setWinner('teamA')}
                            style={[styles.winnerButton, winner === 'teamA' && styles.winnerButtonActive]}
                        >
                            <Text style={styles.winnerButtonText}>Cuadro A</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => setWinner('teamB')}
                            style={[styles.winnerButton, winner === 'teamB' && styles.winnerButtonActiveAlt]}
                        >
                            <Text style={styles.winnerButtonText}>Cuadro B</Text>
                        </Pressable>
                    </View>
                </View>

                <ActionButton title="Guardar partido" onPress={onSaveMatch} />

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Tabla del día</Text>
                    {scoreRows.map((row) => (
                        <View key={row.playerId} style={styles.scoreRow}>
                            <Text style={styles.scoreName}>{row.name}</Text>
                            <Text style={styles.scoreValue}>{row.points} pts</Text>
                        </View>
                    ))}
                </View>

                <Link href="/" asChild>
                    <ActionButton title="Volver al inicio" variant="secondary" />
                </Link>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F4F7FB',
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
    section: {
        backgroundColor: '#fff',
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
    scoreRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#EAEFF7',
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
