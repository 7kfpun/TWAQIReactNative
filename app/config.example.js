exports.config = {
  aqiUrl: 'http://opendata.epa.gov.tw/ws/Data/REWIQA/?$orderby=SiteName&$skip=0&$top=100&format=json',
  aqiHistoryUrl: '',
  forecastUrl: 'http://opendata.epa.gov.tw/ws/Data/AQFN/?$orderby=PublishTime%20desc&$skip=0&$top=100&format=json',
  admob: {
    ios: {
      banner: '',
      interstital: '',
    },
    android: {
      banner: '',
      interstital: '',
    },
  },
  fbads: {
    ios: {
      banner: '',
      native: '',
      interstital: '',
    },
    android: {
      banner: '',
      native: '',
      interstital: '',
    },
  },
  segment: '',
};
