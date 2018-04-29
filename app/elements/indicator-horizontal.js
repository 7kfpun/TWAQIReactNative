import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import I18n from '../utils/i18n';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
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

const colors = [{
  key: 0,
  status: I18n.t('status_good'),
  color: '#009866',
  min: 0,
  max: 50,
}, {
  key: 1,
  status: I18n.t('status_moderate'),
  color: '#FEDE33',
  min: 51,
  max: 100,
}, {
  key: 2,
  status: I18n.t('status_unhealthy_for_sensitive_groups'),
  color: '#FE9833',
  min: 101,
  max: 150,
}, {
  key: 3,
  status: I18n.t('status_unhealthy'),
  color: '#CC0033',
  min: 151,
  max: 200,
}, {
  key: 4,
  status: I18n.t('status_very_unhealthy'),
  color: '#660098',
  min: 201,
  max: 300,
}, {
  key: 5,
  status: I18n.t('status_hazardous'),
  color: '#7E2200',
  min: 301,
  max: 500,
}];

const IndicatorHorizontal = () => (
  <View style={styles.container}>
    {colors.map(color => (
      <View style={styles.item} key={color.key}>
        <View style={[styles.bar, { backgroundColor: color.color }]} />
        <Text style={styles.text}>{color.status}</Text>
      </View>))}
  </View>
);

export default IndicatorHorizontal;
