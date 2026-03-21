import { Sensor } from '@/hooks/useSensores';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import EstadoBadge from './ui/EstadoBadge';

interface Props {
  sensor: Sensor;
}

const borderColores = {
  Bueno:     '#28a745',
  Moderado:  '#ffc107',
  Malo:      '#dc3545',
  Peligroso: '#7b0000',
};

export default function SensorCard({ sensor }: Props) {
  const router = useRouter();

  const handlePress = () => {
    // Envío de parámetros entre pantallas
    router.push({
      pathname: '/detalle',
      params: {
        id: sensor.id,
        nombre: sensor.nombre,
        valor: sensor.valor,
        unidad: sensor.unidad,
        estado: sensor.estado,
        icono: sensor.icono,
        descripcion: sensor.descripcion,
        ultimaActualizacion: sensor.ultimaActualizacion,
      },
    });
  };

  return (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: borderColores[sensor.estado] }]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.fila}>
        <Text style={styles.icono}>{sensor.icono}</Text>
        <View style={styles.info}>
          <Text style={styles.nombre}>{sensor.nombre}</Text>
          <Text style={styles.valor}>
            {sensor.valor} <Text style={styles.unidad}>{sensor.unidad}</Text>
          </Text>
        </View>
        <EstadoBadge estado={sensor.estado} />
      </View>
      <Text style={styles.hora}>Actualizado: {sensor.ultimaActualizacion}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  icono: {
    fontSize: 32,
  },
  info: {
    flex: 1,
  },
  nombre: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },
  valor: {
    fontSize: 22,
    fontWeight: '800',
    color: '#333',
    marginTop: 2,
  },
  unidad: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666',
  },
  hora: {
    fontSize: 11,
    color: '#aaa',
    marginTop: 8,
  },
});
