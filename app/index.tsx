import SensorCard from '@/components/SensorCard';
import { useSensores } from '@/hooks/useSensores';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function Index() {
  const router = useRouter();
  const { sensores, actualizando, actualizarSensores, hayAlertas } = useSensores();
  const [fechaHora, setFechaHora] = useState('');

  useEffect(() => {
    const actualizar = () => {
      const ahora = new Date();
      setFechaHora(ahora.toLocaleString('es-MX', {
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }));
    };
    actualizar();
    const intervalo = setInterval(actualizar, 1000);
    return () => clearInterval(intervalo);
  }, []);

  const calidad = hayAlertas
    ? sensores.some(s => s.estado === 'Peligroso') ? 'Peligroso' : 'Malo'
    : sensores.some(s => s.estado === 'Moderado') ? 'Moderado' : 'Bueno';

  const colorEncabezado = {
    Bueno:     '#28a745',
    Moderado:  '#ffc107',
    Malo:      '#dc3545',
    Peligroso: '#7b0000',
  }[calidad];

  return (
    <View style={styles.contenedor}>
      {/* Encabezado */}
      <View style={[styles.encabezado, { backgroundColor: colorEncabezado }]}>
        <Text style={styles.titulo}>🌿 Monitor de Calidad del Aire</Text>
        <Text style={styles.subtitulo}>Calidad general: {calidad}</Text>
        <Text style={styles.fechaHora}>{fechaHora}</Text>
        {actualizando && (
          <ActivityIndicator color="#fff" style={{ marginTop: 6 }} />
        )}
      </View>

      {/* Botón de alerta */}
      {hayAlertas && (
        <TouchableOpacity
          style={styles.botonAlerta}
          onPress={() => router.push('/modal')}
        >
          <Text style={styles.textoAlerta}>⚠️ Ver alertas activas</Text>
        </TouchableOpacity>
      )}

      {/* Lista de sensores */}
      <ScrollView
        style={styles.lista}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={actualizando}
            onRefresh={actualizarSensores}
            colors={['#28a745']}
          />
        }
      >
        <Text style={styles.seccion}>Sensores activos</Text>
        {sensores.map(sensor => (
          <SensorCard key={sensor.id} sensor={sensor} />
        ))}

        <TouchableOpacity
          style={styles.botonActualizar}
          onPress={actualizarSensores}
          disabled={actualizando}
        >
          <Text style={styles.textoBoton}>
            {actualizando ? 'Actualizando...' : '🔄 Actualizar ahora'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  encabezado: {
    paddingTop: 52,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  titulo: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
  },
  subtitulo: {
    fontSize: 14,
    color: '#ffffffcc',
    marginTop: 4,
  },
  fechaHora: {
    fontSize: 12,
    color: '#ffffffaa',
    marginTop: 2,
  },
  botonAlerta: {
    backgroundColor: '#dc3545',
    margin: 16,
    marginBottom: 0,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  textoAlerta: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  lista: {
    flex: 1,
  },
  seccion: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  botonActualizar: {
    backgroundColor: '#28a745',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  textoBoton: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});