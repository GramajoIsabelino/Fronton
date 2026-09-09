import React, { useCallback, useEffect, useState } from 'react';
import { Link, useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';

import { ActionButton } from '../components/ActionButton';
import { crearJornada, getJugadores, getTemporadas, type ApiPlayer, type ApiSeason } from '../api/client';
import { styles } from './styles/HomeScreen.style';

type LoadState = 'idle' | 'loading' | 'ready' | 'error';

function getName(item: ApiPlayer | ApiSeason): string {
  return item.nombre ?? item.name ?? 'Sin nombre';
}

export default function CreateSessionScreen() {
  const [players, setPlayers] = useState<ApiPlayer[]>([]);
  const [seasons, setSeasons] = useState<ApiSeason[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<Set<string>>(new Set());
  const [selectedSeasonId, setSelectedSeasonId] = useState<string | null>(null);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [loadState, setLoadState] = useState<LoadState>('idle');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const loadData = useCallback(async () => {
    setLoadState('loading');
    setError(null);

    try {
      const [playersData, seasonsData] = await Promise.all([getJugadores(), getTemporadas()]);
      setPlayers(playersData);
      setSeasons(seasonsData);
      setLoadState('ready');
    } catch (loadError) {
      console.warn('Error cargando datos para crear jornada:', loadError);
      setLoadState('error');
      setError('No se pudieron cargar jugadores y temporadas.');
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const onChangeDate = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const togglePlayer = (playerId: number | string) => {
    const id = String(playerId);
    setSelectedPlayers((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const createSession = async () => {
    setError(null);

    if (!selectedSeasonId) {
      setError('Seleccioná una temporada.');
      return;
    }

    if (selectedPlayers.size === 0) {
      setError('Seleccioná al menos un jugador.');
      return;
    }

    setSaving(true);
    try {
      await crearJornada(Number(selectedSeasonId));
      router.replace('/');
    } catch (saveError) {
      console.warn('Error creando jornada:', saveError);
      setError('No se pudo crear la jornada. Revisá la conexión e intentá nuevamente.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Crear jornada</Text>
        <Text style={styles.description}>
          Elegí la fecha, la temporada y los jugadores que van a participar.
        </Text>

        <Pressable onPress={() => setShowPicker(true)} style={styles.dateButton}>
          <Text style={styles.dateLabel}>Fecha de la jornada</Text>
          <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
        </Pressable>

        {showPicker ? (
          <DateTimePicker value={date} mode="date" display="default" onChange={onChangeDate} />
        ) : null}

        {loadState === 'loading' ? (
          <View style={styles.loading}>
            <ActivityIndicator color="#1F6FEB" />
            <Text style={styles.helperText}>Cargando datos...</Text>
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.header}>Temporada</Text>
          {loadState === 'ready' && seasons.length > 0 ? (
            <View style={styles.list}>
              {seasons.map((season, index) => {
                const selected = selectedSeasonId === String(season.id);
                return (
                  <Pressable
                    key={String(season.id)}
                    onPress={() => setSelectedSeasonId(String(season.id))}
                    style={[styles.item, selected && styles.itemSelected, index === seasons.length - 1 && styles.lastItem]}
                  >
                    <View style={styles.radio}>{selected ? <View style={styles.radioInner} /> : null}</View>
                    <Text style={[styles.itemText, selected && styles.itemTextSelected]}>
                      {getName(season)}{season.year ? ` ${season.year}` : ''}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ) : loadState === 'ready' ? (
            <Text style={styles.helperText}>No hay temporadas disponibles.</Text>
          ) : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.header}>Jugadores</Text>
          <Text style={styles.selectionCount}>
            {selectedPlayers.size} {selectedPlayers.size === 1 ? 'jugador seleccionado' : 'jugadores seleccionados'}
          </Text>
          {loadState === 'ready' && players.length > 0 ? (
            <View style={styles.list}>
              {players.map((player, index) => {
                const selected = selectedPlayers.has(String(player.id));
                return (
                  <Pressable
                    key={String(player.id)}
                    onPress={() => togglePlayer(player.id)}
                    style={[styles.item, selected && styles.itemSelected, index === players.length - 1 && styles.lastItem]}
                  >
                    <View style={styles.checkbox}>{selected ? <Text style={styles.checkmark}>✓</Text> : null}</View>
                    <Text style={[styles.itemText, selected && styles.itemTextSelected]}>{getName(player)}</Text>
                  </Pressable>
                );
              })}
            </View>
          ) : loadState === 'ready' ? (
            <Text style={styles.helperText}>No hay jugadores disponibles.</Text>
          ) : null}
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}
        {loadState === 'error' ? (
          <Pressable onPress={() => void loadData()}>
            <Text style={styles.retry}>Reintentar carga</Text>
          </Pressable>
        ) : null}

        <View style={styles.actions}>
          <ActionButton
            title={saving ? 'Creando...' : 'Crear jornada'}
            subtitle="Guardar sesión"
            onPress={() => void createSession()}
            disabled={saving || loadState !== 'ready'}
          />
          <Link href="/" asChild>
            <ActionButton title="Volver al inicio" variant="secondary" />
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
