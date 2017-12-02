import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import store from 'react-native-simple-store';

import SettingsItem from '../elements/settings-item';

import { countyZh2En } from '../utils/county-mapping';
import locations from '../utils/locations';
import tracker from '../utils/tracker';
import I18n from '../utils/i18n';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  switchBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  groupNameBlock: {
    paddingVertical: 15,
  },
  text: {
    fontSize: 16,
  },
  noticeText: {
    fontSize: 12,
  },
  noticeWarningText: {
    fontSize: 10,
    marginBottom: 15,
  },
  list: {
    paddingVertical: 10,
  },
});

export default class SettingsGroup extends Component {
  static propTypes = {
    groupName: PropTypes.string.isRequired,
  }

  state = {
    isOpen: false,
    locations: [],
  };

  componentDidMount() {
    this.prepareLocations();
  }

  prepareLocations() {
    const that = this;
    const groupName = this.props.groupName;
    store.get('locationsCache').then((locationsCache) => {
      if (locationsCache && locationsCache.length > 0) {
        that.setState({ locations: locationsCache.filter(item => item.County === groupName) });
      }

      locations().then((result) => {
        if (result && result.length > 0) {
          that.setState({ locations: result.filter(item => item.County === groupName) });
        }
      });
    });
  }

  render() {
    const groupName = this.props.groupName;

    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            this.setState({ isOpen: !this.state.isOpen });
            tracker.logEvent('toggle-group', { label: groupName });
          }}
        >
          <View style={styles.groupNameBlock}>
            <Text style={styles.text}>{I18n.isZh ? groupName : countyZh2En[groupName]}</Text>
          </View>
        </TouchableOpacity>
        {this.state.isOpen && <FlatList
          style={styles.list}
          data={this.state.locations}
          keyExtractor={(item, index) => `${index}-${item.key}`}
          renderItem={({ item }) => <SettingsItem item={item} />}
        />}
      </View>
    );
  }
}
