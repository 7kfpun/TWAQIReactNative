import React from 'react';
import { number, shape, string } from 'prop-types';
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


const RealtimeWeather = ({ data }) => {
  if (!data.Temp) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <Text style={styles.labelText}>{I18n.t('realtime_weather.rain')}</Text>
        <Text style={styles.valueText}>
          {data.Rain ? `${data.Rain} mm` : '--'}
        </Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.labelText}>{I18n.t('realtime_weather.rh')}</Text>
        <Text style={styles.valueText}>
          {data.RH ? `${data.RH} %` : '--'}
        </Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.labelText}>{I18n.t('realtime_weather.visibility')}</Text>
        <Text style={styles.valueText}>
          {data.Visibility ? `${data.Visibility} km` : '--'}
        </Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.labelText}>{I18n.t('realtime_weather.cloud')}</Text>
        <Text style={styles.valueText}>
          {data.Cloud ? `${data.Cloud} %` : '--'}
        </Text>
      </View>
    </View>
  );
};

RealtimeWeather.propTypes = {
  data: shape({
    Temp: number,
    WeatherIcon: string,
    RH: number,
    Rain: number,
    Cloud: number,
    Visibility: number,
  }).isRequired,
};

export default RealtimeWeather;
