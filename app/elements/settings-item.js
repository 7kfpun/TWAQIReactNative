import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  Platform,
  Slider,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { iOSColors } from 'react-native-typography';
import OneSignal from 'react-native-onesignal';

import { indexRanges } from '../utils/indexes';
import { OneSignalGetTags } from '../utils/onesignal';
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
  siteNameBlock: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  switch: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  text: {
    fontSize: 16,
  },
  input: {
    width: 50,
    borderBottomColor: iOSColors.midGray,
    borderBottomWidth: 1,
    textAlign: 'center',
    marginRight: 10,
    height: 22,
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

const DEFAULT_POLLUTION_THERHOLD = 100;
const DEFAULT_CLEANLINESS_THERHOLD = 30;

export default class SettingsItem extends Component {
  static propTypes = {
    text: PropTypes.string,
    tags: PropTypes.shape({}),
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
    increaseEnabledCount: PropTypes.func,
    descreaseEnabledCount: PropTypes.func,
  }

  static defaultProps = {
    text: '',
    tags: {},
    increaseEnabledCount: () => console.log(),
    descreaseEnabledCount: () => console.log(),
  }

  state = {
    isEnabled: false,
    pollutionTherhold: DEFAULT_POLLUTION_THERHOLD,
    cleanlinessTherhold: DEFAULT_CLEANLINESS_THERHOLD,
  };

  componentDidMount() {
    this.loadEnabledItems();
  }

  setNotification(value) {
    const { increaseEnabledCount, descreaseEnabledCount } = this.props;

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

    if (value) {
      increaseEnabledCount();
    } else {
      descreaseEnabledCount();
    }

    tracker.logEvent('set-notification-on-off', { label: value ? 'on' : 'off' });
  }

  setNotificationPollutionTherhold(value) {
    let tempValue = parseInt(value, 10) || 0;
    if (!value || value <= 0) {
      tempValue = 0;
    } if (value > 500) {
      tempValue = 500;
    }

    this.setState({ pollutionTherhold: tempValue }, () => {
      this.sendTags(true);
    });
  }

  setNotificationCleanlinessTherhold(value) {
    let tempValue = parseInt(value, 10) || 0;
    if (!value || value <= 0) {
      tempValue = 0;
    } if (value > 500) {
      tempValue = 500;
    }

    this.setState({ cleanlinessTherhold: tempValue }, () => {
      this.sendTags(true);
    });
  }

  async loadEnabledItems() {
    const { item, tags, text } = this.props;
    if (tags) {
      this.setState({
        isEnabled: tags[item.SiteEngName] === 'true',
        pollutionTherhold: tags[`${item.SiteEngName}_pollution_therhold`] ? parseInt(tags[`${item.SiteEngName}_pollution_therhold`], 10) : DEFAULT_POLLUTION_THERHOLD,
        cleanlinessTherhold: tags[`${item.SiteEngName}_cleanliness_therhold`] ? parseInt(tags[`${item.SiteEngName}_cleanliness_therhold`], 10) : DEFAULT_CLEANLINESS_THERHOLD,
      });
    }

    if (text) {
      const onesignalTags = await OneSignalGetTags();
      if (onesignalTags) {
        this.setState({
          isEnabled: onesignalTags[item.SiteEngName] === 'true',
          pollutionTherhold: onesignalTags[`${item.SiteEngName}_pollution_therhold`] ? parseInt(onesignalTags[`${item.SiteEngName}_pollution_therhold`], 10) : DEFAULT_POLLUTION_THERHOLD,
          cleanlinessTherhold: onesignalTags[`${item.SiteEngName}_cleanliness_therhold`] ? parseInt(onesignalTags[`${item.SiteEngName}_cleanliness_therhold`], 10) : DEFAULT_CLEANLINESS_THERHOLD,
        });
      }
    }
  }

  sendTags(value) {
    const { item } = this.props;

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
      `(${I18n.t('notify_pollution_title')})`,
      [
        {
          text: I18n.t('cancel'),
          onPress: () => tracker.logEvent('pollution-selector', { label: 'cancel' }),
          style: 'cancel',
        },
        ...indexRanges.AQI.map(item => ({
          text: `${item.status} (${item.min})`,
          onPress: () => {
            this.setState({ pollutionTherhold: item.min }, () => {
              this.setNotificationPollutionTherhold(item.min);
            });
            tracker.logEvent('pollution-selector', { label: item.status });
          },
        })),
      ],
      { cancelable: true },
    );
  }

  showCleanlinessSelector() {
    Alert.alert(
      I18n.t('notify_cleanliness_therhold'),
      `(${I18n.t('notify_cleanliness_title')})`,
      [
        {
          text: I18n.t('cancel'),
          onPress: () => tracker.logEvent('cleanliness-selector', { label: 'cancel' }),
          style: 'cancel',
        },
        ...indexRanges.AQI.map(item => ({
          text: `${item.status} (${item.max})`,
          onPress: () => {
            this.setState({ cleanlinessTherhold: item.max }, () => {
              this.setNotificationCleanlinessTherhold(item.max);
            });
            tracker.logEvent('cleanliness-selector', { label: item.status });
          },
        })),
      ],
      { cancelable: true },
    );
  }

  render() {
    const { item, text } = this.props;
    let title;
    if (text) {
      title = text;
    } else {
      title = I18n.isZh ? item.SiteName : item.SiteEngName;
    }

    return (
      <View style={styles.container}>
        <View style={styles.switchBlock}>
          <View style={styles.siteNameBlock}>
            <Text style={styles.text}>{title}</Text>
          </View>
          <View style={styles.switch}>
            <Switch
              onValueChange={value => this.setNotification(value)}
              value={this.state.isEnabled}
              tintColor="#EEEEEE"
            />
          </View>
        </View>

        {this.state.isEnabled &&
          <View style={{ paddingTop: 10 }}>
            <View style={styles.noticeBlock}>
              <Text style={styles.noticeText}>{I18n.t('notify_pollution_therhold')}: </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {Platform.OS === 'ios' &&
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    onChangeText={(value) => {
                      this.setNotificationPollutionTherhold(value);
                      tracker.logEvent('pollution-textinput', item);
                    }}
                    value={this.state.pollutionTherhold.toString()}
                  />}
                <TouchableOpacity onPress={() => this.showPollutionSelector()}>
                  <Marker
                    amount={String(this.state.pollutionTherhold)}
                    index="AQI"
                    isStatusShow={true}
                    fontSize={14}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {/* <Text style={styles.noticeDescriptionText}>({I18n.t('notify_pollution_title')})</Text> */}
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
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {Platform.OS === 'ios' &&
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    onChangeText={(value) => {
                      this.setNotificationCleanlinessTherhold(value);
                      tracker.logEvent('cleanliness-textinput', item);
                    }}
                    value={this.state.cleanlinessTherhold.toString()}
                  />}
                <TouchableOpacity onPress={() => this.showCleanlinessSelector()}>
                  <Marker
                    amount={String(this.state.cleanlinessTherhold)}
                    index="AQI"
                    isStatusShow={true}
                    isNumericShow={false}
                    fontSize={14}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {/* <Text style={styles.noticeDescriptionText}>({I18n.t('notify_cleanliness_title')})</Text> */}
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
