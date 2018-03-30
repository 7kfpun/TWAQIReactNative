import React from 'react';
import {
  Platform,
  // YellowBox,
} from 'react-native';

import { StackNavigator, TabNavigator } from 'react-navigation';
import { iOSColors } from 'react-native-typography';
import QuickActions from 'react-native-quick-actions';

import Main from './app/views/main';
import List from './app/views/list';
import Details from './app/views/details';
import Forecast from './app/views/forecast';
import Settings from './app/views/settings';
import Help from './app/views/help';
// import Contact from './app/views/contact';

import I18n from './app/utils/i18n';
import tracker from './app/utils/tracker';

if (!__DEV__) {
  console.log = () => {};
}

QuickActions.setShortcutItems([{
  type: 'go_to_main',
  title: I18n.t('main'),
  // subtitle: '',
  icon: 'Home', // UIApplicationShortcutIconType<name>
  userInfo: {
    url: 'app://main',
  },
}, {
  type: 'go_to_history',
  title: I18n.t('forecast'),
  // subtitle: '',
  icon: 'Date',
  userInfo: {
    url: 'app://forecast',
  },
}]);

const App = TabNavigator({
  Home: {
    screen: StackNavigator({
      Main: { screen: Main },
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
    inactiveTintColor: iOSColors.black,
    // showIcon and pressColor are for Android
    showIcon: true,
    pressColor: '#E0E0E0',
    labelStyle: {
      fontSize: Platform.OS === 'ios' && I18n.isZh ? 12 : 9,
      paddingBottom: Platform.OS === 'ios' && I18n.isZh ? 4 : 0,
    },
    style: {
      backgroundColor: 'white',
    },
  },
  tabBarPosition: 'bottom',
});

console.ignoredYellowBox = [
  'Module RCTOneSignalEventEmitter requires main queue setup since it overrides `init` but doesn\'t implement `requiresMainQueueSetup`.',
  'Module RCTImageLoader requires main queue setup since it overrides `init` but doesn\'t implement `requiresMainQueueSetup`.',
  'Warning: componentWillReceiveProps is deprecated and will be removed in the next major version.',
  'Warning: componentWillMount is deprecated and will be removed in the next major version.',
  'Warning: componentWillUpdate is deprecated and will be removed in the next major version.',
  'Warning: isMounted(...) is deprecated in plain JavaScript React classes.',
  'Setting a timer for a long period of time',
];

// gets the current screen from navigation state
function getCurrentRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getCurrentRouteName(route);
  }
  return route.routeName;
}

export default () => (
  <App
    onNavigationStateChange={(prevState, currentState) => {
      const currentScreen = getCurrentRouteName(currentState);
      const prevScreen = getCurrentRouteName(prevState);

      if (prevScreen !== currentScreen) {
        console.log(currentScreen);
        tracker.view(currentScreen);
      }
    }}
  />
);
