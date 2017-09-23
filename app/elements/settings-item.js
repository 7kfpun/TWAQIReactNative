import React, { Component, PropTypes } from 'react';
import {
  Platform,
  Slider,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import OneSignal from 'react-native-onesignal';

import tracker from '../utils/tracker';

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
  },
  switchBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 14,
  },
  addressText: {
    fontSize: 14,
    fontWeight: '100',
  },
  noticeText: {
    fontSize: 14,
    fontWeight: '100',
  },
  noticeWarningText: {
    fontSize: 10,
    marginBottom: 15,
  },
});

const DEFAULT_POLLUTION_THERHOLD = 120;
const DEFAULT_CLEANLINESS_THERHOLD = 40;

export default class SettingsItem extends Component {
  state = {
    isOpen: false,
    isEnabled: false,
    pollutionTherhold: DEFAULT_POLLUTION_THERHOLD,
    cleanlinessTherhold: DEFAULT_CLEANLINESS_THERHOLD,
  };

  componentDidMount() {
    const that = this;
    OneSignal.getTags((receivedTags) => {
      console.log(receivedTags);
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
      this.sendTags();
    });

    if (value && Platform.OS === 'ios') {
      permissions = {
        alert: true,
        badge: true,
        sound: true,
      };
      OneSignal.requestPermissions(permissions);
      OneSignal.registerForPushNotifications();
    }

    tracker.logEvent('set-notification', { label: value ? 'on' : 'off' });
  }

  setNotificationPollutionTherhold(value) {
    this.setState({ pollutionTherhold: value });
    this.sendTags();
  }

  setNotificationCleanlinessTherhold(value) {
    this.setState({ cleanlinessTherhold: value });
    this.sendTags();
  }

  sendTags() {
    const item = this.props.item;

    const tags = {};
    tags[item.SiteEngName] = this.state.isEnabled;
    tags[`${item.SiteEngName}_pollution_therhold`] = this.state.isEnabled ? this.state.pollutionTherhold : false;
    tags[`${item.SiteEngName}_cleanliness_therhold`] = this.state.isEnabled ? this.state.cleanlinessTherhold : false;

    console.log('Send tags', tags);
    OneSignal.sendTags(tags);
  }

  render() {
    const item = this.props.item;

    return (
      <View style={styles.container}>
        <View style={styles.switchBlock}>
          <View style={{ flex: 3, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
            <Text style={styles.text}>{item.SiteName}</Text>
            {/* <Text style={styles.addressText}>{` ${item.SiteAddress}`}</Text> */}
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
          <Text style={styles.noticeText}>{'AQI 指數超過'}: {this.state.pollutionTherhold}</Text>
          <Slider
            style={{ width: window.width - 20 }}
            step={1}
            value={this.state.pollutionTherhold}
            minimumValue={1}
            maximumValue={500}
            onValueChange={value => this.setNotificationPollutionTherhold(value)}
          />
          {this.state.pollutionTherhold < DEFAULT_POLLUTION_THERHOLD && <Text style={styles.noticeWarningText}>{'您所設定的值偏低，或會收到很多通知'}</Text>}

          <Text style={styles.noticeText}>{'AQI 指数低于'}: {this.state.cleanlinessTherhold}</Text>
          <Slider
            style={{ width: window.width - 20 }}
            step={1}
            value={this.state.cleanlinessTherhold}
            minimumValue={1}
            maximumValue={500}
            onValueChange={value => this.setNotificationCleanlinessTherhold(value)}
          />
          {this.state.cleanlinessTherhold > DEFAULT_CLEANLINESS_THERHOLD && <Text style={styles.noticeWarningText}>{'您所設定的值偏高，或會收到很多通知'}</Text>}
        </View>}
      </View>
    );
  }
}

SettingsItem.propTypes = {
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
};

SettingsItem.defaultProps = {};
