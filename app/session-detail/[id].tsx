import React, { useEffect, useState } from 'react';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, SafeAreaView, ScrollView, Text, TextInput, View } from 'react-native';

import { ActionButton } from '../../components/ActionButton';
import { deleteSession, getSession, saveSession } from '../../storage';
import { styles } from '../styles/HomeScreen.style';
import type { Session } from '../../types';

export default function SessionDetail() {
  const params = useLocalSearchParams();
  const id = String(params.id ?? '');
  const router = useRouter();

  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const found = await getSession(id);
      if (mounted) {
        setSession(found);
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.placeholder}>Cargando...</Text>
      </SafeAreaView>
    );
  }

  if (!session) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.placeholder}>Sesión no encontrada</Text>
      </SafeAreaView>
    );
  }

  const updatePlayers = (index: number, value: string) => {
    const players = [...session.players];
    players[index] = value;
    setSession({ ...session, players });
  };

  const onSave = async () => {
    await saveSession(session);
    router.push('/');
  };

  const onDelete = () => {
    Alert.alert('Eliminar jornada', '¿Estás seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          await deleteSession(session.id);
          router.push('/');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Jornada · {session.date}</Text>

        <View style={{ marginVertical: 12 }}>
          <Text style={styles.header}>Jugadores</Text>
          {session.players.map((player, index) => (
            <TextInput
              key={`${session.id}-${index}`}
              value={player}
              onChangeText={(text) => updatePlayers(index, text)}
              style={{
                borderWidth: 1,
                borderColor: '#ddd',
                padding: 10,
                borderRadius: 8,
                marginTop: 8,
                backgroundColor: '#fff',
              }}
            />
          ))}
        </View>

        <View style={{ marginTop: 20 }}>
          <ActionButton title="Guardar cambios" onPress={onSave} />
        </View>

        <View style={{ marginTop: 12 }}>
          <ActionButton title="Eliminar jornada" onPress={onDelete} variant="secondary" />
        </View>

        <View style={{ marginTop: 24 }}>
          <Link href="/" asChild>
            <ActionButton title="Volver al inicio" variant="secondary" />
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
