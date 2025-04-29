
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from 'react-leaflet';
import LocationMarker from '@/components/LocationMarker';
import 'leaflet/dist/leaflet.css';

function MapEvents({ onMapClick, setMapInstance }) {
  const map = useMap();
  useEffect(() => {
    map.on('click', onMapClick);
    if (setMapInstance) {
      setMapInstance(map);
    }
    return () => {
      map.off('click', onMapClick);
    };
  }, [map, onMapClick, setMapInstance]);
  return null;
}

function MapComponent({
  center,
  zoom,
  userLocation,
  startLocation,
  destinationLocation,
  route,
  congestionPoints,
  onMapClick,
  onLocationFound,
  onLocationError,
  setMapInstance,
}) {
  // Dynamically import icon logic to avoid SSR issues if any
  useEffect(() => {
    (async () => {
      const L = await import('leaflet');
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });
    })();
  }, []);

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapEvents onMapClick={onMapClick} setMapInstance={setMapInstance} />

      {userLocation && (
        <Marker position={userLocation}>
          <Popup>Your current location</Popup>
        </Marker>
      )}

      {startLocation && (
        <Marker position={startLocation}>
          <Popup>Start Location</Popup>
        </Marker>
      )}

      {destinationLocation && (
        <Marker position={destinationLocation}>
          <Popup>Destination</Popup>
        </Marker>
      )}

      {route && (
        <Polyline
          positions={route}
          pathOptions={{ color: '#3b82f6', weight: 5, opacity: 0.7 }}
        />
      )}

      {congestionPoints.map((point, index) => (
        <Circle
          key={index}
          center={point.location}
          radius={point.severity * 100}
          pathOptions={{
             fillColor: point.severity > 7 ? '#ef4444' : point.severity > 4 ? '#f97316' : '#eab308',
             color: point.severity > 7 ? '#dc2626' : point.severity > 4 ? '#ea580c' : '#ca8a04',
             weight: 1,
             opacity: 1,
             fillOpacity: 0.5
          }}
        >
          <Popup>
            <div>
              <h3 className="font-bold">Traffic Congestion</h3>
              <p>Severity: {point.severity}/10</p>
              <p>Estimated delay: {point.delay} minutes</p>
            </div>
          </Popup>
        </Circle>
      ))}

      <LocationMarker onLocationFound={onLocationFound} onLocationError={onLocationError} />
    </MapContainer>
  );
}

export default MapComponent;
