import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { iOSColors } from 'react-native-typography';

import SettingsItem from '../elements/settings-item';

import { countyZh2En } from '../utils/county-mapping';
import { locations } from '../utils/locations';
import { OneSignalGetTags } from '../utils/onesignal';
import I18n from '../utils/i18n';
import tracker from '../utils/tracker';

const styles = StyleSheet.create({
  container: {
    marginLeft: 10,
    paddingRight: 10,
    borderBottomColor: '#EEEEEE',
    borderBottomWidth: 1,
  },
  switchBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  groupNameBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  countBubble: {
    marginRight: 4,
    borderWidth: 1,
    width: 30,
    height: 24,
    borderRadius: 20,
    borderColor: iOSColors.tealBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countBubbleText: {
    fontWeight: '300',
    fontSize: 12,
  },
  text: {
    fontWeight: '600',
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
    locations: [],
    isOpen: false,
  };

  componentDidMount() {
    this.loadEnabledItems();
    this.prepareLocations();
  }

  prepareLocations() {
    this.setState({ locations: locations.filter(item => item.County === this.props.groupName).sort() });
  }

  async loadEnabledItems() {
    const tags = await OneSignalGetTags();
    if (tags) {
      this.setState({
        enabledCount: locations
          .filter(item => item.County === this.props.groupName)
          .filter(item => tags[item.SiteEngName] === 'true')
          .length,
      });
    }
  }

  render() {
    const { groupName } = this.props;

    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            this.setState({ isOpen: !this.state.isOpen });
            tracker.logEvent('toggle-settings-group', { label: groupName });
          }}
        >
          <View style={styles.groupNameBlock}>
            <Text style={styles.text}>{I18n.isZh ? groupName : countyZh2En[groupName]}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {this.state.enabledCount > 0 &&
                <View style={styles.countBubble}>
                  <Text style={styles.countBubbleText}>{this.state.enabledCount}</Text>
                </View>}
              <Icon name={this.state.isOpen ? 'keyboard-arrow-down' : 'chevron-right'} size={21} color="gray" />
            </View>
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
