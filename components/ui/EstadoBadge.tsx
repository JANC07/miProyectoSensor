import { EstadoCalidad } from '@/hooks/useSensores';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  estado: EstadoCalidad;
}

const colores: Record<EstadoCalidad, { fondo: string; texto: string }> = {
  Bueno:     { fondo: '#d4edda', texto: '#155724' },
  Moderado:  { fondo: '#fff3cd', texto: '#856404' },
  Malo:      { fondo: '#f8d7da', texto: '#721c24' },
  Peligroso: { fondo: '#f5c6cb', texto: '#491217' },
};

const iconos: Record<EstadoCalidad, string> = {
  Bueno: '✅',
  Moderado: '⚠️',
  Malo: '🔴',
  Peligroso: '☠️',
};

export default function EstadoBadge({ estado }: Props) {
  const { fondo, texto } = colores[estado];
  return (
    <View style={[styles.badge, { backgroundColor: fondo }]}>
      <Text style={[styles.texto, { color: texto }]}>
        {iconos[estado]} {estado}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  texto: {
    fontSize: 12,
    fontWeight: '700',
  },
});
