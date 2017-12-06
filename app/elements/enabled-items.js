import React, { Component } from 'react';
import {
  FlatList,
  StyleSheet,
} from 'react-native';

import firebase from 'react-native-firebase';
import OneSignal from 'react-native-onesignal';

import SettingsItem from '../elements/settings-item';
import { locations } from '../utils/locations';

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
    const trace = firebase.perf().newTrace('onesignal_get_tags');
    trace.start();
    OneSignal.getTags((tags) => {
      trace.stop();
      console.log('OneSignal tags', tags);

      if (tags) {
        const enabledItems = locations.filter(item => tags[item.SiteEngName] && (tags[item.SiteEngName] === true || tags[item.SiteEngName] === 'true')).sort();
        that.setState({ locations: enabledItems });
        console.log('enabledItems', enabledItems);
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
