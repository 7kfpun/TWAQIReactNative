import { config } from '../config';

const FORECAST = () => {
  const FORECASTURL = `${config.forecastUrl}?t=${Math.random()}`;
  return fetch(FORECASTURL)
    .then(res => res.json())
    .catch((err) => {
      console.log('Request for forecast failed', err);
    });
};

export default FORECAST;
