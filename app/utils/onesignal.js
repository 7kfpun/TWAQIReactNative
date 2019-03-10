import firebase from 'react-native-firebase';
import OneSignal from 'react-native-onesignal';

exports.OneSignalGetTags = () =>
  new Promise((resolve, reject) => {
    try {
      const trace = firebase.perf().newTrace('onesignal_get_tags');
      trace.start();
      OneSignal.getTags((tags) => {
        trace.stop();
        resolve(tags);
      });
    } catch (err) {
      reject(err);
    }
  });
