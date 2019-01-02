import {
  Linking,
  Platform,
} from 'react-native';

import SafariView from 'react-native-safari-view';

export const openURL = (url, isInApp = 1) => {
  if (Platform.OS === 'ios' && isInApp) {
    SafariView.isAvailable()
      .then(SafariView.show({ url }))
      .catch((error) => {
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
    [],
  );
