import React, { Component } from 'react';
import {
  FlatList,
  StyleSheet,
} from 'react-native';

import firebase from 'react-native-firebase';
import OneSignal from 'react-native-onesignal';

import SettingsItem from '../elements/settings-item';
import locations from '../utils/locations';

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default class EnabledItems extends Component {
  state = {
    isOpen: true,
    locations: [],
  };

  componentDidMount() {
    const that = this;
    OneSignal.getTags((tags) => {
      console.log('OneSignal tags', tags);

      if (tags) {
        const trace = firebase.perf().newTrace('api_get_locations');
        trace.start();
        locations().then((result) => {
          if (result && Array.isArray(result) && result.length > 0) {
            console.log('Locations:', result);

            const enabledItems = result
              .filter(item => tags[item.SiteEngName] && (tags[item.SiteEngName] === true || tags[item.SiteEngName] === 'true')).sort();

            that.setState({ locations: enabledItems });
            console.log('enabledItems', enabledItems);
          }
          trace.stop();
        });
      }
    });
  }

  render() {
    if (!this.state.locations) {
      return null;
    }

    return (<FlatList
      style={styles.container}
      data={this.state.locations}
      keyExtractor={(item, index) => `${index}-${item.key}`}
      renderItem={({ item }) => <SettingsItem item={item} />}
    />);
  }
}
