import React from 'react';
import { arrayOf, bool, number, shape, string } from 'prop-types';
import {
  StyleSheet,
  FlatList,
  Text,
  View,
} from 'react-native';

import { iOSColors } from 'react-native-typography';
import Ionicons from 'react-native-vector-icons/Ionicons';

import moment from 'moment';

import I18n from '../utils/i18n';

moment.locale('zh-tw');

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    backgroundColor: iOSColors.white,
    padding: 10,
    flexDirection: 'row',
  },
  item: {
    height: 80,
    width: 50,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  labelText: {
    fontSize: 10,
    fontWeight: '300',
    color: 'black',
  },
  valueText: {
    fontSize: 12,
    color: 'black',
    textAlign: 'center',
  },
});

const Item = ({ item, isNow }) => {
  const weatherIconMapping = {
    '01': moment(item.Time).format('H') >= 6 && moment(item.Time).format('H') < 18 ? 'ios-sunny' : 'ios-moon',
    '02': 'ios-cloud-outline',
    '03': 'ios-cloud',
    26: 'ios-rainy',
    99: false,
  };

  let timeLabel;
  if (isNow) {
    timeLabel = I18n.t('forecast_weather.now');
  } else if (moment(item.Time).format('H') === '0' && moment(item.Time).diff(moment().startOf('day'), 'hours') === 24) {
    timeLabel = I18n.t('forecast_weather.tomorrow');
  } else if (moment(item.Time).format('H') === '0' && moment(item.Time).diff(moment().startOf('day'), 'hours') === 24 * 2) {
    timeLabel = I18n.t('forecast_weather.the_day_after_tomorrow');
  } else if (moment(item.Time).format('H') === '0' && moment(item.Time).diff(moment().startOf('day'), 'hours') === 24 * 3) {
    timeLabel = I18n.t('forecast_weather.two_days_after_tomorrow');
  } else if (moment(item.Time).format('H') === '0') {
    timeLabel = moment(item.Time).format('dddd');
  } else {
    timeLabel = `${moment(item.Time).format('H')}${I18n.t('forecast_weather.hours')}`;
  }

  return (
    <View key={item.Time} style={styles.item}>
      <View style={{ alignItems: 'center', justifyContent: 'flex-start' }}>
        {item.WeatherIcon
          && weatherIconMapping[item.WeatherIcon]
          && <Ionicons name={weatherIconMapping[item.WeatherIcon]} size={24} color="black" />}

        <Text style={styles.labelText}>{item.Weather}</Text>
      </View>

      <View style={{ alignItems: 'center', justifyContent: 'flex-end' }}>
        <Text style={styles.valueText}>{item.Temp}℃</Text>
        <Text style={styles.labelText}>{timeLabel}</Text>
      </View>
    </View>
  );
};

Item.propTypes = {
  item: shape({
    Time: string,
    Temp: number,
    WeatherIcon: string,
    Weather: string,
    Weather_original: string,
  }).isRequired,
  isNow: bool,
};

Item.defaultProps = {
  isNow: false,
};

const ForecastWeather = ({ data }) => {
  if (data.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Item item={data[0]} isNow />
      <FlatList
        data={[...data].slice(1)}
        renderItem={({ item }) => <Item item={item} />}
        keyExtractor={item => item.Time}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

ForecastWeather.propTypes = {
  data: arrayOf(shape({
    Time: string,
    Temp: number,
    WeatherIcon: string,
    Weather: string,
    Weather_original: string,
  })).isRequired,
};

export default ForecastWeather;
