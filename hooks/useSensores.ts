import { useEffect, useState } from 'react';

export type EstadoCalidad = 'Bueno' | 'Moderado' | 'Malo' | 'Peligroso';

export interface Sensor {
  id: string;
  nombre: string;
  valor: number;
  unidad: string;
  estado: EstadoCalidad;
  icono: string;
  descripcion: string;
  ultimaActualizacion: string;
}

function calcularEstado(nombre: string, valor: number): EstadoCalidad {
  if (nombre === 'CO2') {
    if (valor < 800) return 'Bueno';
    if (valor < 1200) return 'Moderado';
    if (valor < 1600) return 'Malo';
    return 'Peligroso';
  }
  if (nombre === 'PM2.5') {
    if (valor < 12) return 'Bueno';
    if (valor < 35) return 'Moderado';
    if (valor < 55) return 'Malo';
    return 'Peligroso';
  }
  if (nombre === 'Temperatura') {
    if (valor >= 18 && valor <= 26) return 'Bueno';
    if (valor >= 15 && valor <= 30) return 'Moderado';
    if (valor >= 10 && valor <= 35) return 'Malo';
    return 'Peligroso';
  }
  if (nombre === 'Humedad') {
    if (valor >= 40 && valor <= 60) return 'Bueno';
    if (valor >= 30 && valor <= 70) return 'Moderado';
    if (valor >= 20 && valor <= 80) return 'Malo';
    return 'Peligroso';
  }
  return 'Bueno';
}

const sensoresIniciales: Sensor[] = [
  {
    id: '1',
    nombre: 'CO2',
    valor: 420,
    unidad: 'ppm',
    estado: 'Bueno',
    icono: '💨',
    descripcion: 'Dióxido de carbono en el ambiente. Niveles altos pueden causar fatiga y problemas respiratorios.',
    ultimaActualizacion: new Date().toLocaleTimeString(),
  },
  {
    id: '2',
    nombre: 'PM2.5',
    valor: 10,
    unidad: 'µg/m³',
    estado: 'Bueno',
    icono: '🌫️',
    descripcion: 'Partículas finas en suspensión. Pueden penetrar en los pulmones y afectar la salud.',
    ultimaActualizacion: new Date().toLocaleTimeString(),
  },
  {
    id: '3',
    nombre: 'Temperatura',
    valor: 23,
    unidad: '°C',
    estado: 'Bueno',
    icono: '🌡️',
    descripcion: 'Temperatura del ambiente. Afecta el confort y la calidad del aire interior.',
    ultimaActualizacion: new Date().toLocaleTimeString(),
  },
  {
    id: '4',
    nombre: 'Humedad',
    valor: 55,
    unidad: '%',
    estado: 'Bueno',
    icono: '💧',
    descripcion: 'Humedad relativa del aire. Valores extremos pueden favorecer hongos o resecar las vías respiratorias.',
    ultimaActualizacion: new Date().toLocaleTimeString(),
  },
];

export function useSensores() {
  const [sensores, setSensores] = useState<Sensor[]>(sensoresIniciales);
  const [actualizando, setActualizando] = useState(false);

  const actualizarSensores = () => {
    setActualizando(true);
    setTimeout(() => {
      setSensores(prev =>
        prev.map(sensor => {
          let nuevoValor = sensor.valor;
          if (sensor.nombre === 'CO2') {
            nuevoValor = Math.max(350, Math.min(2000, sensor.valor + (Math.random() * 100 - 50)));
          } else if (sensor.nombre === 'PM2.5') {
            nuevoValor = Math.max(0, Math.min(100, sensor.valor + (Math.random() * 6 - 3)));
          } else if (sensor.nombre === 'Temperatura') {
            nuevoValor = Math.max(0, Math.min(50, sensor.valor + (Math.random() * 2 - 1)));
          } else if (sensor.nombre === 'Humedad') {
            nuevoValor = Math.max(0, Math.min(100, sensor.valor + (Math.random() * 4 - 2)));
          }
          nuevoValor = Math.round(nuevoValor * 10) / 10;
          return {
            ...sensor,
            valor: nuevoValor,
            estado: calcularEstado(sensor.nombre, nuevoValor),
            ultimaActualizacion: new Date().toLocaleTimeString(),
          };
        })
      );
      setActualizando(false);
    }, 800);
  };

  useEffect(() => {
    const intervalo = setInterval(() => {
      actualizarSensores();
    }, 5000);
    return () => clearInterval(intervalo);
  }, []);

  const hayAlertas = sensores.some(s => s.estado === 'Malo' || s.estado === 'Peligroso');

  return { sensores, actualizando, actualizarSensores, hayAlertas };
}