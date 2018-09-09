import {
  Linking,
  Platform,
} from 'react-native';

import SafariView from 'react-native-safari-view';

const openURL = (url) => {
  if (Platform.OS === 'ios') {
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

exports.openURL = openURL;
