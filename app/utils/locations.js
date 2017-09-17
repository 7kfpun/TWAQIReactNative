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
  // const AQIURL = `https://opendata.epa.gov.tw/ws/Data/REWIQA/?$orderby=SiteName&$skip=0&$top=100&format=json&${Math.random()}`;
  const AQIURL = `https://www.taiwanstat.com/realtime/air-map/data/site.csv?t=${Math.random()}`;
  return fetch(AQIURL)
    .then(res => res.text())
    .then(text => csvJSON(text));
};

export default locations;

// [{
//   SiteName: '臺東',
//   SiteEngName: 'Taitung',
//   AreaName: '花東空品區',
//   County: '臺東縣',
//   Township: '臺東市',
//   SiteAddress: '臺東市中山路276號',
//   TWD97Lon: '121.1504500000',
//   TWD97Lat: '22.7553580000',
//   SiteType: '一般測站',
// }, {
//   SiteName: '臺南',
//   SiteEngName: 'Tainan',
//   AreaName: '雲嘉南空品區',
//   County: '臺南市',
//   Township: '中西區',
//   SiteAddress: '臺南市中西區南寧街45號',
//   TWD97Lon: '120.2026170000',
//   TWD97Lat: '22.9845810000',
//   SiteType: '一般測站',
// }]
