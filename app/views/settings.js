import React, { Component } from 'react';
import {
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import OneSignal from 'react-native-onesignal';
import store from 'react-native-simple-store';
// import Toast from 'react-native-root-toast';

import locations from '../utils/locations';
// import tracker from '../utils/tracker';
import SettingsItem from '../elements/settings-item';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  close: {
    position: 'absolute',
    right: 15,
    top: 25,
    backgroundColor: 'transparent',
  },
  text: {
    fontSize: 24,
  },
});

function toastShow() {
  OneSignal.checkPermissions((permissions) => {
    console.log('OneSignal permissions', permissions);
    if (!permissions.alert && !permissions.badge && !permissions.sound) {
      Toast.show('permissions_required', { duration: Toast.durations.LONG, position: Toast.positions.BOTTOM - 40 });
    }
  });
}

export default class SettingsView extends Component {
  static navigationOptions = {
    header: null,
    title: 'Settings',
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
      const {
        pollutionIsEnabled,
        pollutionLocation,
        pollutionTherhold,
        cleanlinessIsEnabled,
        cleanlinessLocation,
        cleanlinessTherhold,
      } = receivedTags;

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
    });

    this.prepareLocations();
  }

  prepareLocations() {
    const compare = (a, b) => {
      if (a.County < b.County) {
        return -1;
      }
      if (a.County > b.County) {
        return 1;
      }
      return 0;
    };

    locations().then((result) => {
      console.log('Locations:', result);
      this.setState({ locations: result.sort(compare) });
    });
  }

  popSettings() {
    SettingsView.checkPermissions();
  }

  render() {
    const { goBack } = this.props.navigation;
    // tracker.trackScreenView('Settings');
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={{ paddingTop: 60, paddingLeft: 10 }}>
            <Text style={styles.text}>{'設定通知'}</Text>
          </View>
          <FlatList
            style={{ paddingVertical: 30 }}
            data={this.state.locations}
            keyExtractor={(item, index) => `${index}-${item.key}`}
            renderItem={({ item }) => <SettingsItem item={item} />}
          />
        </ScrollView>

        <TouchableOpacity style={styles.close} onPress={() => { this.popSettings(); goBack(); }} >
          <Icon name="close" size={30} color="gray" />
        </TouchableOpacity>
      </View>
    );
  }
}

SettingsView.propTypes = {
  navigation: React.PropTypes.shape({
    goBack: React.PropTypes.func.isRequired,
  }).isRequired,
};
