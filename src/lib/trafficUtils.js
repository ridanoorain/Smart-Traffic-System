
// Utility functions for traffic prediction and route generation

// Generate a route between two points
export function generateRoute(start, end) {
  // In a real app, this would call a routing API like MapBox, Google Maps, or OSRM
  // For demo purposes, we'll create a simulated route

  const numPoints = 20; // Number of points in our route
  const route = [];

  for (let i = 0; i <= numPoints; i++) {
    const ratio = i / numPoints;

    // Linear interpolation between start and end
    const lat = start[0] + (end[0] - start[0]) * ratio;
    const lng = start[1] + (end[1] - start[1]) * ratio;

    // Add some randomness to make it look like a real route
    const jitter = 0.002; // Amount of randomness
    const randomLat = i > 0 && i < numPoints ? (Math.random() - 0.5) * jitter : 0;
    const randomLng = i > 0 && i < numPoints ? (Math.random() - 0.5) * jitter : 0;

    route.push([lat + randomLat, lng + randomLng]);
  }

  return route;
}

// Predict congestion points along a route
export function predictCongestion(route) {
  // In a real app, this would use real-time traffic data from an API
  // For demo purposes, we'll simulate congestion points

  const congestionPoints = [];
  const numCongestionPoints = Math.floor(Math.random() * 3) + 1; // 1-3 congestion points

  // Skip the first and last points (start and end)
  const availablePoints = route.slice(1, -1);

  // Select random points for congestion
  for (let i = 0; i < numCongestionPoints; i++) {
    if (availablePoints.length === 0) break;

    const randomIndex = Math.floor(Math.random() * availablePoints.length);
    const point = availablePoints[randomIndex];

    // Remove this point and nearby points to avoid clustering
    availablePoints.splice(Math.max(0, randomIndex - 2), Math.min(5, availablePoints.length - randomIndex + 2));

    // Generate random severity (1-10) and delay
    const severity = Math.floor(Math.random() * 10) + 1;
    const delay = Math.floor(severity * 1.5); // Delay in minutes based on severity

    congestionPoints.push({
      location: point,
      severity,
      delay
    });
  }

  return congestionPoints;
}

// Calculate the best route considering congestion
export function calculateBestRoute(start, end, congestionPoints) {
  // In a real app, this would use an algorithm to find the optimal route
  // For demo purposes, we'll just return the direct route

  return generateRoute(start, end);
}

// Get estimated travel time for a route
export function getEstimatedTime(route, congestionPoints) {
  // Base time calculation (simplified)
  const distance = calculateRouteDistance(route);
  const baseTimeMinutes = distance / 0.8; // Assuming 48 km/h average speed

  // Add delays from congestion points
  const totalDelay = congestionPoints.reduce((sum, point) => sum + point.delay, 0);

  return baseTimeMinutes + totalDelay;
}

// Calculate route distance in kilometers
export function calculateRouteDistance(route) {
  if (!route || route.length < 2) return 0;
  let distance = 0;

  for (let i = 1; i < route.length; i++) {
    distance += haversineDistance(route[i-1], route[i]);
  }

  return distance;
}

// Calculate distance between two points using the Haversine formula
function haversineDistance(point1, point2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(point2[0] - point1[0]);
  const dLon = toRad(point2[1] - point1[1]);

  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(point1[0])) * Math.cos(toRad(point2[0])) *
    Math.sin(dLon/2) * Math.sin(dLon/2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function toRad(degrees) {
  return degrees * Math.PI / 180;
}
