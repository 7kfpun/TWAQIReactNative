import React, { Component } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  IndicatorViewPager,
  PagerDotIndicator,
} from 'rn-viewpager';
import * as Animatable from 'react-native-animatable';
import firebase from 'react-native-firebase';
import Ionicons from 'react-native-vector-icons/Ionicons';

import moment from 'moment';

import AdMob from '../elements/admob';
import IndicatorHorizontal from '../elements/indicator-horizontal';
import Marker from '../elements/marker';
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
  body: {
    flex: 1,
    padding: 10,
    paddingBottom: 20,
  },
  publishTimeText: {
    fontSize: 14,
    marginBottom: 15,
  },
  text: {
    lineHeight: 24,
    fontSize: 14,
    color: 'black',
  },
  selectDot: {
    backgroundColor: '#424242',
  },
});

const groupBy = (list, key) => list.reduce((r, a) => {
  r[a[key]] = r[a[key]] || [];
  r[a[key]].push(a);
  return r;
}, Object.create(null));


export default class ForecastView extends Component {
  static navigationOptions = {
    header: null,
    tabBarLabel: I18n.t('forecast_tab'),
    tabBarIcon: ({ tintColor, focused }) => {
      if (focused) {
        return <Ionicons name="ios-analytics" size={20} color={tintColor} />;
      }

      return (
        <Animatable.View animation="tada" iterationCount="infinite">
          <Ionicons name="ios-analytics-outline" size={20} color={tintColor} />
        </Animatable.View>
      );
    },
  };

  state = {
    aqfnResult: null,
  }

  componentDidMount() {
    const trace = firebase.perf().newTrace('api_get_aqfn');
    trace.start();
    aqfn().then((json) => {
      this.setState({
        aqfnResult: json,
        aqfnResultGroup: groupBy(json, 'Area'),
      });
      console.log('aqfnResult', json);
      console.log('aqfnResultGroup', this.state.aqfnResultGroup);
      trace.stop();
    });
  }

  renderDotIndicator = () => <PagerDotIndicator selectedDotStyle={styles.selectDot} pageCount={2} />

  render() {
    const getForecastContent = text => text
      .replace(/\r/g, '\n\n')
      .replace('敏感族群可以利用空氣品質監測網資訊(網址：http://taqm.epa.gov.tw、「愛環境資訊網」http://ienv.epa.gov.tw)查詢最新空氣品質變化，或透過「環境即時通」手機APP可以設定不同警戒值，', '');

    return (
      <View style={styles.container}>
        <View style={styles.titleBlock}>
          <Text style={styles.titleText}>{I18n.t('forecast_title')}</Text>
        </View>

        <ForecastNotificationSettings />

        <IndicatorViewPager
          style={{ flex: 1 }}
          indicator={this.renderDotIndicator()}
        >
          <View>
            <ScrollView>
              <View style={styles.body}>
                {this.state.aqfnResult && this.state.aqfnResult[0] &&
                  <Text style={styles.publishTimeText}>{I18n.t('forecast_publish_time')}{this.state.aqfnResult[0].PublishTime}</Text>}

                <IndicatorHorizontal />

                {this.state.aqfnResultGroup &&
                  <View>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                      <View style={{ flex: 2 }} />
                      {this.state.aqfnResultGroup[Object.keys(this.state.aqfnResultGroup)[0]].map(item => (
                        <View style={{ flex: 1, alignItems: 'center' }} key={item.ForecastDate}>
                          <Text style={styles.text}>{moment(item.ForecastDate).format('M/D')}</Text>
                        </View>
                      ))}
                    </View>

                    <View>
                      {Object.keys(this.state.aqfnResultGroup).map(key => (
                        <View key={key} style={{ flexDirection: 'row', padding: 4, justifyContent: 'center' }}>
                          <View style={{ flex: 2 }}>
                            <Text style={styles.text}>{I18n.t(`forecast.${key}`)}</Text>
                          </View>
                          {this.state.aqfnResultGroup[key].map(item => (
                            <View style={{ flex: 1, alignItems: 'center' }} key={`${key}${item.ForecastDate}`}>
                              <Marker
                                amount={item.AQI}
                                index="AQI"
                                isNumericShow={true}
                              />
                            </View>
                          ))}
                          {this.state.aqfnResultGroup[key].length === 1 && <View style={{ flex: 1 }} />}
                          {this.state.aqfnResultGroup[key].length === 1 && <View style={{ flex: 1 }} />}
                        </View>
                      ))
                    }
                    </View>
                  </View>}
              </View>
            </ScrollView>
            <AdMob unitId={`twaqi-${Platform.OS}-forecast-3days-footer`} />
          </View>

          <View>
            <ScrollView style={styles.body}>
              {this.state.aqfnResult && this.state.aqfnResult[0] &&
                <Text style={styles.publishTimeText}>{I18n.t('forecast_publish_time')}{this.state.aqfnResult[0].PublishTime}</Text>}

              {this.state.aqfnResult && this.state.aqfnResult[0] && this.state.aqfnResult[0].Content &&
                <Text style={styles.text}>{getForecastContent(this.state.aqfnResult[0].Content)}</Text>
              }
            </ScrollView>
            <AdMob unitId={`twaqi-${Platform.OS}-forecast-detailed-footer`} />
          </View>
        </IndicatorViewPager>
      </View>
    );
  }
}
