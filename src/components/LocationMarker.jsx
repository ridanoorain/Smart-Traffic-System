
import React, { useEffect, useState } from 'react';
import { Marker, Popup, useMapEvents } from 'react-leaflet';

function LocationMarker({ onLocationFound, onLocationError }) {
  const [position, setPosition] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);

  const map = useMapEvents({
    locationfound(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
      if (onLocationFound) {
        onLocationFound(e.latlng, map);
      }
    },
    locationerror(e) {
      if (onLocationError) {
        onLocationError(e);
      }
    },
  });

  useEffect(() => {
    if (map && !mapInstance) {
      setMapInstance(map);
      map.locate({ setView: true, maxZoom: 16 });
    }
  }, [map, mapInstance]);

  return position === null ? null : (
    <Marker position={position}>
      <Popup>You are here</Popup>
    </Marker>
  );
}

export default LocationMarker;
