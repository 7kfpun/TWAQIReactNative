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
    '01': dayHour >= 6 && dayHour < 18 ? 'ios-sunny' : 'ios-moon',
    '02': 'ios-cloud-outline',
    '03': 'ios-cloud',
    26: 'ios-rainy',
    99: false,
  }[code];
};
