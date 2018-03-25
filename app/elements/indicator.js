import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import I18n from '../utils/i18n';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 12,
    top: Platform.OS === 'ios' ? 56 : 22,
    width: 82,
    flexDirection: 'column',
    backgroundColor: 'transparent',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 1,
  },
  bar: {
    marginRight: 4,
    width: 18,
    height: 4,
    borderRadius: 2,
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

const Indicator = () => (
  <View style={styles.container}>
    {colors.map(color => (
      <View style={styles.item} key={color.key}>
        <View style={[styles.bar, { backgroundColor: color.color }]} />
        <Text style={styles.text}>{color.status}</Text>
      </View>))}
  </View>
);

export default Indicator;
