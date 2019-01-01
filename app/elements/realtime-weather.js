import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { iOSColors } from 'react-native-typography';
// import Ionicons from 'react-native-vector-icons/Ionicons';

// import moment from 'moment';

import I18n from '../utils/i18n';

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    backgroundColor: iOSColors.white,
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
  },
  details: {
    flexDirection: 'row',
    marginTop: 10,
  },
  detailItem: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    height: 50,
  },
  text: {
    fontSize: 22,
    color: 'black',
  },
  detailLabelText: {
    fontSize: 10,
    fontWeight: '300',
    color: 'black',
    textAlign: 'center',
  },
  detailText: {
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
    // const weatherIconMapping = {
    //   '01': moment().format('H') >= 6 && moment().format('H') < 18 ? 'ios-sunny' : 'ios-moon',
    //   '02': 'ios-cloud-outline',
    //   '03': 'ios-cloud',
    //   26: 'ios-rainy',
    //   99: false,
    // };

    if (!this.props.realtimeWeatherData.Temp) {
      return null;
    }

    const { realtimeWeatherData } = this.props;

    return (
      <View style={styles.container}>
        {/* <View style={styles.row}>
          {realtimeWeatherData.Temp && <Text style={styles.text}>{`${realtimeWeatherData.Temp || '- '}℃`}</Text>}
          {realtimeWeatherData.WeatherIcon
            && weatherIconMapping[realtimeWeatherData.WeatherIcon]
            && <Ionicons name={weatherIconMapping[realtimeWeatherData.WeatherIcon]} style={{ marginLeft: 4 }} size={32} color="black" />}
        </View> */}

        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabelText}>{I18n.t('realtime_weather.rain')}</Text>
            <Text style={styles.detailText}>
              {(realtimeWeatherData.Rain && `${realtimeWeatherData.Rain} mm`) || '--'}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabelText}>{I18n.t('realtime_weather.rh')}</Text>
            <Text style={styles.detailText}>
              {(realtimeWeatherData.RH && `${realtimeWeatherData.RH} %`) || '--'}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabelText}>{I18n.t('realtime_weather.visibility')}</Text>
            <Text style={styles.detailText}>
              {(realtimeWeatherData.Visibility && `${realtimeWeatherData.Visibility} km`) || '--'}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabelText}>{I18n.t('realtime_weather.cloud')}</Text>
            <Text style={styles.detailText}>
              {(realtimeWeatherData.Cloud && `${realtimeWeatherData.Cloud} %`) || '--'}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}
