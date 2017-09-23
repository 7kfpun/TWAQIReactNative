import {
  Dimensions,
  PixelRatio,
} from 'react-native';

// import { Answers } from 'react-native-fabric';
import Analytics from 'analytics-react-native';
import DeviceInfo from 'react-native-device-info';

import { config } from '../config';

const { width, height } = Dimensions.get('window');

const analytics = new Analytics(config.segment);

const userId = DeviceInfo.getUniqueID();

const isTracking = true || !(
  __DEV__
  || DeviceInfo.getDeviceName().includes('kf')
  || DeviceInfo.getManufacturer() === 'Genymotion'
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

const tracker = {
  identify: () => {
    if (isTracking) {
      fetch('http://checkip.amazonaws.com/')
        .then(res => res.text())
        .then((ip) => {
          ip = ip.replace('\n', '');
          if (ip) {
            console.log('ip address', ip);
            context.ip = ip;
          }
          analytics.identify({ userId, context });
        });
    }
  },
  logEvent: (event, properties) => {
    if (isTracking) {
      const message = { userId, event, properties, context };
      console.log(message);
      analytics.track(message);
      // Answers.logCustom(event, properties);
    }
  },
  view: (screen, properties) => {
    if (isTracking) {
      const message = { userId, screen, properties, context };
      console.log(message);
      analytics.screen(message);
      // Answers.logContentView(screen, '', '', properties);
    }
  },
};

tracker.identify();

export default tracker;
