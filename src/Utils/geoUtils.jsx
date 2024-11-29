// src/utils/geoUtils.js
export const fetchGeoLocation = async (address) => {
    const API_KEY = "47b3126317b94cb4b1f9f9a9b0a95865";
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${API_KEY}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry;
        return `${lat},${lng}`;
      } else {
        throw new Error("Unable to fetch geolocation. Please check your address.");
      }
    } catch (error) {
      throw new Error("Failed to fetch geolocation. Please try again.");
    }
  };
  