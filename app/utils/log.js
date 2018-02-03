import { Crashlytics } from 'react-native-fabric';
import firebase from 'react-native-firebase';

import {
  Platform,
} from 'react-native';

const log = {
  log: () => {
  },
  logError: (message, error) => {
    console.log('logError', message);
    if (Platform.OS === 'ios') {
      Crashlytics.recordError(message);
    } else {
      Crashlytics.logException('');
    }
    firebase.crash().log(message);
    firebase.crash().report(error);
  },
};

export default log;
