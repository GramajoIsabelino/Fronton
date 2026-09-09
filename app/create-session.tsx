import React, { useState, useEffect } from 'react';
import { Link, useRouter } from 'expo-router';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  SectionList,
  Text,
  View,
  TextInput,
  StyleProp,
  ViewStyle,
} from 'react-native';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';

import { ActionButton } from '../components/ActionButton';
// import { seasonSections } from '../data/temporadas';
import { styles } from './styles/HomeScreen.style';
import { saveSession } from '../storage';
import { crearJornada } from '../api/client';
import { getTemporadas } from '../api/client';
// import { SectionListComponent } from 'react-native';



type Participant = { id: string; name: string };

export default function CreateSessionScreen() {
  // create a few empty participant slots by default
  const [participants, setParticipants] = useState<Participant[]>(
    Array.from({ length: 6 }, (_, i) => ({ id: String(i), name: '' }))
  );

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [date, setDate] = useState<Date>(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [temporadas, setTemporadas] = useState<any[]>([]);


  useEffect(() => {
    async function cargarTemporadas() {
      try {
        const data = await getTemporadas();
        setTemporadas(data);
      } catch (e) {
        console.warn('Error cargando temporadas:', e);
        setError('No se pudieron cargar las temporadas.');
      }
    }

    cargarTemporadas();
  }, []);

  const onChangeDate = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const updateParticipant = (id: string, value: string) => {
    setParticipants((prev) => prev.map((p) => (p.id === id ? { ...p, name: value } : p)));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Crear jornada</Text>
        <Text style={styles.description}>
          Aquí se seleccionará la fecha, la temporada, el grupo y los jugadores.
        </Text>

        <Pressable onPress={() => setShowPicker(true)} style={{ marginVertical: 12 }}>
          <Text style={{ color: '#222' }}>{date.toLocaleDateString()}</Text>
        </Pressable>

        {showPicker && (
          <DateTimePicker value={date} mode="date" display="default" onChange={onChangeDate} />
        )}

        <View style={{ width: '100%', marginVertical: 16 }}>
          <Text style={styles.header}>Ingrese los participantes</Text>
          {participants.map((p) => (
            <TextInput
              key={p.id}
              value={p.name}
              onChangeText={(text) => updateParticipant(p.id, text)}
              placeholder={`Jugador ${Number(p.id) + 1}`}
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

        <View style={{ width: '100%', marginVertical: 16 }}>
          <Text style={styles.header}>Temporada</Text>

          <View>
            {temporadas.map((temporada) => {
              const selected = selectedId === String(temporada.id);

              return (
                <Pressable
                  key={temporada.id}
                  onPress={() => setSelectedId(String(temporada.id))}
                  style={[
                    styles.item,
                    selected && styles.itemSelected,
                  ] as StyleProp<ViewStyle>}
                >
                  <View style={styles.radio}>
                    {selected && <View style={styles.radioInner} />}
                  </View>

                  <Text
                    style={[
                      styles.itemText,
                      selected && styles.itemTextSelected,
                    ]}
                  >
                    {temporada.nombre}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={{ width: '100%', marginTop: 24, gap: 12 }}>
          {error && (
            <Text style={{ color: 'red', marginTop: 12 }}>
              {error}
            </Text>
          )}
          <ActionButton
            title="Crear jornada"
            subtitle="Guardar sesión"
            onPress={async () => {
              setError(null);

              if (!selectedId) {
                setError('Debés seleccionar una temporada.');
                return;
              }

              try {
                const jornada = await crearJornada(Number(selectedId));

                console.log('Jornada creada:', jornada);

                router.push('/');
              } catch (e) {
                console.warn('Error creando jornada:', e);
                setError('No se pudo crear la jornada.');
              }
            }}
          />
          {error && (
            <Text style={{ color: 'red', marginTop: 12 }}>
              {error}
            </Text>
          )}

          <Link href="/" asChild>
            <ActionButton title="Volver al inicio" variant="secondary" />

          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
