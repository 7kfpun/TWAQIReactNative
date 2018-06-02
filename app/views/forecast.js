import React, { Component } from 'react';
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { iOSColors } from 'react-native-typography';
import {
  IndicatorViewPager,
  PagerTitleIndicator,
} from 'rn-viewpager';
import * as Animatable from 'react-native-animatable';
import Collapsible from 'react-native-collapsible';
import firebase from 'react-native-firebase';
import Ionicons from 'react-native-vector-icons/Ionicons';

import moment from 'moment';

import AdMob from '../elements/admob';
import ForecastNotificationSettings from '../elements/forecast-notification-settings';
import IndicatorHorizontal from '../elements/indicator-horizontal';
import Marker from '../elements/marker';
import SwipeScrollView from '../elements/SwipeScrollView';

import { aqfn } from '../utils/api';
import I18n from '../utils/i18n';

const { width } = Dimensions.get('window');

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
    paddingVertical: 20,
  },
  indicatorContainer: {
    backgroundColor: iOSColors.white,
    height: 30,
  },
  indicatorText: {
    fontSize: 15,
    color: iOSColors.gray,
  },
  indicatorSelectedText: {
    fontSize: 15,
    color: iOSColors.black,
  },
  selectedBorderStyle: {
    height: 2,
    backgroundColor: iOSColors.tealBlue,
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
    collapsed: false,
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

  renderIndicator = () => (<PagerTitleIndicator
    style={styles.indicatorContainer}
    trackScroll={true}
    itemTextStyle={styles.indicatorText}
    selectedItemTextStyle={styles.indicatorSelectedText}
    selectedBorderStyle={styles.selectedBorderStyle}
    itemStyle={{ width: width / 2 }}
    selectedItemStyle={{ width: width / 2 }}
    titles={[I18n.t('forecast.three_days'), I18n.t('forecast.details')]}
  />)

  render() {
    const getForecastContent = text => text
      .replace(/\r/g, '\n\n')
      .replace('敏感族群可以利用空氣品質監測網資訊(網址：http://taqm.epa.gov.tw、「愛環境資訊網」http://ienv.epa.gov.tw)查詢最新空氣品質變化，或透過「環境即時通」手機APP可以設定不同警戒值，', '');

    return (
      <View style={styles.container}>
        <Collapsible collapsed={this.state.collapsed}>
          <View style={styles.titleBlock}>
            <Text style={styles.titleText}>{I18n.t('forecast_title')}</Text>
          </View>
        </Collapsible>

        <ForecastNotificationSettings />

        <IndicatorViewPager
          style={{ flex: 1, flexDirection: 'column-reverse' }}
          indicator={this.renderIndicator()}
        >
          <View>
            <SwipeScrollView
              scrollActionOffset={220}
              onScrollUp={() => this.setState({ collapsed: true })}
              onScrollDown={() => this.setState({ collapsed: false })}
            >
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
            </SwipeScrollView>
            <AdMob unitId={`twaqi-${Platform.OS}-forecast-3days-footer`} />
          </View>

          <View>
            <SwipeScrollView
              style={styles.body}
              scrollActionOffset={80}
              onScrollUp={() => this.setState({ collapsed: true })}
              onScrollDown={() => this.setState({ collapsed: false })}
            >
              {this.state.aqfnResult && this.state.aqfnResult[0] &&
                <Text style={styles.publishTimeText}>{I18n.t('forecast_publish_time')}{this.state.aqfnResult[0].PublishTime}</Text>}

              {this.state.aqfnResult && this.state.aqfnResult[0] && this.state.aqfnResult[0].Content &&
                <Text style={styles.text}>{getForecastContent(this.state.aqfnResult[0].Content)}</Text>
              }
            </SwipeScrollView>
            <AdMob unitId={`twaqi-${Platform.OS}-forecast-detailed-footer`} />
          </View>
        </IndicatorViewPager>
      </View>
    );
  }
}
