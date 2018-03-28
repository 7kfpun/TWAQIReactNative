import React, { Component } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import * as Animatable from 'react-native-animatable';
import firebase from 'react-native-firebase';
import Ionicons from 'react-native-vector-icons/Ionicons';

import AdMob from '../elements/admob';
import ForecastNotificationSettings from '../elements/forecast-notification-settings';

import { aqfn } from '../utils/api';
import I18n from '../utils/i18n';

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
    color: 'black',
  },
});

export default class ForecastView extends Component {
  static navigationOptions = {
    header: null,
    tabBarLabel: I18n.t('forecast'),
    tabBarIcon: ({ tintColor, focused }) => {
      if (focused) {
        return <Ionicons name="ios-leaf" size={20} color={tintColor} />;
      }

      return (
        <Animatable.View animation="tada" iterationCount="infinite">
          <Ionicons name="ios-leaf-outline" size={20} color={tintColor} />
        </Animatable.View>
      );
    },
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
    const getForecastContent = text => text
      .replace(/\r/g, '\n\n')
      .replace('敏感族群可以利用空氣品質監測網資訊(網址：http://taqm.epa.gov.tw、「愛環境資訊網」http://ienv.epa.gov.tw)查詢最新空氣品質變化，或透過「環境即時通」手機APP可以設定不同警戒值，', '');

    return (
      <View style={styles.container}>
        <View style={styles.titleBlock}>
          <Text style={styles.titleText}>{I18n.t('forecast_title')}</Text>
        </View>

        <ScrollView>
          <ForecastNotificationSettings />
          <View style={{ flex: 1, padding: 10 }}>
            <Text style={styles.text}>{this.state.aqfnResult && this.state.aqfnResult[0] && this.state.aqfnResult[0].Content && getForecastContent(this.state.aqfnResult[0].Content)}</Text>
          </View>
        </ScrollView>
        <AdMob unitId="twaqi-ios-forecast-footer" />
      </View>
    );
  }
}
