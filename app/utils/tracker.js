import {
  Dimensions,
  PixelRatio,
} from 'react-native';

import Analytics from 'analytics-react-native';
import DeviceInfo from 'react-native-device-info';
import firebase from 'react-native-firebase';

import { config } from '../config';

const { width, height } = Dimensions.get('window');
const analytics = new Analytics(config.segment);
firebase.analytics().setAnalyticsCollectionEnabled(true);

const userId = DeviceInfo.getUniqueID();

const isTracking = !(
  __DEV__
  // || DeviceInfo.getDeviceName().includes('kf')
  // || DeviceInfo.getManufacturer() === 'Genymotion'
  || DeviceInfo.isEmulator()
);

const context = {
  app: {
    namespace: DeviceInfo.getBundleId(),
    version: DeviceInfo.getBuildNumber(),
    build: DeviceInfo.getReadableVersion(),
  },
  device: {
    id: DeviceInfo.getUniqueID(),
    manufacturer: DeviceInfo.getManufacturer(),
    model: DeviceInfo.getModel(),
    name: DeviceInfo.getDeviceId(),
    type: DeviceInfo.getDeviceName(),
    version: DeviceInfo.getBrand(),
    brand: DeviceInfo.getBrand(),
  },
  locale: DeviceInfo.getDeviceLocale(),
  location: {
    country: DeviceInfo.getDeviceCountry(),
  },
  os: {
    name: DeviceInfo.getSystemName(),
    version: DeviceInfo.getSystemVersion(),
  },
  screen: {
    width,
    height,
    density: PixelRatio.get(),
  },
  timezone: DeviceInfo.getTimezone(),
  userAgent: DeviceInfo.getUserAgent(),

  instanceid: DeviceInfo.getInstanceID(),
  isEmulator: DeviceInfo.isEmulator(),
  isTablet: DeviceInfo.isTablet(),
};

const firebaseContext = {};
Object.entries(context).forEach(([key, value]) => {
  console.log(key, value);
  if (typeof value === 'object') {
    Object.entries(value).forEach(([k, v]) => {
      firebaseContext[`${key}.${k}`] = String(v);
    });
  } else {
    firebaseContext[key] = String(value);
  }
});
console.log('firebaseContext', firebaseContext);

const tracker = {
  identify: async () => {
    if (isTracking) {
      const ip = await fetch('http://checkip.amazonaws.com/')
        .then(res => res.text())
        .then(ipText => ipText.replace('\n', ''))
        .catch(err => console.log(err));

      if (ip) {
        console.log('IP address', ip);
        context.ip = ip;
      }
      analytics.identify({ userId, context });
      firebase.analytics().setUserId(userId);
      firebase.analytics().setUserProperties(firebaseContext);
    }
  },
  logEvent: (event, properties) => {
    if (isTracking) {
      const message = { userId, event, properties, context };
      console.log(message);
      analytics.track(message);
      firebase.analytics().logEvent(event.replace(/-/g, '_'), properties);
    }
  },
  view: (screen, properties) => {
    if (isTracking) {
      const message = { userId, screen, properties, context };
      console.log(message);
      analytics.screen(message);
      firebase.analytics().setCurrentScreen(screen, screen);
    }
  },
};

tracker.identify();

export default tracker;
