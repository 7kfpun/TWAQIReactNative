import React, { Component } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import DeviceInfo from 'react-native-device-info';
import firebase from 'react-native-firebase';
import OneSignal from 'react-native-onesignal';
import RNRestart from 'react-native-restart';
import store from 'react-native-simple-store';

import I18n from '../../../utils/i18n';
import tracker from '../../../utils/tracker';

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  text: {
    fontSize: 16,
    color: 'black',
  },
  subtext: {
    fontSize: 16,
    fontWeight: '300',
    color: 'black',
  },
});

export default class Backdoor extends Component {
  static sendTags(value) {
    const tags = {
      isBackdoor: true,
      code: value,
    };

    console.log('Send tags', tags);
    OneSignal.sendTags(tags);

    tracker.logEvent('user-about-set-backdoor-premium', { code: value });
  }

  state = {
    clicks: 0,
    isInputShown: false,
    invitationCodes: {},
    text: '',
  };

  onPress = () => {
    this.setState(
      {
        clicks: this.state.clicks + 1,
      },
      () => {
        if (this.state.clicks === 7) {
          this.getConfig();
          this.setState({
            isInputShown: true,
          });
          tracker.logEvent('user-about-open-backdoor');
        }
      },
    );
  };

  getConfig() {
    const prefix = 'invitation_code_';
    firebase
      .config()
      .fetch(60) // cache for 60 seconds
      .then(() => firebase.config().activateFetched())
      .then(() => firebase.config().getKeysByPrefix(prefix))
      .then((arr) => firebase.config().getValues(arr))
      .then((objects) => {
        const data = {};
        // Retrieve values
        // {
        //   "codeA": 1546782730998, // timestamp
        //   "codeB": 1546782749469 // timestamp
        // }
        Object.keys(objects).forEach((key) => {
          if (!key.endsWith('_timestamp')) {
            data[objects[key].val()] =
              objects[`${key}_timestamp`] && objects[`${key}_timestamp`].val();
          }
        });

        console.log('firebase config values', data);
        this.setState({ invitationCodes: data });
      })
      .catch(console.error);
  }

  render() {
    const { isInputShown, invitationCodes } = this.state;

    return (
      <View>
        <TouchableOpacity onPress={this.onPress}>
          <View style={styles.row}>
            <Text style={styles.text}>{`${I18n.t('help.version')}:`}</Text>
            <Text style={styles.subtext}>
              {DeviceInfo.getReadableVersion()}
            </Text>
          </View>
        </TouchableOpacity>

        {isInputShown && (
          <View
            style={[
              styles.row,
              {
                flexDirection: 'column',
                alignItems: 'stretch',
                borderTopWidth: 0,
              },
            ]}
          >
            <Text style={styles.subtext}>
              {'Please input your invitation code:'}
            </Text>
            <TextInput
              style={{
                height: 26,
                borderBottomColor: 'gray',
                borderBottomWidth: 0.5,
              }}
              onChangeText={(text) => {
                this.setState({ text });

                const lowerText = text.toLowerCase();

                if (
                  invitationCodes[lowerText] &&
                  !Number.isNaN(invitationCodes[lowerText])
                ) {
                  Backdoor.sendTags(lowerText);
                  store.save(
                    'adFreeUntil',
                    parseInt(invitationCodes[`${lowerText}`], 10),
                  );
                  store.save('currentSubscription', 'backdoor');

                  Alert.alert(
                    I18n.t('adfree.restore_success.title'),
                    I18n.t('adfree.restore_success.description'),
                    [{ text: 'OK', onPress: () => RNRestart.Restart() }],
                    { cancelable: false },
                  );
                }
              }}
              value={this.state.text}
            />
          </View>
        )}
      </View>
    );
  }
}
