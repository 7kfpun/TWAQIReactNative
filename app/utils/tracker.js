// import { Answers } from 'react-native-fabric';
import DeviceInfo from 'react-native-device-info';

const isTracking = !(
  __DEV__
  || DeviceInfo.getDeviceName().includes('kf')
  || DeviceInfo.getManufacturer() === 'Genymotion'
  || DeviceInfo.isEmulator()
);

console.log('isTracking', isTracking);

const tracker = {
  logEvent: (eventName, properties) => {
    if (isTracking) {
      Answers.logCustom(event, properties);
    }
  },
  view: (screenName, properties) => {
    if (isTracking) {
      Answers.logContentView(screenName, '', '', properties);
    }
  },
};

export default tracker;
