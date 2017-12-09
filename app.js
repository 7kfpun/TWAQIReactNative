import {
  Platform,
} from 'react-native';

import { StackNavigator, TabNavigator } from 'react-navigation';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import { iOSColors } from 'react-native-typography';

import Main from './app/views/main';
import List from './app/views/list';
import Details from './app/views/details';
import Forecast from './app/views/forecast';
import Settings from './app/views/settings';
import Help from './app/views/help';
// import Contact from './app/views/contact';

import I18n from './app/utils/i18n';

if (!__DEV__) {
  console.log = () => {};
}

const App = TabNavigator({
  Main: {
    screen: StackNavigator({
      MainMap: { screen: Main },
      MainDetails: { screen: Details },
    }),
  },
  History: {
    screen: StackNavigator({
      HistoryList: { screen: List },
      HistoryDetails: { screen: Details },
    }),
  },
  Forecast: { screen: Forecast },
  Settings: { screen: Settings },
  Help: { screen: Help },
  // Contact: { screen: Contact },
}, {
  headerMode: 'none',
  swipeEnabled: false,
  animationEnabled: true,
  tabBarOptions: {
    activeTintColor: iOSColors.tealBlue,
    inactiveTintColor: iOSColors.gray,
    // showIcon and pressColor are for Android
    showIcon: true,
    pressColor: '#E0E0E0',
    labelStyle: {
      fontSize: Platform.OS === 'ios' && I18n.isZh ? 12 : 10,
      paddingBottom: Platform.OS === 'ios' && I18n.isZh ? 4 : 2,
    },
    style: {
      backgroundColor: 'white',
      ...ifIphoneX({
        height: 64,
        paddingBottom: 12,
      }, {}),
    },

  },
});

console.ignoredYellowBox = [
  'NetInfo\'s "change" event is deprecated. Listen to the "connectionChange" event instead.',
  'Warning: Can only update a mounted or mounting component.',
];

module.exports = App;
