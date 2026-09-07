import { processResponse } from "./api";
import { BASE_URL } from "./constants";

export const getWeather = ({ latitude, longitude }) => {
  return fetch(
    `${BASE_URL}/weather?lat=${latitude}&lon=${longitude}`
  ).then(processResponse);
};
