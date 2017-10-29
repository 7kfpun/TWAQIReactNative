import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Platform,
  View,
} from 'react-native';

import { AdMobBanner } from 'react-native-admob';

import { config } from '../config';

export default class AdmobCell extends Component {
  state = {
    isReceived: false,
  };

  render() {
    return (
      <View style={{ height: this.state.isReceived ? 50 : 0, margin: this.props.margin, backgroundColor: this.props.backgroundColor }}>
        <AdMobBanner
          bannerSize={this.props.bannerSize}
          adUnitID={config.admob[Platform.OS].banner}
          adViewDidReceiveAd={() => {
            console.log('Ads received');
            this.setState({ isReceived: true });
          }}
        />
      </View>
    );
  }
}

AdmobCell.propTypes = {
  bannerSize: PropTypes.string,
  margin: PropTypes.number,
  backgroundColor: PropTypes.string,
};

AdmobCell.defaultProps = {
  margin: 0,
  bannerSize: 'smartBannerPortrait',
  backgroundColor: 'white',
};

module.exports = AdmobCell;
