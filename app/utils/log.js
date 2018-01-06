import { Crashlytics } from 'react-native-fabric';
import firebase from 'react-native-firebase';

const log = {
  log: () => {
  },
  logError: (message, err) => {
    console.log('logError', message);
    Crashlytics.recordError(message);
    firebase.crash().log(message);
    firebase.crash().report(err);
  },
};

export default log;
