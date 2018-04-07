import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import moment from 'moment';

import I18n from '../utils/i18n';

const styles = StyleSheet.create({
  container: {
    paddingBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  text: {
    fontSize: 22,
    color: 'black',
  },
  detailText: {
    fontSize: 14,
    color: 'black',
  },
});

export default class RealtimeWeather extends Component {
  static propTypes = {
    realtimeWeatherData: PropTypes.shape({
      Temp: PropTypes.number,
      WeatherIcon: PropTypes.string,
      RH: PropTypes.number,
      Rain: PropTypes.number,
      Cloud: PropTypes.number,
      Visibility: PropTypes.number,
      // RHColorCode: '#80C266',
      // RainColorCode: '#C2C2C1',
      // WeatherIcon: '02',
      // Temp: 23,
      // RH: 54,
      // Rain: 0,
      // Cloud: 90,
      // Weather: '多雲',
      // Weather_original: null,
      // Visibility: null,
      // WindSpeed: null,
      // WindDirect: null,
      // DataCreTime: null,
      // StatusCode: null,
      // Message: null,
      // SiteName: null
    }).isRequired,
  }

  render() {
    // const weatherIconMapping = {
    //   '01': '☀️/🌙',
    //   '02': '⛅️',
    //   '03': '☁️',
    //   26: '🌧',
    // };
    const weatherIconMapping = {
      '01': (moment().format('H') >= 6 || moment().format('H') < 18) ? 'ios-sunny' : 'ios-moon',
      '02': 'ios-cloud-outline',
      '03': 'ios-cloud',
      26: 'ios-rainy',
      99: false,
    };

    if (!this.props.realtimeWeatherData.Temp) {
      return null;
    }

    return (
      <View style={styles.container}>
        <View style={styles.row}>
          {this.props.realtimeWeatherData.Temp && <Text style={styles.text}>{`${this.props.realtimeWeatherData.Temp}℃`}</Text>}
          {this.props.realtimeWeatherData.WeatherIcon
            && weatherIconMapping[this.props.realtimeWeatherData.WeatherIcon]
            && <Ionicons name={weatherIconMapping[this.props.realtimeWeatherData.WeatherIcon]} style={{ marginLeft: 4 }} size={36} color="black" />}
        </View>
        <View style={styles.row}>
          <Text style={styles.detailText}>{I18n.t('realtime_weather.rain')}</Text>
          <Text style={styles.detailText}>{`${this.props.realtimeWeatherData.Rain}mm`}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.detailText}>{I18n.t('realtime_weather.rh')}</Text>
          <Text style={styles.detailText}>{`${this.props.realtimeWeatherData.RH}%`}</Text>
        </View>
        {this.props.realtimeWeatherData.Visibility &&
          <View style={styles.row}>
            <Text style={styles.detailText}>{I18n.t('realtime_weather.visibility')}</Text>
            <Text style={styles.detailText}>{this.props.realtimeWeatherData.Visibility}</Text>
          </View>}
        <View style={styles.row}>
          <Text style={styles.detailText}>{I18n.t('realtime_weather.cloud')}</Text>
          <Text style={styles.detailText}>{`${this.props.realtimeWeatherData.Cloud}%`}</Text>
        </View>
      </View>
    );
  }
}
