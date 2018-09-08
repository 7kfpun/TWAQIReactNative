import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
} from 'react-native';

import DeviceInfo from 'react-native-device-info';
import firebase from 'react-native-firebase';

import AdCustom from './ad-custom';
import ErrorBoundary from './error-boundary';

import { config } from '../config';

const { AdRequest, Banner } = firebase.admob;
const request = new AdRequest();
request
  .addKeyword('口罩')
  .addKeyword('空氣 品質')
  .addKeyword('空氣 污染')
  .addKeyword('pm 2.5 過濾')
  .addKeyword('吸塵器')
  .addKeyword('負離子')
  .addKeyword('環保')
  .addKeyword('淨化')
  .addKeyword('空氣清新機')
  .addKeyword('清淨')
  .addKeyword('冷氣')
  .addKeyword('air condition')
  .addKeyword('air purifier')
  .addKeyword('air filter machine')
  .addKeyword('worldwide air quality')
  .addKeyword('health')
  .addKeyword('pollution');

export default class Admob extends Component {
  static propTypes = {
    bannerSize: PropTypes.string,
    unitId: PropTypes.string,
    margin: PropTypes.number,
    backgroundColor: PropTypes.string,
    alignItems: PropTypes.string,
  }

  static defaultProps = {
    margin: 0,
    unitId: null,
    bannerSize: 'SMART_BANNER',
    backgroundColor: 'rgba(0,0,0,0)',
    alignItems: 'center',
  }

  state = {
    isReceived: false,
    isReceivedFailed: false,
  };

  componentDidMount() {
    this.setIsReceivedFailedTimeout = setTimeout(() => {
      this.setState({ isReceivedFailed: true });
    }, 15 * 1000);
  }

  componentWillUnmount() {
    if (this.setIsReceivedFailedTimeout) clearTimeout(this.setIsReceivedFailedTimeout);
  }

  render() {
    if (this.state.isReceivedFailed) {
      return <AdCustom />;
    }

    let height = 50;
    if (this.props.bannerSize === 'LARGE_BANNER') {
      height = 100;
    } else if (DeviceInfo.isTablet()) {
      height = 90;
    }

    return (
      <View
        style={{
          height: this.state.isReceived ? height : 0,
          margin: this.props.margin,
          backgroundColor: this.props.backgroundColor,
          alignItems: this.props.alignItems,
          justifyContent: 'flex-end',
        }}
      >
        <ErrorBoundary>
          <Banner
            size={this.props.bannerSize}
            unitId={this.props.unitId && config.admob[this.props.unitId]}
            request={request.build()}
            onAdLoaded={() => {
              console.log('Ads received');
              setTimeout(() => {
                this.setState({ isReceived: true });
              }, 1000);
            }}
            onAdFailedToLoad={(error) => {
              console.log('Ads error', error);
              this.setState({ isReceivedFailed: true });
            }}
          />
        </ErrorBoundary>
      </View>
    );
  }
}
