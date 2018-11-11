exports.config = {
  aqiUrl: 'http://opendata.epa.gov.tw/ws/Data/REWIQA/?$orderby=SiteName&$skip=0&$top=100&format=json',
  aqiHistoryUrl: '',
  forecastUrl: 'http://opendata.epa.gov.tw/ws/Data/AQFN/?$orderby=PublishTime%20desc&$skip=0&$top=100&format=json',
  realtimeWeatherUrl: 'https://ienv.epa.gov.tw/MyEnv/Weather/_Realtime',
  forecastWeatherUrl: 'https://ienv.epa.gov.tw/MyEnv/Weather/_Forecast',
  uviWeatherUrl: 'https://ienv.epa.gov.tw/MyEnv/Weather/_Uvi',
  feedbackUrl: {
    zh: '',
    en: '',
  },
  admob: {
    ios: {
      interstital: '',
    },
    android: {
      interstital: '',
    },

    'twaqi-ios-main-footer': '',
    'twaqi-ios-list-footer': '',
    'twaqi-ios-details-footer': '',
    'twaqi-ios-forecast-footer': '',
    'twaqi-ios-forecast-3days-footer': '',
    'twaqi-ios-forecast-detailed-footer': '',
    'twaqi-ios-settings-footer': '',
    'twaqi-ios-help-footer': '',

    'twaqi-android-main-footer': '',
    'twaqi-android-list-footer': '',
    'twaqi-android-details-footer': '',
    'twaqi-android-forecast-footer': '',
    'twaqi-android-forecast-3days-footer': '',
    'twaqi-android-forecast-detailed-footer': '',
    'twaqi-android-settings-footer': '',
    'twaqi-android-help-footer': '',
  },
  segment: '',
};
