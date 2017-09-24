import {
  Platform,
} from 'react-native';

import { AdMobInterstitial } from 'react-native-admob';
import { TabNavigator } from 'react-navigation';

import Main from './app/views/main';
import Help from './app/views/help';
import Settings from './app/views/settings';

import { config } from './app/config';

AdMobInterstitial.setAdUnitID(config.admob[Platform.OS].interstital);

if (!__DEV__) {
  console.log = () => {};
}

const App = TabNavigator({
  Main: { screen: Main },
  Settings: { screen: Settings },
  Help: { screen: Help },
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
    },

  },
});

console.ignoredYellowBox = [
  'NetInfo\'s "change" event is deprecated. Listen to the "connectionChange" event instead.',
  'Warning: Can only update a mounted or mounting component.',
];

module.exports = App;
