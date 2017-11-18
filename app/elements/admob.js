import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Platform,
  View,
} from 'react-native';

import { AdMobBanner } from 'react-native-admob';

import { config } from '../config';

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
        <AdMobBanner
          bannerSize={this.props.bannerSize}
          adUnitID={config.admob[Platform.OS].banner}
          onAdLoaded={() => {
            console.log('Ads received');
            this.setState({ isReceived: true });
          }}
          onAdFailedToLoad={error => console.log(error)}
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
  bannerSize: 'smartBannerPortrait',
  backgroundColor: 'rgba(0,0,0,0)',
  alignItems: 'center',
};
