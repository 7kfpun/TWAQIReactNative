import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
} from 'react-native';

import DeviceInfo from 'react-native-device-info';
import firebase from 'react-native-firebase';

import ErrorBoundary from './error-boundary';

import { config } from '../config';

const { AdRequest, Banner } = firebase.admob;
const request = new AdRequest();

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

  render() {
    if (this.state.isReceivedFailed) {
      return null;
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
              this.setState({ isReceived: true });
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
