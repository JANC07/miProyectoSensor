import EstadoBadge from '@/components/ui/EstadoBadge';
import { EstadoCalidad } from '@/hooks/useSensores';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function DetalleScreen() {
  // Recepción de parámetros entre pantallas
  const params = useLocalSearchParams();
  const router = useRouter();

  const nombre = params.nombre as string;
  const valor = parseFloat(params.valor as string);
  const unidad = params.unidad as string;
  const estado = params.estado as EstadoCalidad;
  const icono = params.icono as string;
  const descripcion = params.descripcion as string;
  const ultimaActualizacion = params.ultimaActualizacion as string;

  const [historial, setHistorial] = useState<{ tiempo: string; valor: number }[]>([]);
  const [consejo, setConsejo] = useState('');

  // useEffect para generar historial simulado al cargar
  useEffect(() => {
    const entradas = Array.from({ length: 6 }, (_, i) => {
      const variacion = (Math.random() * 20 - 10);
      const valorHistorial = Math.round((valor + variacion) * 10) / 10;
      const ahora = new Date();
      ahora.setMinutes(ahora.getMinutes() - (5 - i) * 5);
      return {
        tiempo: ahora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        valor: valorHistorial,
      };
    });
    setHistorial(entradas);
  }, []);

  // useEffect para cambiar consejo según el estado
  useEffect(() => {
    const consejos: Record<EstadoCalidad, string> = {
      Bueno: '✅ El nivel es óptimo. No se requiere ninguna acción.',
      Moderado: '⚠️ Nivel aceptable, pero considera ventilar el área periódicamente.',
      Malo: '🔴 Nivel elevado. Ventila el área inmediatamente y reduce actividades físicas.',
      Peligroso: '☠️ Nivel crítico. Evacúa el área y contacta a las autoridades de seguridad.',
    };
    setConsejo(consejos[estado]);
  }, [estado]);

  const colorEstado = {
    Bueno:     '#28a745',
    Moderado:  '#ffc107',
    Malo:      '#dc3545',
    Peligroso: '#7b0000',
  }[estado];

  return (
    <ScrollView style={styles.contenedor}>
      {/* Encabezado */}
      <View style={[styles.encabezado, { backgroundColor: colorEstado }]}>
        <Text style={styles.icono}>{icono}</Text>
        <Text style={styles.nombre}>{nombre}</Text>
        <Text style={styles.valor}>
          {valor} {unidad}
        </Text>
        <EstadoBadge estado={estado} />
      </View>

      {/* Descripción */}
      <View style={styles.tarjeta}>
        <Text style={styles.etiqueta}>¿Qué mide este sensor?</Text>
        <Text style={styles.texto}>{descripcion}</Text>
      </View>

      {/* Consejo */}
      <View style={[styles.tarjeta, styles.tarjetaConsejo]}>
        <Text style={styles.etiqueta}>Recomendación</Text>
        <Text style={styles.texto}>{consejo}</Text>
      </View>

      {/* Historial */}
      <View style={styles.tarjeta}>
        <Text style={styles.etiqueta}>Historial de lecturas</Text>
        {historial.map((entrada, i) => (
          <View key={i} style={styles.filaHistorial}>
            <Text style={styles.textoHistorial}>{entrada.tiempo}</Text>
            <Text style={styles.valorHistorial}>
              {entrada.valor} {unidad}
            </Text>
          </View>
        ))}
      </View>

      <Text style={styles.hora}>Última actualización: {ultimaActualizacion}</Text>

      <TouchableOpacity style={styles.botonVolver} onPress={() => router.back()}>
        <Text style={styles.textoBoton}>← Volver al dashboard</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  encabezado: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    gap: 8,
  },
  icono: {
    fontSize: 52,
  },
  nombre: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
  },
  valor: {
    fontSize: 36,
    fontWeight: '900',
    color: '#fff',
  },
  tarjeta: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginBottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  tarjetaConsejo: {
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  etiqueta: {
    fontSize: 12,
    fontWeight: '700',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  texto: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  filaHistorial: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  textoHistorial: {
    fontSize: 14,
    color: '#555',
  },
  valorHistorial: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  hora: {
    textAlign: 'center',
    color: '#aaa',
    fontSize: 12,
    marginTop: 16,
  },
  botonVolver: {
    backgroundColor: '#007bff',
    margin: 16,
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  textoBoton: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});
