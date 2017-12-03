import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  Platform,
  Slider,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import OneSignal from 'react-native-onesignal';

import { indexRanges } from '../utils/indexes';
import I18n from '../utils/i18n';
import tracker from '../utils/tracker';

import Marker from '../elements/marker';

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
  },
  switchBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 16,
  },
  noticeBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8,
  },
  noticeText: {
    fontSize: 14,
    fontWeight: '100',
  },
  noticeDescriptionText: {
    fontSize: 12,
    fontWeight: '100',
  },
  noticeWarningText: {
    fontSize: 10,
    paddingTop: 8,
    paddingBottom: 15,
  },
});

const DEFAULT_POLLUTION_THERHOLD = 120;
const DEFAULT_CLEANLINESS_THERHOLD = 40;

export default class SettingsItem extends Component {
  static propTypes = {
    item: PropTypes.shape({
      SiteName: PropTypes.string,
      SiteEngName: PropTypes.string,
      AreaName: PropTypes.string,
      County: PropTypes.string,
      Township: PropTypes.string,
      SiteAddress: PropTypes.string,
      TWD97Lon: PropTypes.string,
      TWD97Lat: PropTypes.string,
      SiteType: PropTypes.string,
    }).isRequired,
  }

  state = {
    isOpen: false,
    isEnabled: false,
    pollutionTherhold: DEFAULT_POLLUTION_THERHOLD,
    cleanlinessTherhold: DEFAULT_CLEANLINESS_THERHOLD,
    switchSelector: 0,
  };

  componentDidMount() {
    const that = this;
    OneSignal.getTags((tags) => {
      console.log('OneSignal tags', tags);
      receivedTags = tags || {};
      const item = this.props.item;

      that.setState({
        isEnabled: receivedTags[item.SiteEngName] === 'true',
        pollutionTherhold: receivedTags[`${item.SiteEngName}_pollution_therhold`] ? parseInt(receivedTags[`${item.SiteEngName}_pollution_therhold`], 10) : DEFAULT_POLLUTION_THERHOLD,
        cleanlinessTherhold: receivedTags[`${item.SiteEngName}_cleanliness_therhold`] ? parseInt(receivedTags[`${item.SiteEngName}_cleanliness_therhold`], 10) : DEFAULT_CLEANLINESS_THERHOLD,
      });
    });
  }

  setNotification(value) {
    this.setState({ isEnabled: value }, () => {
      this.sendTags(value);

      if (value && Platform.OS === 'ios') {
        permissions = {
          alert: true,
          badge: true,
          sound: true,
        };
        OneSignal.requestPermissions(permissions);
        OneSignal.registerForPushNotifications();
      }
    });
  }

  setNotificationPollutionTherhold(value) {
    this.setState({ pollutionTherhold: value }, () => {
      this.sendTags(true);
    });
  }

  setNotificationCleanlinessTherhold(value) {
    this.setState({ cleanlinessTherhold: value }, () => {
      this.sendTags(true);
    });
  }

  sendTags(value) {
    const item = this.props.item;

    const tags = {};
    tags[item.SiteEngName] = value;
    tags[`${item.SiteEngName}_pollution_therhold`] = value ? this.state.pollutionTherhold : false;
    tags[`${item.SiteEngName}_cleanliness_therhold`] = value ? this.state.cleanlinessTherhold : false;

    console.log('Send tags', tags);
    OneSignal.sendTags(tags);

    tracker.logEvent('set-notification', { label: value ? 'on' : 'off', ...tags });
  }

  showPollutionSelector() {
    Alert.alert(
      I18n.t('notify_pollution_therhold'),
      I18n.t('notify_pollution_title'),
      [
        { text: I18n.t('cancel'), onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        ...indexRanges.AQI.map(item => ({
          text: `${item.status} (${item.min})`,
          onPress: () => {
            this.setState({ pollutionTherhold: item.min }, () => {
              this.setNotificationPollutionTherhold(item.min);
            });
          },
        })),
      ],
      { cancelable: true },
    );
  }

  showCleanlinessSelector() {
    Alert.alert(
      I18n.t('notify_cleanliness_therhold'),
      I18n.t('notify_cleanliness_title'),
      [
        { text: I18n.t('cancel'), onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        ...indexRanges.AQI.map(item => ({
          text: `${item.status} (${item.max})`,
          onPress: () => {
            this.setState({ cleanlinessTherhold: item.max }, () => {
              this.setNotificationCleanlinessTherhold(item.max);
            });
          },
        })),
      ],
      { cancelable: true },
    );
  }

  render() {
    const item = this.props.item;

    return (
      <View style={styles.container}>
        <View style={styles.switchBlock}>
          <View style={{ flex: 3, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
            <Text style={styles.text}>{I18n.isZh ? item.SiteName : item.SiteEngName}</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
            <Switch
              onValueChange={value => this.setNotification(value)}
              value={this.state.isEnabled}
              tintColor="white"
            />
          </View>
        </View>

        {this.state.isEnabled && <View style={{ paddingTop: 10 }}>
          <View style={styles.noticeBlock}>
            <Text style={styles.noticeText}>{I18n.t('notify_pollution_therhold')}: </Text>
            <TouchableOpacity onPress={() => this.showPollutionSelector()}>
              <Marker
                amount={this.state.pollutionTherhold.toString()}
                index={'AQI'}
                isStatusShow={true}
                fontSize={14}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.noticeDescriptionText}>({I18n.t('notify_pollution_title')})</Text>
          <Slider
            style={{ width: window.width - 20 }}
            step={1}
            value={this.state.pollutionTherhold}
            minimumValue={1}
            maximumValue={500}
            onValueChange={value => this.setNotificationPollutionTherhold(value)}
          />
          {this.state.pollutionTherhold < DEFAULT_POLLUTION_THERHOLD && <Text style={styles.noticeWarningText}>{I18n.t('too_small_therhold')}</Text>}

          <View style={styles.noticeBlock}>
            <Text style={styles.noticeText}>{I18n.t('notify_cleanliness_therhold')}: </Text>
            <TouchableOpacity onPress={() => this.showCleanlinessSelector()}>
              <Marker
                amount={this.state.cleanlinessTherhold.toString()}
                index={'AQI'}
                isStatusShow={true}
                fontSize={14}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.noticeDescriptionText}>({I18n.t('notify_cleanliness_title')})</Text>
          <Slider
            style={{ width: window.width - 20 }}
            step={1}
            value={this.state.cleanlinessTherhold}
            minimumValue={1}
            maximumValue={500}
            onValueChange={value => this.setNotificationCleanlinessTherhold(value)}
          />
          {this.state.cleanlinessTherhold > DEFAULT_CLEANLINESS_THERHOLD && <Text style={styles.noticeWarningText}>{I18n.t('too_large_therhold')}</Text>}
        </View>}
      </View>
    );
  }
}
