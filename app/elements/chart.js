import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Dimensions,
} from 'react-native';

import { VictoryBar } from 'victory-native';

import { getColor } from '../utils/indexes';

const { width } = Dimensions.get('window');

const isFloat = n => Number(n) === n && n % 1 !== 0;

export default class Chart extends Component {
  static propTypes = {
    index: PropTypes.string.isRequired,
    result: PropTypes.object.isRequired,
  }

  render() {
    const { index, result } = this.props;

    if (!result || !result[index] || result[index].length === 0) {
      return null;
    }

    const data = result[index].map((amount) => {
      if (['ND', '-', '/*', '-*', '-/-'].includes(amount) || amount < '0' || !amount) {
        return 0;
      }
      return amount;
    });

    const min = parseFloat(Math.min(...data)) || 0;
    const max = parseFloat(Math.max(...data)) || 1;

    return (<VictoryBar
      height={65}
      width={width - 6}
      padding={{ top: 20, bottom: 2, left: 7, right: 7 }}
      domain={{ x: [0, 24], y: [min, max] }}
      labels={(d) => {
        if (d.y === 0) {
          return '';
        }

        if (d.y === min || d.y === max || d.x === 0 || d.x === data.length - 1) {
          isMaxShow = true;
          return isFloat(d.y) ? d.y.toFixed(1) : d.y;
        }

        return '';
      }}
      style={{
        labels: {
          fill: 'black',
          fontSize: 10,
          padding: 2,
        },
        data: {
          fill: d => d.y ? getColor(this.props.index, parseFloat(d.y)).color : '#000000',
          // stroke: (d) => d.x === 3 ? "#000000" : "#c43a31",
          fillOpacity: 0.8,
          strokeWidth: 1,
        },
      }}
      data={data.map((value, i) => ({
        x: i,
        y: parseFloat(value),
        width: (width - 100) / 24,
      }))}
    />);
  }
}
