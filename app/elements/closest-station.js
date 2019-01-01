import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import DeviceInfo from 'react-native-device-info';
import Ionicons from 'react-native-vector-icons/Ionicons';

import moment from 'moment';

import { getColor } from '../utils/indexes';
import { realtimeWeather } from '../utils/api';
import { getClosestStation } from '../utils/locations';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 15,
    top: DeviceInfo.hasNotch() ? 45 : 25,
    width: (width / 2) - 15,
    height: 65,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 6,
  },
  weatherContainer: {
    flex: 2,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  temperatureContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  aqiContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#D3D3D3',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  text: {
    fontSize: 10,
  },
});

const weatherIconMapping = {
  '01': moment().format('H') >= 6 && moment().format('H') < 18 ? 'ios-sunny' : 'ios-moon',
  '02': 'ios-cloud-outline',
  '03': 'ios-cloud',
  26: 'ios-rainy',
  99: false,
};


export default class ClosestStation extends Component {
  static propTypes = {
    lat: PropTypes.number,
    long: PropTypes.number,
    aqiResult: PropTypes.shape({}),
  }

  static defaultProps = {
    lat: 25.0623610000,
    long: 121.507972,
    aqiResult: {},
  }

  state = {
    realtimeWeatherData: {
      Temp: '- ',
    },
  }

  componentDidMount() {
    const { lat, long } = this.props;

    this.getRealtimeWeather(lat, long);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.lat !== this.props.lat || prevProps.long !== this.props.long) {
      this.getRealtimeWeather(this.props.lat, this.props.long);
    }
  }

  getRealtimeWeather = (lat, long) => {
    realtimeWeather(lat, long).then((result) => {
      this.setState({ realtimeWeatherData: result });
    });
  }

  render() {
    const { lat, long, aqiResult } = this.props;
    const { realtimeWeatherData } = this.state;

    const { Township, County, SiteName } = getClosestStation(lat, long);

    const aqi = (aqiResult && aqiResult[SiteName] && aqiResult[SiteName].AQI) || '-';
    const windDirec = (aqiResult && aqiResult[SiteName] && aqiResult[SiteName].WindDirec) || 0;

    return (
      <View style={styles.container}>
        <View style={styles.weatherContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons
              name="md-navigate"
              style={{
                transform: [{ rotate: `${parseFloat(windDirec) + 180}deg` }],
                marginRight: 5,
              }}
              size={14}
              color={getColor('AQI', aqi).color}
            />

            <Text style={styles.text}>{`${Township}, ${County}`}</Text>
          </View>

          <View style={styles.temperatureContainer}>
            <Text>{`${realtimeWeatherData.Temp}℃`}</Text>
            {realtimeWeatherData.WeatherIcon
              && weatherIconMapping[realtimeWeatherData.WeatherIcon]
              && <Ionicons name={weatherIconMapping[realtimeWeatherData.WeatherIcon]} style={{ marginLeft: 4, marginBottom: -2 }} size={20} color="black" />}
          </View>
        </View>
        <View style={styles.aqiContainer}>
          <View
            style={{
              borderRadius: 4,
              padding: 2,
              paddingHorizontal: 5,
              backgroundColor: getColor('AQI', aqi).color,
              marginTop: -1,
            }}
          >
            <Text style={[styles.text, { color: getColor('AQI', aqi).fontColor }]}>AQI {aqi}</Text>
          </View>
          <Image
            style={{ width: 30, height: 30, marginBottom: -6 }}
            source={getColor('AQI', aqi).image}
          />
        </View>
      </View>
    );
  }
}
