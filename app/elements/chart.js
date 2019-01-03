import React, { Component } from 'react';
import { arrayOf, shape, string } from 'prop-types';
import { Dimensions, View } from 'react-native';

import { VictoryBar } from 'victory-native';

import { getColor } from '../utils/indexes';

const { width } = Dimensions.get('window');

const isFloat = n => Number(n) === n && n % 1 !== 0;

export default class Chart extends Component {
  static propTypes = {
    index: string.isRequired,
    result: arrayOf(shape({}).isRequired).isRequired,
  };

  render() {
    const { index, result } = this.props;
    if (!result || result.length === 0) {
      return null;
    }

    const data = result.map(amount => {
      if (
        ['ND', '-', '/*', '-*', '-/-'].includes(amount) ||
        amount < '0' ||
        !amount
      ) {
        return 0;
      }
      return amount[index.replace('_', '')];
    });

    const { length } = result;
    const min = parseFloat(Math.min(...data)) || 0;
    const max = parseFloat(Math.max(...data)) || 1;

    return (
      <View pointerEvents="none">
        <VictoryBar
          height={62}
          width={width - 66}
          padding={{
            top: 10,
            bottom: 2,
            left: 7,
            right: 7,
          }}
          domain={{ x: [0, length], y: [min / 3, max] }}
          labels={d => {
            if (d.y === 0) {
              return '';
            }

            if (d.y === min || d.y === max || d.x === 0 || d.x === length - 1) {
              return isFloat(d.y) ? d.y.toFixed(1) : d.y;
            }

            return '';
          }}
          style={{
            labels: {
              fill: 'black',
              fontSize: 8,
              padding: 2,
            },
            data: {
              fill: d =>
                d.y
                  ? getColor(this.props.index, parseFloat(d.y)).color
                  : '#000000',
              // stroke: (d) => d.x === 3 ? "#000000" : "#c43a31",
              fillOpacity: 0.8,
              strokeWidth: 1,
            },
          }}
          data={data.map((value, i) => ({
            x: i,
            y: parseFloat(value),
            width: (width - 180) / length,
          }))}
        />
      </View>
    );
  }
}
