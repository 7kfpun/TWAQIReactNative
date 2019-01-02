import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import I18n from '../utils/i18n';
import { indexRanges } from '../utils/indexes';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingTop: 15,
    marginTop: 10,
  },
  item: {
    flex: 1,
    flexDirection: 'column',
    padding: 4,
  },
  bar: {
    height: 4,
    borderRadius: 2,
  },
  text: {
    color: 'black',
    fontSize: I18n.isZh ? 12 : 8,
    fontWeight: '300',
    marginTop: 10,
    textAlign: 'center',
  },
});

const IndicatorHorizontal = () => (
  <View style={styles.container}>
    {indexRanges.AQI.map(color => (
      <View style={styles.item} key={color.key}>
        <View style={[styles.bar, { backgroundColor: color.color }]} />
        <Text style={styles.text}>{color.status}</Text>
      </View>))}
  </View>
);

export default IndicatorHorizontal;
