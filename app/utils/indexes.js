import I18n from './i18n';

exports.indexTypes = [{
  key: 'AQI',
  name: 'AQI',
  unit: '',
}, {
  key: 'PM2_5',
  name: 'PM2.5',
  unit: 'μg/m3',
}, {
  key: 'PM10',
  name: 'PM10',
  unit: 'μg/m3',
}, {
  key: 'O3',
  name: 'O3',
  unit: 'ppb',
}, {
  key: 'CO',
  name: 'CO',
  unit: 'ppm',
}, {
  key: 'SO2',
  name: 'SO2',
  unit: 'ppb',
}, {
  key: 'NO2',
  name: 'NO2',
  unit: 'ppb',
}];

// 0-50 Good Air pollution risk is low.
// 51-100 Moderate Air quality is acceptable.
// 101-150 Unhealthy for high-risk group High-risk group may have health effects. General public is not affected.
// 151-200 Unhealthy High-risk group may have more serious health effects. Some of the general public may have health effects.
// 201-300 Very Unhealthy General public have health effects.
// 301-500 Hazardous Some of the general public may have more serious health effects.
const indexRanges = {
  AQI: [{
    key: 0,
    status: I18n.t('status_good'),
    color: '#009866',
    fontColor: 'white',
    min: 0,
    max: 50,
  }, {
    key: 1,
    status: I18n.t('status_moderate'),
    color: '#FEDE33',
    fontColor: 'black',
    min: 51,
    max: 100,
  }, {
    key: 2,
    status: I18n.t('status_unhealthy_for_sensitive_groups'),
    color: '#FE9833',
    fontColor: 'black',
    min: 101,
    max: 150,
  }, {
    key: 3,
    status: I18n.t('status_unhealthy'),
    color: '#CC0033',
    fontColor: 'white',
    min: 151,
    max: 200,
  }, {
    key: 4,
    status: I18n.t('status_very_unhealthy'),
    color: '#660098',
    fontColor: 'white',
    min: 201,
    max: 300,
  }, {
    key: 5,
    status: I18n.t('status_hazardous'),
    color: '#7E2200',
    fontColor: 'white',
    min: 301,
    max: 500,
  }],

  'PM2.5': [{
    key: 0,
    status: '良好',
    color: '#009866',
    fontColor: 'white',
    min: 0.0,
    max: 15.4,
  }, {
    key: 1,
    status: '普通',
    color: '#FEDE33',
    fontColor: 'black',
    min: 15.5,
    max: 35.4,
  }, {
    key: 2,
    status: '對敏感族群不良',
    color: '#FE9833',
    fontColor: 'black',
    min: 35.5,
    max: 54.4,
  }, {
    key: 3,
    status: '對所有族群不良',
    color: '#CC0033',
    fontColor: 'white',
    min: 54.5,
    max: 150.4,
  }, {
    key: 4,
    status: '非常不良',
    color: '#660098',
    fontColor: 'white',
    min: 150.5,
    max: 250.4,
  }, {
    key: 5,
    status: '有害',
    color: '#7E2200',
    fontColor: 'white',
    min: 250.5,
    max: 500.4,
  }],

  PM10: [{
    key: 0,
    status: '良好',
    color: '#009866',
    fontColor: 'white',
    min: 0,
    max: 54,
  }, {
    key: 1,
    status: '普通',
    color: '#FEDE33',
    fontColor: 'black',
    min: 55,
    max: 125,
  }, {
    key: 2,
    status: '對敏感族群不良',
    color: '#FE9833',
    fontColor: 'black',
    min: 126,
    max: 254,
  }, {
    key: 3,
    status: '對所有族群不良',
    color: '#CC0033',
    fontColor: 'white',
    min: 255,
    max: 354,
  }, {
    key: 4,
    status: '非常不良',
    color: '#660098',
    fontColor: 'white',
    min: 355,
    max: 424,
  }, {
    key: 5,
    status: '有害',
    color: '#7E2200',
    fontColor: 'white',
    min: 425,
    max: 604,
  }],

  O3: [{
    key: 0,
    status: '良好',
    color: '#009866',
    fontColor: 'white',
    min: 0,
    max: 54,
  }, {
    key: 1,
    status: '普通',
    color: '#FEDE33',
    fontColor: 'black',
    min: 55,
    max: 125,
  }, {
    key: 2,
    status: '對敏感族群不良',
    color: '#FE9833',
    fontColor: 'black',
    min: 125,
    max: 164,
  }, {
    key: 3,
    status: '對所有族群不良',
    color: '#CC0033',
    fontColor: 'white',
    min: 165,
    max: 204,
  }, {
    key: 4,
    status: '非常不良',
    color: '#660098',
    fontColor: 'white',
    min: 205,
    max: 404,
  }, {
    key: 5,
    status: '有害',
    color: '#7E2200',
    fontColor: 'white',
    min: 405,
    max: 604,
  }],

  CO: [{
    key: 0,
    status: '良好',
    color: '#009866',
    fontColor: 'white',
    min: 0,
    max: 4.4,
  }, {
    key: 1,
    status: '普通',
    color: '#FEDE33',
    fontColor: 'black',
    min: 4.5,
    max: 9.4,
  }, {
    key: 2,
    status: '對敏感族群不良',
    color: '#FE9833',
    fontColor: 'black',
    min: 9.5,
    max: 12.4,
  }, {
    key: 3,
    status: '對所有族群不良',
    color: '#CC0033',
    fontColor: 'white',
    min: 12.5,
    max: 15.4,
  }, {
    key: 4,
    status: '非常不良',
    color: '#660098',
    fontColor: 'white',
    min: 15.5,
    max: 30.4,
  }, {
    key: 5,
    status: '有害',
    color: '#7E2200',
    fontColor: 'white',
    min: 30.5,
    max: 50.4,
  }],

  SO2: [{
    key: 0,
    status: '良好',
    color: '#009866',
    fontColor: 'white',
    min: 0,
    max: 35,
  }, {
    key: 1,
    status: '普通',
    color: '#FEDE33',
    fontColor: 'black',
    min: 36,
    max: 75,
  }, {
    key: 2,
    status: '對敏感族群不良',
    color: '#FE9833',
    fontColor: 'black',
    min: 76,
    max: 185,
  }, {
    key: 3,
    status: '對所有族群不良',
    color: '#CC0033',
    fontColor: 'white',
    min: 186,
    max: 304,
  }, {
    key: 4,
    status: '非常不良',
    color: '#660098',
    fontColor: 'white',
    min: 305,
    max: 604,
  }, {
    key: 5,
    status: '有害',
    color: '#7E2200',
    fontColor: 'white',
    min: 605,
    max: 1004,
  }],

  NO2: [{
    key: 0,
    status: '良好',
    color: '#009866',
    fontColor: 'white',
    min: 0,
    max: 53,
  }, {
    key: 1,
    status: '普通',
    color: '#FEDE33',
    fontColor: 'black',
    min: 54,
    max: 100,
  }, {
    key: 2,
    status: '對敏感族群不良',
    color: '#FE9833',
    fontColor: 'black',
    min: 101,
    max: 360,
  }, {
    key: 3,
    status: '對所有族群不良',
    color: '#CC0033',
    fontColor: 'white',
    min: 361,
    max: 649,
  }, {
    key: 4,
    status: '非常不良',
    color: '#660098',
    fontColor: 'white',
    min: 650,
    max: 1249,
  }, {
    key: 5,
    status: '有害',
    color: '#7E2200',
    fontColor: 'white',
    min: 1250,
    max: 2049,
  }],
};

exports.indexRanges = indexRanges;

const getColor = (index, amount) => {
  const isMatched = (indexRanges[index] || indexRanges[index.replace('_', '.')]).filter(item => amount >= item.min && amount <= item.max);
  if (isMatched && isMatched.length >= 1) {
    return isMatched[0];
  }

  return { color: '#212121' };
};

exports.getColor = getColor;
