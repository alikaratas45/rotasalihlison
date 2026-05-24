
/**
 * Geo Utilities for Rota Salihli
 * Handles distance calculations and KML coordinate extraction.
 */

/**
 * Calculates the Haversine distance between two points in meters.
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth's radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) *
      Math.cos(phi2) *
      Math.sin(deltaLambda / 2) *
      Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Fetches and extracts all coordinates from a KML file.
 */
export async function getKmlPoints(url: string): Promise<{ lat: number; lng: number }[]> {
  if (!url || !url.startsWith('http')) {
    return [];
  }

  try {
    const response = await fetch(url).catch(() => null);
    
    if (!response || !response.ok) {
      console.warn(`KML file could not be fetched from ${url}`);
      return [];
    }
    
    const kmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(kmlText, 'text/xml');
    
    // Support both standard 'coordinates' and potential variations
    const coordinatesElements = xmlDoc.getElementsByTagName('coordinates');
    const points: { lat: number; lng: number }[] = [];

    Array.from(coordinatesElements).forEach((element) => {
      const coordString = element.textContent?.trim();
      if (coordString) {
        // Robust coordinate splitting: handles spaces, newlines, tabs and various delimiters
        const rawPoints = coordString.split(/[\s\n\r]+/).filter((p) => p.trim());
        rawPoints.forEach((p) => {
          const parts = p.split(',');
          if (parts.length >= 2) {
            // KML format is typically Lng, Lat, Alt
            const lng = parseFloat(parts[0]);
            const lat = parseFloat(parts[1]);
            if (!isNaN(lat) && !isNaN(lng)) {
              points.push({ lat, lng });
            }
          }
        });
      }
    });
    return points;
  } catch (error) {
    console.error('Error processing KML:', error);
    return [];
  }
}

/**
 * Checks if a point is within a threshold distance of any point on a route.
 */
export function isPointNearRoute(
  point: { lat: number; lng: number },
  routePoints: { lat: number; lng: number }[],
  thresholdMeters: number = 300
): boolean {
  if (routePoints.length === 0) return false;
  
  for (const rPoint of routePoints) {
    if (calculateDistance(point.lat, point.lng, rPoint.lat, rPoint.lng) <= thresholdMeters) {
      return true;
    }
  }
  return false;
}
