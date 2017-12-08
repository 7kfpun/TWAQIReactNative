import { config } from '../config';

const AQIHistory = (siteName) => {
  const AQI_HISTORY_URL = `${config.aqiHistoryUrl}?SiteName=${siteName}&t=${Math.random()}`;
  return fetch(AQI_HISTORY_URL)
    .then(res => res.json())
    .catch((err) => {
      console.log('Request for aqi history failed', err);
    });
};

export default AQIHistory;
