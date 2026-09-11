import React, { useEffect, useState } from 'react';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, SafeAreaView, ScrollView, Text, View } from 'react-native';

import { ActionButton } from '../../components/ActionButton';
import { eliminarJornada, obtenerJornada } from '../../api/client';
import { createScreenStyles } from '../styles/HomeScreen.style';
import { useTheme } from '../../theme';
import type { Session } from '../../types';

export default function SessionDetail() {
  const params = useLocalSearchParams();
  const id = String(params.id ?? '');

  console.log('PARAMS:', params);
  console.log('JORNADA ID:', id);
  console.log('JORNADA ID NUMBER:', Number(id));

  const router = useRouter();
  const { colors } = useTheme();
  const styles = createScreenStyles(colors);

  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const jornada = await obtenerJornada(Number(id));

        if (!mounted) return;

        setSession({
          id: String(jornada.id),
          date: jornada.fecha,
          seasonId: String(jornada.temporada_id),
          groupId: '',
          players: (jornada.jugadores ?? []).map((player: any) =>
            String(player)
          ),
          status:
            jornada.estado === 'finalizada'
              ? 'finalizada'
              : 'en juego',
          createdAt: '',
          matches: (jornada.partidos ?? []).map((partido: any) => ({
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
          })),
        });
      } catch (error) {
        console.error('Error cargando jornada:', error);
        Alert.alert('Error', 'No se pudo cargar la jornada.');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id]);

  const onDelete = () => {
    if (!session) return;

    Alert.alert(
      'Eliminar jornada',
      '¿Estás seguro de que querés eliminar esta jornada?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await eliminarJornada(Number(session.id));

              Alert.alert(
                'Jornada eliminada',
                'La jornada se eliminó correctamente.'
              );

              router.replace('/');
            } catch (error) {
              console.error('Error eliminando jornada:', error);
              Alert.alert(
                'Error',
                'No se pudo eliminar la jornada.'
              );
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: 'transparent' }]}>
        <Text style={styles.placeholder}>Cargando...</Text>
      </SafeAreaView>
    );
  }

  if (!session) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: 'transparent' }]}>
        <Text style={styles.placeholder}>
          Jornada no encontrada
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: 'transparent' }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Jornada · {session.date}</Text>

        <View style={{ marginVertical: 12 }}>
          <Text style={styles.header}>Jugadores</Text>

          {session.players.map((playerId, index) => (
            <Text
              key={`${session.id}-${index}`}
              style={{
                marginTop: 8,
                padding: 10,
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 8,
                backgroundColor: '#fff',
              }}
            >
              Jugador #{playerId}
            </Text>
          ))}
        </View>

        <View style={{ marginTop: 20 }}>
          <ActionButton
            title="Eliminar jornada"
            onPress={onDelete}
            variant="secondary"
          />
        </View>

        <View style={{ marginTop: 24 }}>
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