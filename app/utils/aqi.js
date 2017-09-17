const toObject = (arr) => {
  const rv = {};
  for (let i = 0; i < arr.length; i += 1) {
    rv[arr[i].SiteName] = arr[i];
  }
  return rv;
};

const AQI = () => {
  // const AQIURL = `https://opendata.epa.gov.tw/ws/Data/REWIQA/?$orderby=SiteName&$skip=0&$top=100&format=json&${Math.random()}`;
  const AQIURL = `https://www.taiwanstat.com/airs/latest/?t=${Math.random()}`;
  return fetch(AQIURL)
    .then(res => res.json())
    .then(results => toObject(results));
};

export default AQI;
