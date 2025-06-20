import { getCachedHospitals } from "./loadHospitals.js";

export function searchHospitalsByName(query) {
  if (!query) return [];

  const lowerQuery = query.toLowerCase();

  const hospitals = getCachedHospitals();

  return hospitals.filter(hospital =>
    hospital.name.toLowerCase().includes(lowerQuery)
  );
}
