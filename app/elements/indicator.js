import React from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';

import DeviceInfo from 'react-native-device-info';

import { indexRanges } from '../utils/indexes';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 15,
    top: DeviceInfo.hasNotch() ? 116 : 94,
    width: width / 2 - 15,
    height: 30,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 5,
  },
  item: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  bar: {
    width: 10,
    height: 2,
    borderRadius: 2,
    marginTop: 3,
  },
  text: {
    color: 'black',
    fontSize: 10,
    fontWeight: '300',
    textShadowColor: 'gray',
    textShadowOffset: {
      width: 0.6,
      height: 0.6,
    },
    textShadowRadius: 1,
  },
});

const Indicator = () => (
  <View style={styles.container}>
    {indexRanges.AQI.map(color => (
      <View style={styles.item} key={color.key}>
        <Image style={{ width: 16, height: 16 }} source={color.image} />
        <View style={[styles.bar, { backgroundColor: color.color }]} />
      </View>
    ))}
  </View>
);

export default Indicator;
