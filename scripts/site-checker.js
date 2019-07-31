const { siteZh2En } = require('../app/utils/site-mapping');
const fetch = require('node-fetch');

function getLatestAir() {
  const url =
    'http://opendata.epa.gov.tw/ws/Data/REWIQA/?$orderby=SiteName&$skip=0&$top=100&format=json';
  fetch(url)
    .then((res) => res.json())
    .then((json) => {
      const siteNames = json.forEach((i) => {
        if (siteZh2En[i.SiteName]) {
          console.log('IN', i.SiteName);
        } else {
          console.log('NOT IN', i.SiteName);
        }
      });
    });
}

getLatestAir();
