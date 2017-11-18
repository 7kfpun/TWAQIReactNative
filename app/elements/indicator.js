import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 12,
    top: 60,
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
    width: 16,
    height: 5,
    marginRight: 4,
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
  status: '良好',
  color: '#009866',
}, {
  key: 1,
  status: '普通',
  color: '#FEDE33',
}, {
  key: 2,
  status: '對敏感族群不良',
  color: '#FE9833',
}, {
  key: 3,
  status: '對所有族群不良',
  color: '#CC0033',
}, {
  key: 4,
  status: '非常不良',
  color: '#660098',
}, {
  key: 5,
  status: '有害',
  color: '#7E2200',
}];

export default class Indicator extends PureComponent {
  render() {
    return (
      <View style={styles.container}>
        {colors.map(color => (<View style={styles.item} key={color.key}>
          <View style={[styles.bar, { backgroundColor: color.color }]} />
          <Text style={styles.text}>{color.status}</Text>
        </View>))}
      </View>
    );
  }
}
