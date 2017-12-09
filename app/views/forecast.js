import React, { Component } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import firebase from 'react-native-firebase';
import Icon from 'react-native-vector-icons/MaterialIcons';

import AdMob from '../elements/admob';
import ForecastNotificationSettings from '../elements/forecast-notification-settings';

import aqfn from '../utils/aqfn';
import I18n from '../utils/i18n';
import tracker from '../utils/tracker';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  titleBlock: {
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingLeft: 10,
    paddingBottom: 10,
  },
  titleText: {
    fontSize: 24,
    color: 'black',
  },
  text: {
    lineHeight: 22,
    fontSize: 14,
  },
});

export default class ForecastView extends Component {
  static navigationOptions = {
    header: null,
    tabBarLabel: I18n.t('forecast'),
    tabBarIcon: ({ tintColor }) => <Icon name="track-changes" size={21} color={tintColor} />,
  };

  state = {
    aqfnResult: null,
  }

  componentDidMount() {
    if (I18n.isZh) {
      const trace = firebase.perf().newTrace('api_get_aqfn');
      trace.start();
      aqfn().then((json) => {
        console.log('aqfnResult', json);
        this.setState({ aqfnResult: json });
        trace.stop();
      });
    }
  }

  render() {
    tracker.view('Forecast');
    return (
      <View style={styles.container}>
        <View style={styles.titleBlock}>
          <Text style={styles.titleText}>{I18n.t('forecast_title')}</Text>
        </View>

        <ScrollView>
          <ForecastNotificationSettings />
          <View style={{ flex: 1, padding: 10 }}>
            <Text style={styles.text}>{this.state.aqfnResult && this.state.aqfnResult[0] && this.state.aqfnResult[0].Content}</Text>
          </View>
        </ScrollView>
        <AdMob />
      </View>
    );
  }
}
