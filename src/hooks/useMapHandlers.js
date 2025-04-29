
import React, { useCallback } from 'react';
import L from 'leaflet'; // Import Leaflet library
import { useToast } from '@/components/ui/use-toast';
import { generateRoute, predictCongestion } from '@/lib/trafficUtils';

export function useMapHandlers(state, setState) {
  const { toast } = useToast();
  const {
    startLocation, destinationLocation, userLocation, mapInstance,
  } = state;
  const {
    setUserLocation, setMapCenter, setMapZoom, setMapInstance,
    setStartLocation, setStartInput,
    setDestinationLocation, setDestinationInput,
    setIsLoading, setRoute, setCongestionPoints,
  } = setState;

  const handleLocationFound = useCallback((latlng, map) => {
    const newUserLocation = [latlng.lat, latlng.lng];
    setUserLocation(newUserLocation);
    setMapCenter(newUserLocation);
    setMapZoom(13);
    // Do not setMapInstance here again if it was set in MapComponent
    toast({
      title: "Location detected",
      description: "We've found your current location.",
    });
  }, [toast, setUserLocation, setMapCenter, setMapZoom]);

  const handleLocationError = useCallback((error) => {
    console.error("Error getting location:", `Code: ${error.code}, Message: ${error.message}`);
    let description = "Could not get your location. Using default map view.";
    if (error.code === 1) {
      description = "Location access denied. Please enable location permissions in your browser settings.";
    } else if (error.code === 2) {
      description = "Location information is unavailable. Please try again later.";
    } else if (error.code === 3) {
      description = "Getting location timed out. Please check your connection and try again.";
    }
    toast({
      variant: "destructive",
      title: "Location Error",
      description: description,
    });
  }, [toast]);

  const handleStartLocationSelect = useCallback((latlng) => {
    setStartLocation(latlng);
    setStartInput(`${latlng[0].toFixed(5)}, ${latlng[1].toFixed(5)}`);
    setDestinationLocation(null); // Clear destination when new start is set
    setDestinationInput('');
    setRoute(null); // Clear route when start changes
    setCongestionPoints([]);
    toast({
      title: "Start location set",
      description: "Click on the map again to set your destination.",
    });
  }, [toast, setStartLocation, setStartInput, setDestinationLocation, setDestinationInput, setRoute, setCongestionPoints]);

  const handleDestinationLocationSelect = useCallback((latlng) => {
    setDestinationLocation(latlng);
    setDestinationInput(`${latlng[0].toFixed(5)}, ${latlng[1].toFixed(5)}`);
    toast({
      title: "Destination set",
      description: "Ready! Click 'Find Best Route' to calculate.",
    });
  }, [toast, setDestinationLocation, setDestinationInput]);

  const handleMapClick = useCallback((e) => {
    const { lat, lng } = e.latlng;
    if (!startLocation) {
      handleStartLocationSelect([lat, lng]);
    } else if (!destinationLocation) {
      handleDestinationLocationSelect([lat, lng]);
    } else {
      // If both are set, clicking again sets a new start location
      handleStartLocationSelect([lat, lng]);
    }
  }, [startLocation, destinationLocation, handleStartLocationSelect, handleDestinationLocationSelect]);

  const calculateRoute = useCallback(async () => {
    if (!startLocation || !destinationLocation) {
      toast({
        variant: "destructive",
        title: "Missing locations",
        description: "Please set both start and destination locations first by clicking on the map.",
      });
      return;
    }

    setIsLoading(true);
    setRoute(null);
    setCongestionPoints([]);

    try {
       // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const routeData = generateRoute(startLocation, destinationLocation);
      if (!routeData || routeData.length === 0) {
        throw new Error("Route generation failed");
      }
      setRoute(routeData);

      const congestionData = predictCongestion(routeData);
      setCongestionPoints(congestionData);

      if (mapInstance && routeData.length > 0) {
         // Use L.latLngBounds correctly after importing L
         const bounds = routeData.reduce(
           (acc, point) => acc.extend(point),
           L.latLngBounds(startLocation, startLocation) // Initialize with start location
         ).extend(destinationLocation); // Ensure destination is included
         mapInstance.fitBounds(bounds, { padding: [50, 50] });
      }

      toast({
        title: "Route calculated successfully!",
        description: `Found route with ${congestionData.length} potential congestion points.`,
      });
    } catch (error) {
      console.error("Error calculating route:", error);
      toast({
        variant: "destructive",
        title: "Route Calculation Failed",
        description: error.message || "Could not calculate the route. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [startLocation, destinationLocation, toast, mapInstance, setIsLoading, setRoute, setCongestionPoints]);

  const resetLocations = useCallback(() => {
    setStartLocation(null);
    setDestinationLocation(null);
    setStartInput('');
    setDestinationInput('');
    setRoute(null);
    setCongestionPoints([]);
    if (mapInstance) {
        if (userLocation) {
          mapInstance.flyTo(userLocation, 13);
        } else {
          mapInstance.flyTo([51.505, -0.09], 13); // Fly to default
        }
    } else {
        // Fallback if map instance isn't ready yet
        if (userLocation) {
            setMapCenter(userLocation);
        } else {
            setMapCenter([51.505, -0.09]);
        }
        setMapZoom(13);
    }
    toast({
      title: "Reset complete",
      description: "All locations and route have been cleared.",
    });
  }, [toast, userLocation, mapInstance, setStartLocation, setDestinationLocation, setStartInput, setDestinationInput, setRoute, setCongestionPoints, setMapCenter, setMapZoom]);

  const useCurrentLocation = useCallback(() => {
    if (userLocation) {
      handleStartLocationSelect(userLocation);
    } else {
      toast({
        variant: "destructive",
        title: "Location unavailable",
        description: "Could not access your current location. Attempting to detect again...",
      });
      if (mapInstance) {
        mapInstance.locate({ setView: true, maxZoom: 16 });
      }
    }
  }, [userLocation, handleStartLocationSelect, toast, mapInstance]);

  return {
    handleLocationFound,
    handleLocationError,
    handleMapClick,
    calculateRoute,
    resetLocations,
    useCurrentLocation,
  };
}
