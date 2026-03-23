import SensorCard from '@/components/SensorCard';
import { useSensores } from '@/hooks/useSensores';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function Index() {
  const router = useRouter();
  const { sensores, actualizando, actualizarSensores, hayAlertas } = useSensores();
  const [fechaHora, setFechaHora] = useState('');
  const [mostrarSplash, setMostrarSplash] = useState(true);
  const [progreso, setProgreso] = useState(0);

  const opacidadLogo = useRef(new Animated.Value(0)).current;
  const escalaLogo = useRef(new Animated.Value(0.5)).current;
  const opacidadTexto = useRef(new Animated.Value(0)).current;
  const opacidadEslogan = useRef(new Animated.Value(0)).current;
  const opacidadApp = useRef(new Animated.Value(0)).current;

  // Splash animación
  useEffect(() => {
    if (!mostrarSplash) return;

    Animated.parallel([
      Animated.timing(opacidadLogo, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(escalaLogo, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
    ]).start(() => {
      Animated.timing(opacidadTexto, { toValue: 1, duration: 600, useNativeDriver: true })
        .start(() => {
          Animated.timing(opacidadEslogan, { toValue: 1, duration: 600, useNativeDriver: true }).start();
        });
    });

    const intervalo = setInterval(() => {
      setProgreso(prev => {
        if (prev >= 100) { clearInterval(intervalo); return 100; }
        return prev + 2;
      });
    }, 120);

    const timer = setTimeout(() => {
      Animated.timing(opacidadApp, { toValue: 1, duration: 500, useNativeDriver: true }).start();
      setMostrarSplash(false);
    }, 6000);

    return () => { clearInterval(intervalo); clearTimeout(timer); };
  }, [mostrarSplash]);

  // Reloj
  useEffect(() => {
    const actualizar = () => {
      const ahora = new Date();
      setFechaHora(ahora.toLocaleString('es-MX', {
        weekday: 'long', hour: '2-digit', minute: '2-digit', second: '2-digit',
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
    Bueno: '#28a745', Moderado: '#ffc107', Malo: '#dc3545', Peligroso: '#7b0000',
  }[calidad];

  // --- NUEVA MEJORA: Mensajes y Emojis según Calidad ---
  const infoEstado = {
    Bueno: { msg: "¡Aire limpio! Disfruta el día.", icono: "😊" },
    Moderado: { msg: "Aire aceptable, ten precaución.", icono: "😐" },
    Malo: { msg: "Evita actividades al aire libre.", icono: "😷" },
    Peligroso: { msg: "¡Alerta! Aire altamente nocivo.", icono: "🚨" },
  }[calidad];
  // -----------------------------------------------------

  // SPLASH
  if (mostrarSplash) {
    return (
      <LinearGradient colors={['#0a1628', '#0d2b4e', '#1a4a7a']} style={styles.splash}>
        <View style={[styles.circulo, styles.circulo1]} />
        <View style={[styles.circulo, styles.circulo2]} />

        <Animated.View style={[styles.logoContenedor, { opacity: opacidadLogo, transform: [{ scale: escalaLogo }] }]}>
          <LinearGradient colors={['#00d4ff', '#0099cc']} style={styles.logoFondo}>
            <Text style={styles.logoIcono}>🌬️</Text>
          </LinearGradient>
          <View style={[styles.anillo, styles.anillo1]} />
          <View style={[styles.anillo, styles.anillo2]} />
        </Animated.View>

        <Animated.Text style={[styles.nombre, { opacity: opacidadTexto }]}>
          Air<Text style={styles.nombreDestacado}>Watch</Text>
        </Animated.Text>

        <Animated.Text style={[styles.eslogan, { opacity: opacidadEslogan }]}>
          Calidad del aire en tiempo real
        </Animated.Text>

        <Animated.View style={[styles.lineaContenedor, { opacity: opacidadEslogan }]}>
          <View style={styles.lineaIzq} />
          <Text style={styles.lineaPunto}>✦</Text>
          <View style={styles.lineaDer} />
        </Animated.View>

        <Animated.View style={[styles.sensoresContenedor, { opacity: opacidadEslogan }]}>
          {['CO₂', 'PM2.5', 'Temp', 'Humedad'].map((s, i) => (
            <View key={i} style={styles.sensorChip}>
              <Text style={styles.sensorChipTexto}>{s}</Text>
            </View>
          ))}
        </Animated.View>

        <View style={styles.barraContenedor}>
          <View style={styles.barraFondo}>
            <LinearGradient
              colors={['#00d4ff', '#0099cc']}
              style={[styles.barraProgreso, { width: `${progreso}%` }]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            />
          </View>
          <Text style={styles.barraTexto}>Iniciando sensores... {progreso}%</Text>
        </View>

        <Text style={styles.footer}>Instituto Tecnológico Superior de Valladolid</Text>
      </LinearGradient>
    );
  }

  // DASHBOARD
  return (
    <View style={styles.contenedor}>
      <View style={[styles.encabezado, { backgroundColor: colorEncabezado }]}>
        <Text style={styles.titulo}>🌿 AirWatch</Text>
        {/* LÍNEA MODIFICADA PARA MOSTRAR EL NUEVO MENSAJE */}
        <Text style={styles.subtitulo}>{infoEstado.icono} {infoEstado.msg}</Text>
        <Text style={styles.fechaHora}>{fechaHora}</Text>
        {actualizando && <ActivityIndicator color="#fff" style={{ marginTop: 6 }} />}
      </View>

      {hayAlertas && (
        <TouchableOpacity style={styles.botonAlerta} onPress={() => router.push('/modal')}>
          <Text style={styles.textoAlerta}>⚠️ Ver alertas activas</Text>
        </TouchableOpacity>
      )}

      <ScrollView
        style={styles.lista}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={<RefreshControl refreshing={actualizando} onRefresh={actualizarSensores} colors={['#28a745']} />}
      >
        <Text style={styles.seccion}>Sensores activos</Text>
        {sensores.map(sensor => (
          <SensorCard key={sensor.id} sensor={sensor} />
        ))}
        <TouchableOpacity style={styles.botonActualizar} onPress={actualizarSensores} disabled={actualizando}>
          <Text style={styles.textoBoton}>{actualizando ? 'Actualizando...' : '🔄 Actualizar ahora'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // SPLASH
  splash: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  circulo: { position: 'absolute', borderRadius: 999, borderWidth: 1, borderColor: 'rgba(0,212,255,0.1)' },
  circulo1: { width: 300, height: 300, top: -80, right: -80, backgroundColor: 'rgba(0,212,255,0.05)' },
  circulo2: { width: 200, height: 200, bottom: 100, left: -60, backgroundColor: 'rgba(0,153,204,0.05)' },
  logoContenedor: { alignItems: 'center', justifyContent: 'center', marginBottom: 32 },
  logoFondo: { width: 110, height: 110, borderRadius: 30, alignItems: 'center', justifyContent: 'center', elevation: 20 },
  logoIcono: { fontSize: 58 },
  anillo: { position: 'absolute', borderRadius: 999, borderWidth: 1, borderColor: 'rgba(0,212,255,0.3)' },
  anillo1: { width: 150, height: 150 },
  anillo2: { width: 190, height: 190, borderColor: 'rgba(0,212,255,0.15)' },
  nombre: { fontSize: 48, fontWeight: '900', color: '#ffffff', letterSpacing: 2 },
  nombreDestacado: { color: '#00d4ff' },
  eslogan: { fontSize: 15, color: 'rgba(255,255,255,0.7)', letterSpacing: 1, marginTop: 8 },
  lineaContenedor: { flexDirection: 'row', alignItems: 'center', marginTop: 20, gap: 10 },
  lineaIzq: { width: 60, height: 1, backgroundColor: 'rgba(0,212,255,0.4)' },
  lineaPunto: { color: '#00d4ff', fontSize: 12 },
  lineaDer: { width: 60, height: 1, backgroundColor: 'rgba(0,212,255,0.4)' },
  sensoresContenedor: { flexDirection: 'row', gap: 8, marginTop: 24 },
  sensorChip: { borderWidth: 1, borderColor: 'rgba(0,212,255,0.4)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, backgroundColor: 'rgba(0,212,255,0.1)' },
  sensorChipTexto: { color: '#00d4ff', fontSize: 12, fontWeight: '600' },
  barraContenedor: { position: 'absolute', bottom: 80, width: width * 0.7, alignItems: 'center', gap: 8 },
  barraFondo: { width: '100%', height: 4, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' },
  barraProgreso: { height: '100%', borderRadius: 4 },
  barraTexto: { color: 'rgba(255,255,255,0.4)', fontSize: 11 },
  footer: { position: 'absolute', bottom: 30, color: 'rgba(255,255,255,0.3)', fontSize: 11 },

  // DASHBOARD
  contenedor: { flex: 1, backgroundColor: '#f0f4f8' },
  encabezado: { paddingTop: 52, paddingBottom: 20, paddingHorizontal: 20 },
  titulo: { fontSize: 20, fontWeight: '800', color: '#fff' },
  subtitulo: { fontSize: 14, color: '#ffffffcc', marginTop: 4, fontWeight: '600' },
  fechaHora: { fontSize: 12, color: '#ffffffaa', marginTop: 2 },
  botonAlerta: { backgroundColor: '#dc3545', margin: 16, marginBottom: 0, borderRadius: 10, padding: 12, alignItems: 'center' },
  textoAlerta: { color: '#fff', fontWeight: '700', fontSize: 14 },
  lista: { flex: 1 },
  seccion: { fontSize: 13, fontWeight: '600', color: '#666', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.8 },
  botonActualizar: { backgroundColor: '#28a745', borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 8 },
  textoBoton: { color: '#fff', fontWeight: '700', fontSize: 15 },
});