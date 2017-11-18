import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

import { indexRanges } from '../utils/indexes';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignSelf: 'flex-start',
  },
  bubble: {
    flex: 0,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: '#FF5A5F',
    padding: 4,
    borderRadius: 5,
    borderColor: '#D23F44',
    borderWidth: 0.5,
  },
  amount: {
    color: '#FFFFFF',
  },
  arrow: {
    backgroundColor: 'transparent',
    borderWidth: 4,
    borderColor: 'transparent',
    borderTopColor: '#FF5A5F',
    alignSelf: 'center',
    marginTop: -9,
  },
  arrowBorder: {
    backgroundColor: 'transparent',
    borderWidth: 4,
    borderColor: 'transparent',
    borderTopColor: '#D23F44',
    alignSelf: 'center',
    marginTop: -0.5,
  },
});

export default class AirMarker extends React.PureComponent {
  render() {
    const { index, fontSize, amount } = this.props;
    let color = 'gray';

    let showAmount;
    if (amount === '-' || amount === '-0.1' || amount === '/*' || amount === '-*' || amount === '-/-' || amount === '/-' || !amount) {
      showAmount = '-';
    } else if (amount === 'ND') {
      showAmount = '-';
      color = '#009866';
    } else {
      showAmount = amount;

      const isMatched = indexRanges[index].filter(item => amount >= item.min && amount <= item.max);
      if (isMatched && isMatched.length >= 1) {
        color = isMatched[0].color;
      }
    }

    return (
      <View style={styles.container}>
        <View style={[styles.bubble, { backgroundColor: color, borderColor: 'white' }]}>
          <Text style={[styles.amount, { fontSize }]}>{showAmount}</Text>
        </View>
        <View style={[styles.arrowBorder, { borderTopColor: 'white' }]} />
        <View style={[styles.arrow, { borderTopColor: color }]} />
      </View>
    );
  }
}

AirMarker.propTypes = {
  index: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  fontSize: PropTypes.number,
};
AirMarker.defaultProps = {
  index: 'AQI',
  amount: '-',
  fontSize: 16,
};
