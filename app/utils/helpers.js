import { Linking, Platform } from 'react-native';

import SafariView from 'react-native-safari-view';

import moment from 'moment';

export const openURL = (url, isInApp = 1) => {
  if (Platform.OS === 'ios' && isInApp) {
    SafariView.isAvailable()
      .then(SafariView.show({ url }))
      .catch(error => {
        console.log(error);
        Linking.openURL(url);
      });
  } else {
    Linking.openURL(url);
  }
};

// Flatten a list of lists of elements into a list of elements.
export const flatten = arr =>
  arr.reduce(
    (flat, toFlatten) =>
      flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten),
    []
  );

export const noop = () => {};

export const getWeatherIconName = (code, time) => {
  let dayHour;
  if (time) {
    dayHour = moment(time).format('H');
  } else {
    dayHour = moment().format('H');
  }

  return {
    '01': dayHour >= 6 && dayHour < 18 ? 'ios-sunny' : 'ios-moon', // 晴
    '02':
      dayHour >= 6 && dayHour < 18 ? 'ios-cloud-outline' : 'ios-cloudy-night', // 多雲
    '03': 'ios-cloud', // 陰, 陰有靄
    '07': 'ios-cloud', // 陰
    44: 'ios-cloud', // 多雲有霾
    '04': 'ios-rainy', // 陰有雨, 有雨
    '08': 'ios-rainy', // 陰有雨, 有雨
    14: 'ios-rainy', // 陣雨
    26: 'ios-rainy', // 短暫雨
    18: 'ios-thunderstorm', // 陣雨或雷雨
    99: false,
  }[code];
};
