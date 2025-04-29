
import React, { useState } from 'react';

export function useMapState() {
  const [startLocation, setStartLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [startInput, setStartInput] = useState('');
  const [destinationInput, setDestinationInput] = useState('');
  const [route, setRoute] = useState(null);
  const [congestionPoints, setCongestionPoints] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]); // Default to London
  const [mapZoom, setMapZoom] = useState(13);
  const [mapInstance, setMapInstance] = useState(null); // Store map instance

  return {
    startLocation, setStartLocation,
    destinationLocation, setDestinationLocation,
    startInput, setStartInput,
    destinationInput, setDestinationInput,
    route, setRoute,
    congestionPoints, setCongestionPoints,
    isLoading, setIsLoading,
    userLocation, setUserLocation,
    mapCenter, setMapCenter,
    mapZoom, setMapZoom,
    mapInstance, setMapInstance,
  };
}
