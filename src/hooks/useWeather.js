import { useCallback, useEffect, useRef, useState } from "react";

import { getWeather } from "../utils/weatherApi";
import {
  DEFAULT_COORDINATES,
  getCurrentPosition,
  getStoredCoordinates,
  storeCoordinates,
} from "../utils/geolocation";

const INITIAL_WEATHER = {
  type: "",
  temp: { F: 999, C: 999 },
  city: "",
  state: "",
  country: "",
  countryCode: "",
  location: "",
};

// locationStatus: "idle" | "locating" | "granted" | "default"
//  - "granted": showing weather for the user's real coordinates
//  - "default": geolocation denied/unavailable, showing the fallback location
export default function useWeather() {
  const [weatherData, setWeatherData] = useState(INITIAL_WEATHER);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationStatus, setLocationStatus] = useState("idle");

  const isMountedRef = useRef(true);

  // Fetch weather + reverse-geocode for a coordinate pair and merge into one object.
	const loadWeather = useCallback(async (coords) => {
  return getWeather(coords);
}, []);

  const fetchForCoordinates = useCallback(
    async (coords, { persist = false, status } = {}) => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await loadWeather(coords);
        if (!isMountedRef.current) return;
        setWeatherData(data);
        if (persist) storeCoordinates(coords);
        if (status) setLocationStatus(status);
      } catch (err) {
        if (!isMountedRef.current) return;
        console.error("Failed to load weather data", err);
        setError("WEATHER_FETCH_FAILED");
        if (status) setLocationStatus(status);
      } finally {
        if (isMountedRef.current) setIsLoading(false);
      }
    },
    [loadWeather],
  );

  // Ask the browser for the current position, then refresh weather.
  // Falls back to the default location if permission is denied/unavailable.
  const requestLocation = useCallback(async () => {
    setLocationStatus("locating");
    try {
      const coords = await getCurrentPosition();
      await fetchForCoordinates(coords, { persist: true, status: "granted" });
    } catch (err) {
      console.warn("Geolocation unavailable, using default location", err);
      await fetchForCoordinates(DEFAULT_COORDINATES, { status: "default" });
    }
  }, [fetchForCoordinates]);

  // On first mount: reuse stored coordinates if we have them, otherwise prompt.
  useEffect(() => {
    isMountedRef.current = true;

    const storedCoords = getStoredCoordinates();
    if (storedCoords) {
      fetchForCoordinates(storedCoords, { status: "granted" });
    } else {
      requestLocation();
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [fetchForCoordinates, requestLocation]);

  return {
    weatherData,
    isLoading,
    error,
    locationStatus,
    requestLocation,
  };
}
