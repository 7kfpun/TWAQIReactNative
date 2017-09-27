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

import AdMob from '../elements/admob';
import SettingsGroup from '../elements/settings-group';

import I18n from '../utils/i18n';
import locations from '../utils/locations';
import tracker from '../utils/tracker';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  titleBlock: {
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingLeft: 10,
    paddingBottom: 10,
  },
  titleText: {
    fontSize: 24,
    color: 'black',
  },
  permissionReminderBlock: {
    backgroundColor: '#3949AB',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 1,
  },
  permissionReminderText: {
    fontSize: 12,
    color: 'white',
  },
  list: {
    paddingVertical: 30,
  },
});

const OneSignalGetTags = () => new Promise((resolve, reject) => {
  try {
    OneSignal.getTags(tags => resolve(tags));
  } catch (err) {
    reject(err);
  }
});

export default class SettingsView extends Component {
  static navigationOptions = {
    header: null,
    title: 'Settings',
    tabBarLabel: I18n.t('settings'),
    tabBarIcon: ({ tintColor }) => (
      <Icon name="notifications-none" size={21} color={tintColor || 'gray'} />
    ),
  };

  static migrateOldSettings(receivedTags) {
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
  }

  state = {
    locations: [],
    isShowPermissionReminderBlock: false,
  };

  async componentDidMount() {
    this.prepareLocations();

    const tags = await OneSignalGetTags();
    this.checkPermissions(tags);
    SettingsView.migrateOldSettings(tags);
  }

  checkPermissions(tags) {
    if (Platform.OS === 'ios' && tags && Object.values(tags).indexOf('true') !== -1) {
      OneSignal.checkPermissions((permissions) => {
        console.log('checkPermissions', permissions);
        if (!permissions || (permissions && !permissions.alert)) {
          this.setState({ isShowPermissionReminderBlock: true });
        }
      });
    }
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
    };

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

  render() {
    tracker.view('Main');

    return (
      <View style={styles.container}>
        <View style={styles.titleBlock}>
          <Text style={styles.titleText}>{I18n.t('notify_title')}</Text>
        </View>
        {this.state.isShowPermissionReminderBlock && <View style={styles.permissionReminderBlock}>
          <Text style={styles.permissionReminderText}>{I18n.t('permissions_required')}</Text>
        </View>}
        <ScrollView>
          <FlatList
            style={styles.list}
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
