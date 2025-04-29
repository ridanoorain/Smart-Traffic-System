
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Car, RotateCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function LocationPanel({
  startInput,
  destinationInput,
  isLoading,
  startLocation,
  destinationLocation,
  onStartInputChange,
  onDestinationInputChange,
  onCalculateRoute,
  onResetLocations,
  onUseCurrentLocation,
}) {
  const canCalculate = !!startLocation && !!destinationLocation;

  return (
    <motion.div
      className="location-panel absolute top-4 left-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm p-6 rounded-lg shadow-lg w-80 z-[1000] border border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800 dark:text-gray-100">
        <Navigation className="mr-2 h-5 w-5 text-primary" />
        Route Planner
      </h2>

      <div className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="start" className="text-sm font-medium text-gray-700 dark:text-gray-300">Start Location</Label>
          <div className="flex space-x-2">
            <Input
              id="start"
              className="text-sm"
              placeholder="Click map or use current"
              value={startInput}
              onChange={onStartInputChange}
              readOnly
            />
            <Button
              variant="outline"
              size="icon"
              onClick={onUseCurrentLocation}
              title="Use current location"
              className="shrink-0"
            >
              <MapPin className="h-4 w-4" />
            </Button>
          </div>
          {startLocation && <p className="text-xs text-gray-500 dark:text-gray-400">Lat: {startLocation[0].toFixed(4)}, Lng: {startLocation[1].toFixed(4)}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="destination" className="text-sm font-medium text-gray-700 dark:text-gray-300">Destination</Label>
          <Input
            id="destination"
            className="text-sm"
            placeholder={startLocation ? "Click map to set" : "Set start first"}
            value={destinationInput}
            onChange={onDestinationInputChange}
            readOnly
            disabled={!startLocation}
          />
           {destinationLocation && <p className="text-xs text-gray-500 dark:text-gray-400">Lat: {destinationLocation[0].toFixed(4)}, Lng: {destinationLocation[1].toFixed(4)}</p>}
        </div>

        <div className="flex space-x-2 pt-2">
          <Button
            onClick={onCalculateRoute}
            className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
            disabled={isLoading || !canCalculate}
          >
            {isLoading ? (
              <>
                <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                Calculating...
              </>
            ) : (
              <>
                <Car className="mr-2 h-4 w-4" />
                Find Best Route
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={onResetLocations}
            title="Reset locations"
            className="shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export default LocationPanel;
