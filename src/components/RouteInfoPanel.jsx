
import React from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertTriangle } from 'lucide-react';
import { getEstimatedTime, calculateRouteDistance } from '@/lib/trafficUtils';

function RouteInfoPanel({ route, congestionPoints }) {
  if (!route) return null;

  const distance = calculateRouteDistance(route);
  const estimatedTime = getEstimatedTime(route, congestionPoints);

  return (
    <motion.div
      className="route-info"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h3 className="text-lg font-bold mb-2 flex items-center">
        <Clock className="mr-2 h-5 w-5 text-primary" />
        Route Information
      </h3>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span>Distance:</span>
          <span className="font-medium">{distance.toFixed(1)} km</span>
        </div>

        <div className="flex justify-between">
          <span>Estimated Time:</span>
          <span className="font-medium">
            {Math.round(estimatedTime)} min
          </span>
        </div>

        {congestionPoints.length > 0 && (
          <div className="mt-2 p-3 bg-amber-50 rounded-md border border-amber-200">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800">Traffic Alert</h4>
                <p className="text-sm text-amber-700">
                  {congestionPoints.length} congestion {congestionPoints.length === 1 ? 'point' : 'points'} detected. Estimated delay: {congestionPoints.reduce((sum, p) => sum + p.delay, 0)} min.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default RouteInfoPanel;
