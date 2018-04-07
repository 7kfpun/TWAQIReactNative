import firebase from 'react-native-firebase';

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

const aqi = () => {
  const AQIURL = `${config.aqiUrl}?t=${Math.random()}`;
  return fetch(AQIURL)
    .then(res => res.json())
    .then(results => toObject(results))
    .catch((err) => {
      console.log('Request for aqi failed', err);
      firebase.crash().log('Request for aqi failed');
      firebase.crash().report(JSON.stringify(err));
    });
};


const aqfn = () => {
  const FORECASTURL = `${config.forecastUrl}?t=${Math.random()}`;
  return fetch(FORECASTURL)
    .then(res => res.json())
    .catch((err) => {
      console.log('Request for forecast failed', err);
      firebase.crash().log('Request for forecast failed');
      firebase.crash().report(JSON.stringify(err));
    });
};


const HISTORY_LIMIT = 24;

const history = (siteName) => {
  const AQI_HISTORY_URL = `${config.aqiHistoryUrl}?station=${siteName}&limit=${HISTORY_LIMIT}&t=${Math.random()}`;
  return fetch(AQI_HISTORY_URL)
    .then(res => res.json())
    .catch((err) => {
      console.log('Request for aqi history failed', err);
      firebase.crash().log('Request for history failed');
      firebase.crash().report(JSON.stringify(err));
    });
};

const realtimeWeather = (lat, lng) => {
  const form = new FormData();
  form.append('lat', lat);
  form.append('lng', lng);

  const REALTIME_WEATHER_URL = config.realtimeWeatherUrl;
  return fetch(REALTIME_WEATHER_URL, {
    method: 'post',
    body: form,
  })
    .then(res => res.json())
    .catch((err) => {
      console.log('Request for aqi realtimeWeather failed', err);
      firebase.crash().log('Request for realtimeWeather failed');
      firebase.crash().report(JSON.stringify(err));
      return err;
    });
};

exports.aqi = aqi;
exports.aqfn = aqfn;
exports.history = history;
exports.realtimeWeather = realtimeWeather;
