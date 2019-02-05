import React from 'react';
import { number, shape } from 'prop-types';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

import DeviceInfo from 'react-native-device-info';

import { getClosestStation } from '../../../utils/locations';
import { getColor } from '../../../utils/indexes';
import I18n from '../../../utils/i18n';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 15,
    top: DeviceInfo.hasNotch() ? 150 : 128,
    width: width / 2 - 15,
    height: 30,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 5,
  },
  text: {
    color: 'black',
    fontSize: 12,
    fontWeight: '300',
  },
});

const MaskSuggestion = ({ lat, long, aqiResult }) => {
  const { SiteName } = getClosestStation(lat, long);

  const amount =
    (aqiResult && aqiResult[SiteName] && aqiResult[SiteName].AQI) || 0;

  if (getColor('AQI', amount).key < 3) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{I18n.t('details.mask_suggestion')}</Text>
    </View>
  );
};

MaskSuggestion.propTypes = {
  lat: number,
  long: number,
  aqiResult: shape({}),
};

MaskSuggestion.defaultProps = {
  lat: 25.062361,
  long: 121.507972,
  aqiResult: {},
};

export default MaskSuggestion;
