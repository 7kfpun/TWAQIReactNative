import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Platform,
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

    const height = DeviceInfo.isTablet() ? 90 : 50;

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
            unitId={(this.props.unitId && config.admob[Platform.OS][this.props.unitId]) || config.admob[Platform.OS].banner}
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
