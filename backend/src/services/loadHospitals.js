// services/loadHospitals.service.js
import NewHospitals from "../models/NewHospitals.js";

// In-memory cache
export let hospitalsCache = [];

/**
 * Load hospitals directly from the database at server startup.
 */
export async function loadHospitalsAtStartup() {
  try {
    const hospitals = await NewHospitals.find({}, "_id name type registrationNumber address.city");
    hospitalsCache = hospitals.map((h) => ({
      id: h._id.toString(),
      name: h.name,
      type: h.type,
      registrationNumber: h.registrationNumber,
      city: h.address?.city || ""
    }));
    console.log(`✅ Loaded ${hospitalsCache.length} hospitals into memory.`);
    console.log(hospitalsCache)
  } catch (err) {
    console.error("❌ Failed to load hospitals from DB at startup.", err.message);
  }
}

/**
 * Return cached hospital list.
 */
export function getCachedHospitals() {
  return hospitalsCache;
}
