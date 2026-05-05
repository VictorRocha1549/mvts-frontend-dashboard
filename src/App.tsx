import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// --- CONFIGURACIÓN DE ICONOS DE LEAFLET EN REACT ---
// Esto repara un bug visual común donde el marcador no aparece
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});
// ---------------------------------------------------

// 1. Definimos la estructura exacta que acordamos en el Contrato de Datos
interface Vehiculo {
  vehicle_id: string;
  latitude: number;
  longitude: number;
  status: string;
  timestamp: string;
}

export default function App() {
  // 2. Estado de la aplicación: Guarda la lista de camiones
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);

  // 3. Simulación de carga de datos (Mock Data)
  useEffect(() => {
    // Cuando Víctor tenga la API lista, aquí pondremos: axios.get('http://localhost:8080/api/vehiculos/activos')
    // Por ahora, usamos datos falsos para que puedas diseñar la vista
    const datosFalsosCamiones: Vehiculo[] = [
      {
        vehicle_id: "CAMION_001",
        latitude: 27.915034, 
        longitude: -110.900012, // Coordenadas en Guaymas/Sonora
        status: "en_ruta",
        timestamp: new Date().toISOString()
      }
    ];
    
    // Guardamos los datos en la memoria de React
    setVehiculos(datosFalsosCamiones);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* BARRA DE NAVEGACIÓN SUPERIOR */}
      <header style={{ backgroundColor: '#2c3e50', color: 'white', padding: '1rem', textAlign: 'center' }}>
        <h1 style={{ margin: 0 }}>MVTS - Dashboard Gerencial (Minera)</h1>
      </header>

      {/* CONTENEDOR PRINCIPAL: Mapa + Barra Lateral */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* ZONA DEL MAPA */}
        <main style={{ flex: 3, position: 'relative' }}>
          <MapContainer 
            center={[27.9150, -110.9000]} 
            zoom={13} 
            style={{ height: '100%', width: '100%' }}
          >
            {/* Capa base del mapa (OpenStreetMap es gratis) */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Recorremos la lista de vehículos e imprimimos un marcador por cada uno */}
            {vehiculos.map((vehiculo) => (
              <Marker 
                key={vehiculo.vehicle_id} 
                position={[vehiculo.latitude, vehiculo.longitude]}
              >
                <Popup>
                  <strong>Unidad:</strong> {vehiculo.vehicle_id} <br/>
                  <strong>Estado:</strong> {vehiculo.status} <br/>
                  <strong>Última actualización:</strong> {new Date(vehiculo.timestamp).toLocaleTimeString()}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </main>

        {/* BARRA LATERAL (SIDEBAR) PARA REPORTES O ALERTAS */}
        <aside style={{ flex: 1, backgroundColor: '#f4f6f7', padding: '1rem', borderLeft: '2px solid #ddd' }}>
          <h2>Panel de Alertas</h2>
          <hr />
          <p>Vehículos Activos en Mapa: {vehiculos.length}</p>
          
          <div style={{ padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '5px', marginTop: '1rem' }}>
            <strong>[Simulación] Alerta de Congestión:</strong><br />
            No hay congestiones reportadas por el sistema backend.
          </div>
        </aside>

      </div>
    </div>
  );
}