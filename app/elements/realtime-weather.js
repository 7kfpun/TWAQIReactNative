import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { iOSColors } from 'react-native-typography';

import I18n from '../utils/i18n';

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    backgroundColor: iOSColors.white,
    padding: 15,
    paddingBottom: 20,
    flexDirection: 'row',
  },
  item: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    height: 45,
  },
  labelText: {
    fontSize: 10,
    fontWeight: '300',
    color: 'black',
  },
  valueText: {
    fontSize: 14,
    color: 'black',
    textAlign: 'center',
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
    }).isRequired,
  }

  render() {
    if (!this.props.realtimeWeatherData.Temp) {
      return null;
    }

    const { realtimeWeatherData } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.item}>
          <Text style={styles.labelText}>{I18n.t('realtime_weather.rain')}</Text>
          <Text style={styles.valueText}>
            {realtimeWeatherData.Rain ? `${realtimeWeatherData.Rain} mm` : '--'}
          </Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.labelText}>{I18n.t('realtime_weather.rh')}</Text>
          <Text style={styles.valueText}>
            {realtimeWeatherData.RH ? `${realtimeWeatherData.RH} %` : '--'}
          </Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.labelText}>{I18n.t('realtime_weather.visibility')}</Text>
          <Text style={styles.valueText}>
            {realtimeWeatherData.Visibility ? `${realtimeWeatherData.Visibility} km` : '--'}
          </Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.labelText}>{I18n.t('realtime_weather.cloud')}</Text>
          <Text style={styles.valueText}>
            {realtimeWeatherData.Cloud ? `${realtimeWeatherData.Cloud} %` : '--'}
          </Text>
        </View>
      </View>
    );
  }
}
