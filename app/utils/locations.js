import defaultLocation from './defaultLocation';

const csvJSON = (csv) => {
  const lines = csv.split('\n');
  const result = [];
  const headers = lines[0].split(',');

  for (let i = 1; i < lines.length; i += 1) {
    const obj = {};
    const currentline = lines[i].split(',');

    for (let j = 0; j < headers.length; j += 1) {
      obj[headers[j]] = currentline[j];
    }

    if (headers[0] && obj[headers[0]]) {
      result.push(obj);
    }
  }

  return result;
};

const locations = () => {
  console.log('Request for locations');
  // const AQIURL = `https://opendata.epa.gov.tw/ws/Data/REWIQA/?$orderby=SiteName&$skip=0&$top=100&format=json&${Math.random()}`;
  const AQIURL = `https://www.taiwanstat.com/realtime/air-map/data/site.csv?t=${Math.random()}`;
  return fetch(AQIURL)
    .then(res => res.text())
    .then(text => csvJSON(text))
    .catch((err) => {
      console.log('Request for locations failed', err);
      return defaultLocation;
    });
};

export default locations;
