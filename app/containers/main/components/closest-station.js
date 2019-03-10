import React, { Component } from 'react';
import { number, shape, string } from 'prop-types';

import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';

import DeviceInfo from 'react-native-device-info';
import Ionicons from 'react-native-vector-icons/Ionicons';

import moment from 'moment';

import { getClosestStation } from '../../../utils/locations';
import { getColor } from '../../../utils/indexes';
import { realtimeWeather } from '../../../utils/api';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 15,
    top: DeviceInfo.hasNotch() ? 45 : 25,
    width: width / 2 - 15,
    height: 65,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 6,
  },
  weatherContainer: {
    flex: 3,
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
    flex: 2,
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
  '01':
    moment().format('H') >= 6 && moment().format('H') < 18
      ? 'ios-sunny'
      : 'ios-moon',
  '02': 'ios-cloud-outline',
  '03': 'ios-cloud',
  26: 'ios-rainy',
  99: false,
};

export default class ClosestStation extends Component {
  static propTypes = {
    lat: number,
    long: number,
    aqiResult: shape({}),
    selectedIndex: string,
  };

  static defaultProps = {
    lat: 25.062361,
    long: 121.507972,
    aqiResult: {},
    selectedIndex: 'AQI',
  };

  state = {
    realtimeWeatherData: {
      Temp: '- ',
    },
  };

  componentDidMount() {
    const { lat, long } = this.props;

    this.getRealtimeWeather(lat, long);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.lat !== this.props.lat ||
      prevProps.long !== this.props.long
    ) {
      this.getRealtimeWeather(this.props.lat, this.props.long);
    }
  }

  getRealtimeWeather = (lat, long) => {
    realtimeWeather(lat, long).then((result) => {
      this.setState({ realtimeWeatherData: result });
    });
  };

  render() {
    const { lat, long, aqiResult, selectedIndex } = this.props;
    const { realtimeWeatherData } = this.state;

    const { Township, County, SiteName } = getClosestStation(lat, long);

    const amount =
      (aqiResult &&
        aqiResult[SiteName] &&
        aqiResult[SiteName][selectedIndex]) ||
      '-';
    const windDirec =
      (aqiResult && aqiResult[SiteName] && aqiResult[SiteName].WindDirec) || 0;

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
              color={getColor(selectedIndex, amount).color}
            />

            <Text style={styles.text}>{`${Township}, ${County}`}</Text>
          </View>

          <View style={styles.temperatureContainer}>
            <Text>{`${realtimeWeatherData.Temp}℃`}</Text>
            {realtimeWeatherData.WeatherIcon &&
              weatherIconMapping[realtimeWeatherData.WeatherIcon] && (
                <Ionicons
                  name={weatherIconMapping[realtimeWeatherData.WeatherIcon]}
                  style={{ marginLeft: 4, marginBottom: -2 }}
                  size={20}
                  color="black"
                />
              )}
          </View>
        </View>
        <View style={styles.aqiContainer}>
          <View
            style={{
              borderRadius: 4,
              padding: 2,
              paddingHorizontal: 5,
              backgroundColor: getColor(selectedIndex, amount).color,
              marginTop: -1,
            }}
          >
            <Text
              style={[
                styles.text,
                { color: getColor(selectedIndex, amount).fontColor },
              ]}
            >
              {selectedIndex} {amount}
            </Text>
          </View>
          <Image
            style={{ width: 30, height: 30, marginBottom: -6 }}
            source={getColor(selectedIndex, amount).image}
          />
        </View>
      </View>
    );
  }
}
