import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { iOSColors } from 'react-native-typography';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import OneSignal from 'react-native-onesignal';

import { OneSignalGetTags } from '../utils/onesignal';
import I18n from '../utils/i18n';
import tracker from '../utils/tracker';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F8F8',
    marginTop: 5,
    paddingHorizontal: 10,
    borderTopColor: '#EEEEEE',
    borderTopWidth: 1,
    borderBottomColor: '#EEEEEE',
    borderBottomWidth: 1,
  },
  titleBlock: {
    paddingVertical: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingsBlock: {
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  horizontalLine: {
    borderTopColor: '#EEEEEE',
    borderTopWidth: 1,
  },
  detailText: {
    marginTop: 5,
    fontSize: 12,
    color: iOSColors.gray,
  },
  timeText: {
    color: iOSColors.blue,
  },
});


const getTime = value => (parseInt(moment(value).format('H'), 10) * 60) + parseInt(moment(value).format('m'), 10);
const convertFromTagToTime = value => moment(`${parseInt(value / 60, 10)} ${value % 60}`, 'H m');

export default class SettingsDND extends Component {
  static propTypes = {
    // groupName: PropTypes.string.isRequired,
  }

  state = {
    isDndEnabled: false,
    startTime: moment(),
    endTime: moment(),
    isStartTimePickerVisible: false,
    isEndTimePickerVisible: false,
  };

  componentDidMount() {
    this.loadDNDSettings();
  }

  setDND = (value) => {
    this.setState({ isDndEnabled: value }, () => {
      OneSignal.sendTags({
        isDndEnabled: value,
        dndStartTime: getTime(this.state.startTime),
        dndEndTime: getTime(this.state.endTime),
        isDndStartEarlierThanEnd: moment(this.state.startTime).diff(this.state.endTime) < 0,
      });
      tracker.logEvent('set-dnd-notification', { label: value ? 'on' : 'off' });

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

  async loadDNDSettings() {
    const tags = await OneSignalGetTags();
    if (tags) {
      this.setState({
        isDndEnabled: tags.isDndEnabled === 'true',
        startTime: tags.dndStartTime ? convertFromTagToTime(tags.dndStartTime) : this.state.startTime,
        endTime: tags.dndEndTime ? convertFromTagToTime(tags.dndEndTime) : this.state.endTime,
      });
    }
  }

  showStartTimePicker = () => this.setState({ isStartTimePickerVisible: true });
  hideStartTimePicker = () => this.setState({ isStartTimePickerVisible: false });

  showEndTimePicker = () => this.setState({ isEndTimePickerVisible: true });
  hideEndTimePicker = () => this.setState({ isEndTimePickerVisible: false });

  handleStartTimePicked = (value) => {
    this.setState({ startTime: value }, () => OneSignal.sendTags({
      dndStartTime: getTime(value),
      isDndStartEarlierThanEnd: moment(value).diff(this.state.endTime) < 0,
    }));
    this.hideStartTimePicker();
  };

  handleEndTimePicked = (value) => {
    this.setState({ endTime: value }, () => OneSignal.sendTags({
      dndEndTime: getTime(value),
      isDndStartEarlierThanEnd: moment(this.state.startTime).diff(value) < 0,
    }));
    this.hideEndTimePicker();
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.titleBlock}>
          <Text>{I18n.t('do_not_disturb.title')}</Text>

          <Switch
            onValueChange={value => this.setDND(value)}
            value={this.state.isDndEnabled}
            tintColor="#EEEEEE"
          />
        </View>

        {this.state.isDndEnabled &&
          <TouchableOpacity
            style={[styles.settingsBlock, styles.horizontalLine]}
            onPress={this.showStartTimePicker}
          >
            <Text>{I18n.t('do_not_disturb.start_time')}</Text>
            <Text style={styles.timeText}>{moment(this.state.startTime).format('LT')}</Text>
          </TouchableOpacity>}

        {this.state.isDndEnabled &&
          <TouchableOpacity
            style={styles.settingsBlock}
            onPress={this.showEndTimePicker}
          >
            <Text>{I18n.t('do_not_disturb.end_time')}</Text>
            <Text style={styles.timeText}>{moment(this.state.endTime).format('LT')}</Text>
          </TouchableOpacity>}

        <DateTimePicker
          titleIOS={I18n.t('do_not_disturb.start_time')}
          mode="time"
          isVisible={this.state.isStartTimePickerVisible}
          onConfirm={this.handleStartTimePicked}
          onCancel={this.hideStartTimePicker}
        />

        <DateTimePicker
          titleIOS={I18n.t('do_not_disturb.start_time')}
          mode="time"
          isVisible={this.state.isEndTimePickerVisible}
          onConfirm={this.handleEndTimePicked}
          onCancel={this.hideEndTimePicker}
        />
      </View>
    );
  }
}
