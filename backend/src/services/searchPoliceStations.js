import { getCachedPoliceStations } from "./loadPoliceStations.js";

export function searchPoliceStationsByName(query) {
  if (!query) return [];

  const lowerQuery = query.toLowerCase();

  const stations = getCachedPoliceStations();

  return stations.filter(station =>
    station.name.toLowerCase().includes(lowerQuery) ||
    (station.district && station.district.toLowerCase().includes(lowerQuery)) ||
    (station.city && station.city.toLowerCase().includes(lowerQuery))
  );
}
