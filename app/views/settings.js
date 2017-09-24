import React, { Component } from 'react';
import {
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import OneSignal from 'react-native-onesignal';
import store from 'react-native-simple-store';
// import Toast from 'react-native-root-toast';

import AdMob from '../elements/admob';
import locations from '../utils/locations';
import tracker from '../utils/tracker';
import SettingsGroup from '../elements/settings-group';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  titleBlock: {
    paddingTop: 60,
    paddingLeft: 10,
    marginBottom: 20,
  },
  text: {
    fontSize: 24,
  },
});

function toastShow() {
  OneSignal.checkPermissions((permissions) => {
    console.log('OneSignal permissions', permissions);
    if (!permissions.alert && !permissions.badge && !permissions.sound) {
      // Toast.show('permissions_required', { duration: Toast.durations.LONG, position: Toast.positions.BOTTOM - 40 });
    }
  });
}

export default class SettingsView extends Component {
  static navigationOptions = {
    header: null,
    title: 'Settings',
    tabBarLabel: '通知設定',
    tabBarIcon: ({ tintColor }) => (
      <Icon name="notifications-none" size={21} color={tintColor || 'gray'} />
    ),
  };

  static checkPermissions() {
    if (Platform.OS === 'ios') {
      store.get('notificationPollutionIsEnabled').then((notificationPollutionIsEnabled) => {
        if (notificationPollutionIsEnabled) {
          toastShow();
        } else {
          store.get('notificationCleanlinessIsEnabled').then((notificationCleanlinessIsEnabled) => {
            if (notificationCleanlinessIsEnabled) {
              toastShow();
            }
          });
        }
      });
    }
  }

  state = {
    locations: [],
  };

  componentDidMount() {
    SettingsView.checkPermissions();

    OneSignal.getTags((receivedTags) => {
      console.log('OneSignal tags', receivedTags);
      try {
        const {
          pollutionIsEnabled,
          pollutionLocation,
          pollutionTherhold,
          cleanlinessIsEnabled,
          cleanlinessLocation,
          cleanlinessTherhold,
        } = receivedTags || {};

        const tags = {};

        if (pollutionIsEnabled === 'true' && pollutionLocation) {
          const valueLocation = pollutionLocation.replace('/', '_').replace(' ', '_').toLowerCase();
          tags[valueLocation] = true;
          tags[`${valueLocation}_pollution_therhold`] = pollutionTherhold || 100;
        }

        if (cleanlinessIsEnabled === 'true' && cleanlinessLocation) {
          const valueLocation = cleanlinessLocation.replace('/', '_').replace(' ', '_').toLowerCase();
          tags[valueLocation] = true;
          tags[`${valueLocation}_pollution_therhold`] = cleanlinessTherhold || 40;
        }

        console.log('Send tags', tags);
        OneSignal.sendTags(tags);
        OneSignal.deleteTag('pollutionIsEnabled');
        OneSignal.deleteTag('pollutionLocation');
        OneSignal.deleteTag('pollutionTherhold');
        OneSignal.deleteTag('cleanlinessIsEnabled');
        OneSignal.deleteTag('cleanlinessLocation');
        OneSignal.deleteTag('cleanlinessTherhold');
      } catch (err) {
        console.log('No previous tags', err);
      }
    });

    this.prepareLocations();
  }

  prepareLocations() {
    function uniq(a) {
      const seen = {};
      const out = [];
      const len = a.length;
      let j = 0;
      for (let i = 0; i < len; i += 1) {
        const item = a[i];
        if (seen[item] !== 1) {
          seen[item] = 1;
          out[j++] = item;
        }
      }
      return out;
    }

    const compare = (a, b) => {
      if (a.TWD97Lat > b.TWD97Lat) {
        return -1;
      }
      if (a.TWD97Lat < b.TWD97Lat) {
        return 1;
      }
      return 0;
    }

    const that = this;
    store.get('locationsCache').then((locationsCache) => {
      if (locationsCache && locationsCache.length > 0) {
        const countys = uniq(locationsCache.sort(compare).map(item => item.County));
        that.setState({ locations: countys });
      }


      locations().then((result) => {
        if (result && result.length > 0) {
          console.log('Locations:', result);
          const countys = uniq(result.sort(compare).map(item => item.County));
          that.setState({ locations: countys });
        }
      });
    });
  }

  popSettings() {
    SettingsView.checkPermissions();
  }

  render() {
    tracker.view('Main');

    return (
      <View style={styles.container}>
        <View style={styles.titleBlock}>
          <Text style={styles.text}>{'通知設定'}</Text>
        </View>
        <ScrollView>
          <FlatList
            style={{ paddingVertical: 30 }}
            data={this.state.locations}
            keyExtractor={(item, index) => `${index}-${item.key}`}
            renderItem={({ item }) => <SettingsGroup groupName={item} />}
          />
        </ScrollView>
        <AdMob />
      </View>
    );
  }
}
