import {
  Platform,
} from 'react-native';

import { AdMobInterstitial } from 'react-native-admob';
import { TabNavigator } from 'react-navigation';
import { ifIphoneX } from 'react-native-iphone-x-helper';

import Main from './app/views/main';
import Help from './app/views/help';
import Settings from './app/views/settings';
import Contact from './app/views/contact';

import { config } from './app/config';

AdMobInterstitial.setAdUnitID(config.admob[Platform.OS].interstital);

if (!__DEV__) {
  console.log = () => {};
}

const App = TabNavigator({
  Main: { screen: Main },
  Settings: { screen: Settings },
  Help: { screen: Help },
  Contact: { screen: Contact },
}, {
  headerMode: 'none',
  swipeEnabled: true,
  animationEnabled: true,
  tabBarOptions: {
    activeTintColor: '#29B6F6',
    inactiveTintColor: 'gray',
    // showIcon and pressColor are for Android
    showIcon: true,
    pressColor: '#E0E0E0',
    labelStyle: {
      fontSize: 13,
      paddingBottom: Platform.OS === 'ios' ? 4 : 0,
    },
    style: {
      backgroundColor: 'white',
      ...ifIphoneX({
        height: 80,
        paddingBottom: 25,
      }, {}),
    },

  },
});

console.ignoredYellowBox = [
  'NetInfo\'s "change" event is deprecated. Listen to the "connectionChange" event instead.',
  'Warning: Can only update a mounted or mounting component.',
];

module.exports = App;
