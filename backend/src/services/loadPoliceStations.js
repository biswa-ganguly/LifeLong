import PoliceStation from "../models/PoliceStation.js"; // adjust model name/path as needed

// In-memory cache
export let policeStationsCache = [];

/**
 * Load police stations from the database at server startup.
 */
export async function loadPoliceStationsAtStartup() {
  try {
    const stations = await PoliceStation.find({}, "_id stationName address.district address.city");
    policeStationsCache = stations.map((s) => ({
      id: s._id.toString(),
      name: s.stationName,
      district: s.address?.district,
      city: s.address?.city || ""
    }));
    console.log(`✅ Loaded ${policeStationsCache.length} police stations into memory.`);
    console.log(policeStationsCache);
  } catch (err) {
    console.error("❌ Failed to load police stations from DB at startup.", err.message);
  }
}

/**
 * Return cached police stations.
 */
export function getCachedPoliceStations() {
  return policeStationsCache;
}
