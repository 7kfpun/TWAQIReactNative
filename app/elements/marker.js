import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

import { indexRanges } from '../utils/indexes';
import I18n from '../utils/i18n';

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
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 8,
    borderColor: '#D23F44',
    borderWidth: 0.6,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '100',
  },
});

export default class AirMarker extends React.PureComponent {
  static propTypes = {
    index: PropTypes.string.isRequired,
    amount: PropTypes.string.isRequired,
    fontSize: PropTypes.number,
    isStatusShow: PropTypes.bool,
  }

  static defaultProps = {
    index: 'AQI',
    amount: '-',
    fontSize: 15,
    isStatusShow: false,
  }

  render() {
    const { index, fontSize, amount, isStatusShow } = this.props;
    let color = 'gray';

    let showAmount;
    if (['ND', '-', '/*', '-*', '-/-'].includes(amount) || amount < '0' || !amount) {
      showAmount = '-';
      color = '#009866';
    } else {
      showAmount = amount;

      const isMatched = indexRanges[index].filter(item => amount >= item.min && amount <= item.max);
      if (isMatched && isMatched.length >= 1) {
        color = isMatched[0].color;
        fontColor = isMatched[0].fontColor;
        status = isMatched[0].status;
      }
    }

    return (
      <View style={styles.container}>
        <View style={[styles.bubble, { backgroundColor: color, borderColor: 'white' }]}>
          <Text style={[styles.text, { fontSize, color: fontColor }]}>{isStatusShow && I18n.isZh ? `${status} ${showAmount}` : showAmount}</Text>
        </View>
      </View>
    );
  }
}
