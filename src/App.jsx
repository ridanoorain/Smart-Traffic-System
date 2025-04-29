
import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import MapComponent from '@/components/MapComponent';
import LocationPanel from '@/components/LocationPanel';
import RouteInfoPanel from '@/components/RouteInfoPanel';
import { useMapState } from '@/hooks/useMapState';
import { useMapHandlers } from '@/hooks/useMapHandlers';

function App() {
  const state = useMapState();
  const setStateFunctions = {
    setUserLocation: state.setUserLocation,
    setMapCenter: state.setMapCenter,
    setMapZoom: state.setMapZoom,
    setMapInstance: state.setMapInstance,
    setStartLocation: state.setStartLocation,
    setStartInput: state.setStartInput,
    setDestinationLocation: state.setDestinationLocation,
    setDestinationInput: state.setDestinationInput,
    setIsLoading: state.setIsLoading,
    setRoute: state.setRoute,
    setCongestionPoints: state.setCongestionPoints,
  };
  const handlers = useMapHandlers(state, setStateFunctions);

  return (
    <div className="map-container relative h-screen w-screen flex">
      <div className="flex-grow h-full">
        <MapComponent
          center={state.mapCenter}
          zoom={state.mapZoom}
          userLocation={state.userLocation}
          startLocation={state.startLocation}
          destinationLocation={state.destinationLocation}
          route={state.route}
          congestionPoints={state.congestionPoints}
          onMapClick={handlers.handleMapClick}
          onLocationFound={handlers.handleLocationFound}
          onLocationError={handlers.handleLocationError}
          setMapInstance={state.setMapInstance}
        />
      </div>

      <AnimatePresence>
        <LocationPanel
          startInput={state.startInput}
          destinationInput={state.destinationInput}
          isLoading={state.isLoading}
          startLocation={state.startLocation}
          destinationLocation={state.destinationLocation}
          onStartInputChange={(e) => state.setStartInput(e.target.value)}
          onDestinationInputChange={(e) => state.setDestinationInput(e.target.value)}
          onCalculateRoute={handlers.calculateRoute}
          onResetLocations={handlers.resetLocations}
          onUseCurrentLocation={handlers.useCurrentLocation}
        />
      </AnimatePresence>

      <AnimatePresence>
        {state.route && (
          <RouteInfoPanel route={state.route} congestionPoints={state.congestionPoints} />
        )}
      </AnimatePresence>

      <Toaster />
    </div>
  );
}

export default App;
