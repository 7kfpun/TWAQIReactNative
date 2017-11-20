import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Platform,
  View,
} from 'react-native';

import firebase from 'react-native-firebase';

import { config } from '../config';

const AdRequest = firebase.admob.AdRequest;
const request = new AdRequest();

const Banner = firebase.admob.Banner;

export default class Admob extends Component {
  state = {
    isReceived: false,
  };

  render() {
    return (
      <View
        style={{
          height: this.state.isReceived ? 50 : 0,
          margin: this.props.margin,
          backgroundColor: this.props.backgroundColor,
          alignItems: this.props.alignItems,
          justifyContent: 'flex-end',
        }}
      >
        <Banner
          size={this.props.bannerSize}
          unitId={config.admob[Platform.OS].banner}
          request={request.build()}
          onAdLoaded={() => {
            console.log('Ads received');
            this.setState({ isReceived: true });
          }}
          onAdFailedToLoad={error => console.log('Ads error', error)}
        />
      </View>
    );
  }
}

Admob.propTypes = {
  bannerSize: PropTypes.string,
  margin: PropTypes.number,
  backgroundColor: PropTypes.string,
  alignItems: PropTypes.string,
};

Admob.defaultProps = {
  margin: 0,
  bannerSize: 'SMART_BANNER',
  backgroundColor: 'rgba(0,0,0,0)',
  alignItems: 'center',
};
