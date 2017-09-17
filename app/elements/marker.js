import React, { PropTypes } from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

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
    padding: 3,
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

export default class AirMarker extends React.Component {
  render() {
    const { fontSize, amount, status } = this.props;

    let color;

    // 0-50 Good Air pollution risk is low.
    // 51-100 Moderate Air quality is acceptable.
    // 101-150 Unhealthy for high-risk group High-risk group may have health effects. General public is not affected.
    // 151-200 Unhealthy High-risk group may have more serious health effects. Some of the general public may have health effects.
    // 201-300 Very Unhealthy General public have health effects.
    // 301-500 Hazardous Some of the general public may have more serious health effects.
    if (status === '良好') {
      color = '#009866';
    } else if (status === '普通') {
      color = '#FEDE33';
    } else if (status === '對敏感族群不良') {
      color = '#FE9833';
    } else if (status === '對所有族群不健康') {
      color = '#CC0033';
    } else if (status === '非常不健康') {
      color = '#660098';
    } else if (status === '危害') {
      color = '#7E2200';
    } else {
      color = 'gray';
    }

    let showAmount;
    if (amount === '/*' || amount === '-*' || amount === '-/-' || amount === '/-') {
      showAmount = '-';
    } else {
      showAmount = amount;
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
  amount: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  fontSize: PropTypes.number,
};
AirMarker.defaultProps = {
  fontSize: 16,
};
