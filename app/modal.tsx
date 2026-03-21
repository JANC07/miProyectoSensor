import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const recomendaciones = [
  { icono: '💨', titulo: 'CO2 elevado', desc: 'Abre ventanas y puertas para ventilar el espacio.' },
  { icono: '🌫️', titulo: 'PM2.5 alto', desc: 'Evita actividades físicas intensas en interiores. Usa purificador de aire.' },
  { icono: '🌡️', titulo: 'Temperatura fuera de rango', desc: 'Regula la climatización o ventilación del área.' },
  { icono: '💧', titulo: 'Humedad crítica', desc: 'Usa deshumidificador o humidificador según corresponda.' },
];

export default function ModalScreen() {
  const router = useRouter();

  return (
    <View style={styles.contenedor}>
      <View style={styles.encabezado}>
        <Text style={styles.titulo}>⚠️ Alertas del Sistema</Text>
        <Text style={styles.subtitulo}>Se detectaron niveles fuera del rango óptimo</Text>
      </View>

      <ScrollView style={styles.lista}>
        {recomendaciones.map((rec, i) => (
          <View key={i} style={styles.tarjeta}>
            <Text style={styles.icono}>{rec.icono}</Text>
            <View style={styles.info}>
              <Text style={styles.tituloTarjeta}>{rec.titulo}</Text>
              <Text style={styles.descripcion}>{rec.desc}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.boton} onPress={() => router.back()}>
        <Text style={styles.textoBoton}>Entendido, cerrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#fff8f8',
  },
  encabezado: {
    backgroundColor: '#dc3545',
    padding: 24,
    paddingTop: 36,
    alignItems: 'center',
  },
  titulo: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
  },
  subtitulo: {
    fontSize: 13,
    color: '#ffcccc',
    marginTop: 4,
  },
  lista: {
    flex: 1,
    padding: 16,
  },
  tarjeta: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'flex-start',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  icono: {
    fontSize: 28,
  },
  info: {
    flex: 1,
  },
  tituloTarjeta: {
    fontSize: 15,
    fontWeight: '700',
    color: '#222',
  },
  descripcion: {
    fontSize: 13,
    color: '#555',
    marginTop: 4,
    lineHeight: 20,
  },
  boton: {
    backgroundColor: '#dc3545',
    margin: 16,
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  textoBoton: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});
