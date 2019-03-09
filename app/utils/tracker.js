import { Dimensions, PixelRatio } from 'react-native';

import { Answers } from 'react-native-fabric';
import Analytics from 'analytics-react-native';
import DeviceInfo from 'react-native-device-info';
import firebase from 'react-native-firebase';

import { config } from '../config';

const { width, height } = Dimensions.get('window');
const analytics = new Analytics(config.segment);
firebase.analytics().setAnalyticsCollectionEnabled(true);
firebase.perf().setPerformanceCollectionEnabled(true);

const userId = DeviceInfo.getUniqueID();

const isTracking = !(
  __DEV__ ||
  // || DeviceInfo.getDeviceName().includes('kf')
  DeviceInfo.getManufacturer() === 'Genymotion' ||
  DeviceInfo.isEmulator()
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

const capitalizeFirstLetter = string =>
  string.charAt(0).toUpperCase() + string.slice(1);

const firebaseContext = {};
Object.entries(context).forEach(([key0, value0]) => {
  if (typeof value0 === 'object') {
    Object.entries(value0).forEach(([key1, value1]) => {
      firebaseContext[`${key0}${capitalizeFirstLetter(key1)}`] = String(value1);
    });
  } else {
    firebaseContext[key0] = String(value0);
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
      console.log('identify', userId, context);
      analytics.identify({ userId, context });
      firebase.analytics().setUserId(userId);
      firebase.analytics().setUserProperties(firebaseContext);
    }
  },
  logEvent: (event, properties) => {
    if (isTracking) {
      const message = {
        userId,
        event,
        properties,
        context,
      };
      console.log('logEvent', message);
      analytics.track(message);
      firebase.analytics().logEvent(event.replace(/-/g, '_'), properties);
      Answers.logCustom(event, properties);
    }
  },
  view: (screen, properties) => {
    if (isTracking) {
      const message = {
        userId,
        name: screen,
        properties,
        context,
      };
      console.log('view', message);
      analytics.screen(message);
      firebase.analytics().setCurrentScreen(screen, screen);
      Answers.logContentView(screen, '', '', properties);
    }
  },
  logPurchase: (
    itemPrice,
    currency,
    success,
    itemName,
    itemType,
    itemId,
    properties
  ) => {
    Answers.logPurchase(
      itemPrice,
      currency,
      success,
      itemName,
      itemType,
      itemId,
      properties
    );
  },
};

tracker.identify();

export default tracker;
