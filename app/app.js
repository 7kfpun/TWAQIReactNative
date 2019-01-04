import React from 'react';
import {
  Platform,
  // YellowBox,
} from 'react-native';

import { iOSColors } from 'react-native-typography';
import {
  createBottomTabNavigator,
  createStackNavigator,
  // createMaterialTopTabNavigator,
} from 'react-navigation';
import firebase from 'react-native-firebase';
import Ionicons from 'react-native-vector-icons/Ionicons';
import OneSignal from 'react-native-onesignal';
import QuickActions from 'react-native-quick-actions';

import Main from './containers/main';
import List from './containers/list';
import Details from './containers/details';
import Forecast from './containers/forecast';
import Settings from './containers/settings';
import Help from './containers/help';
import HelpList from './containers/help-list';

import I18n from './utils/i18n';
import tracker from './utils/tracker';

import { config } from './config';

if (!__DEV__) {
  console.log = () => {};
}

if (__DEV__) {
  firebase.config().enableDeveloperMode();
}

OneSignal.init(config.onesignal, { kOSSettingsKeyAutoPrompt: true });

QuickActions.setShortcutItems([
  {
    type: 'go_to_main',
    title: I18n.t('main'),
    // subtitle: '',
    icon: 'Home', // UIApplicationShortcutIconType<name>
    userInfo: {
      url: 'app://main',
    },
  },
  {
    type: 'go_to_history',
    title: I18n.t('forecast_tab'),
    // subtitle: '',
    icon: 'Date',
    userInfo: {
      url: 'app://forecast',
    },
  },
]);

const navigationOptions = {
  header: null,
};

const MainNavigator = createStackNavigator(
  {
    Main,
    MainDetails: Details,
  },
  {
    navigationOptions,
  }
);

const HistoryNavigator = createStackNavigator(
  {
    HistoryList: List,
    HistoryDetails: Details,
  },
  {
    navigationOptions,
  }
);

const ForecastNavigator = createStackNavigator(
  {
    Forecast,
  },
  {
    navigationOptions,
  }
);

const SettingsNavigator = createStackNavigator(
  {
    Settings,
  },
  {
    navigationOptions,
  }
);

const HelpNavigator = createStackNavigator(
  {
    HelpList,
    HelpAQI: Help,
  },
  {
    navigationOptions,
  }
);

const AppTab = createBottomTabNavigator(
  {
    main: MainNavigator,
    history: HistoryNavigator,
    forecast: ForecastNavigator,
    settings: SettingsNavigator,
    help: HelpNavigator,
  },
  {
    navigationOptions: ({ navigation }) => {
      const { routeName } = navigation.state;
      return {
        tabBarLabel: I18n.t(`tab.${routeName}`),
        tabBarIcon: ({ focused, tintColor }) => {
          let iconName;
          let size = 20;
          if (routeName === 'main') {
            iconName = 'ios-map';
            size = 19;
          } else if (routeName === 'history') {
            iconName = 'ios-list';
            size = 22;
          } else if (routeName === 'forecast') {
            iconName = 'ios-analytics';
          } else if (routeName === 'settings') {
            iconName = 'ios-notifications-outline';
          } else if (routeName === 'help') {
            iconName = 'ios-help-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={tintColor} />;
        },
      };
    },
    tabBarOptions: {
      activeTintColor: iOSColors.tealBlue,
      inactiveTintColor: iOSColors.black,
      labelStyle: {
        fontSize: 10,
        paddingBottom: 2,
        paddingTop: 0,
      },
      // showIcon, pressColor, style and indicatorStyle are for Android
      // (createMaterialTopTabNavigator)
      showIcon: true,
      pressColor: '#E0E0E0',
      style: {
        backgroundColor: 'white',
      },
      indicatorStyle: {
        ...Platform.select({
          ios: {
            backgroundColor: iOSColors.white,
          },
          android: {
            backgroundColor: iOSColors.tealBlue,
          },
        }),
      },
    },
    tabBarPosition: 'bottom',
  }
);

// const App = TabNavigator({
//   Home: {
//     screen: StackNavigator({
//       Main: { screen: Main },
//       MainDetails: { screen: Details },
//     }),
//   },
//   History: {
//     screen: StackNavigator({
//       HistoryList: { screen: List },
//       HistoryDetails: { screen: Details },
//     }),
//   },
//   Forecast: { screen: Forecast },
//   Settings: { screen: Settings },
//   Help: {
//     screen: StackNavigator({
//       HelpList: { screen: HelpList },
//       HelpAQI: { screen: Help },
//     }),
//   },
// }, {
//   headerMode: 'none',
//   swipeEnabled: false,
//   animationEnabled: true,
//   tabBarOptions: {
//     activeTintColor: iOSColors.tealBlue,
//     inactiveTintColor: iOSColors.black,
//     // showIcon and pressColor are for Android
//     showIcon: true,
//     pressColor: '#E0E0E0',
//     labelStyle: {
//       fontSize: Platform.OS === 'ios' && I18n.isZh ? 12 : 9,
//       paddingBottom: Platform.OS === 'ios' && I18n.isZh ? 4 : 0,
//     },
//     style: {
//       backgroundColor: 'white',
//     },
//   },
//   tabBarPosition: 'bottom',
// });

console.ignoredYellowBox = [
  "Module RCTOneSignalEventEmitter requires main queue setup since it overrides `init` but doesn't implement `requiresMainQueueSetup`.",
  "Module RCTImageLoader requires main queue setup since it overrides `init` but doesn't implement `requiresMainQueueSetup`.",
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
  <AppTab
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
