import { config } from '../config';

const toObject = (arr) => {
  const rv = {};
  for (let i = 0; i < arr.length; i += 1) {
    rv[arr[i].SiteName] = arr[i];
    if (rv[arr[i].SiteName].PM2_5) {
      rv[arr[i].SiteName]['PM2.5'] = rv[arr[i].SiteName].PM2_5;
    }

    if (rv[arr[i].SiteName].PM2_5_AVG) {
      rv[arr[i].SiteName]['PM2.5_AVG'] = rv[arr[i].SiteName].PM2_5_AVG;
    }
  }
  return rv;
};

const AQI = () => {
  const AQIURL = `${config.aqiUrl}?t=${Math.random()}`;
  return fetch(AQIURL)
    .then(res => res.json())
    .then(results => toObject(results))
    .catch((err) => {
      console.log('Request for aqi failed', err);
    });
};

export default AQI;
