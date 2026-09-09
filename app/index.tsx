import React, { useEffect, useState } from 'react';
import { Link } from 'expo-router';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';

import { ActionButton } from '../components/ActionButton';
import { activeSession as _active } from '../data/mockData';
import { getSessions } from '../storage';
import type { Session } from '../types';

export default function HomeScreen() {
    const [sessions, setSessions] = useState<Session[]>([]);

    useEffect(() => {
        (async () => {
            const s = await getSessions();
            setSessions(s);
        })();
    }, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.eyebrow}>Frontón</Text>
                    <Text style={styles.title}>Inicio</Text>
                </View>

                <View style={styles.actions}>
                    <Link href="/create-session" asChild>
                        <ActionButton title="Crear jornada" subtitle="Nueva fecha y jugadores" />
                    </Link>

                    <Link href="/statistics" asChild>
                        <ActionButton
                            title="Estadísticas"
                            subtitle="Historial y temporada"
                            variant="secondary"
                        />
                    </Link>

                    {_active ? (
                        <Link href="/session" asChild>
                            <ActionButton
                                title="Jornada en juego"
                                subtitle={`Hoy · ${_active.date}`}
                                variant="primary"
                            />
                        </Link>
                    ) : null}

                    {/* Saved sessions list */}
                    <View style={{ marginTop: 24 }}>
                        <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 12 }}>Jornadas guardadas</Text>
                        {sessions.length === 0 ? (
                            <Text style={{ color: '#7284A0' }}>No hay jornadas aún.</Text>
                        ) : (
                            sessions.map((s) => (
                                <Link key={s.id} href={`/session-detail/${s.id}`} asChild>
                                    <Pressable style={{ paddingVertical: 12 }}>
                                        <Text style={{ fontWeight: '700' }}>{s.date}</Text>
                                        <Text style={{ color: '#7284A0' }}>{s.players.length} jugadores</Text>
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
        backgroundColor: '#F4F7FB',
    },
    container: {
        flexGrow: 1,
        padding: 24,
        justifyContent: 'center',
    },
    header: {
        marginBottom: 24,
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
        fontSize: 36,
        fontWeight: '800',
    },
    actions: {
        gap: 16,
    },
});



// import { StatusBar } from 'expo-status-bar';
// import { useState } from 'react';
// import { Button, StyleSheet, Text, View } from 'react-native';
// import { getJugadores } from '../api/client';

// export default function App() {
//     const [jugadores, setJugadores] = useState<any[]>([]);
//     const [error, setError] = useState('');

//     async function cargarJugadores() {
//         try {
//             setError('');

//             const data = await getJugadores();

//             setJugadores(data);
//         } catch (error) {
//             setError('No se pudieron cargar los jugadores');
//             console.error(error);
//         }
//     }

//     return (
//         <View style={styles.container}>
//             <Text>Frontón</Text>

//             <Button
//                 title="Cargar jugadores"
//                 onPress={cargarJugadores}
//             />

//             {error !== '' && <Text>{error}</Text>}

//             {jugadores.map((jugador) => (
//                 <Text key={jugador.id}>
//                     {jugador.nombre}
//                 </Text>
//             ))}

//             <StatusBar style="auto" />
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fff',
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
// });