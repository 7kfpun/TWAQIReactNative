import React, { Component } from 'react';
import { number, string } from 'prop-types';
import { View } from 'react-native';

import DeviceInfo from 'react-native-device-info';
import firebase from 'react-native-firebase';
import store from 'react-native-simple-store';

import AdCustom from './ad-custom';

import { config } from '../config';
import { getAd } from '../utils/firebase-config';

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
    bannerSize: string,
    unitId: string,
    margin: number,
    backgroundColor: string,
    alignItems: string,
  };

  static defaultProps = {
    margin: 0,
    unitId: null,
    bannerSize: 'BANNER',
    backgroundColor: 'rgba(0,0,0,0)',
    alignItems: 'center',
  };

  state = {
    isReceived: false,
    isReceivedFailed: false,
    isShowAdCustom: false,
  };

  componentDidMount() {
    this.setIsReceivedFailedTimeout = setTimeout(() => {
      if (!this.state.isReceived && !this.state.isShowAdCustom) {
        this.setState({ isReceivedFailed: true });
      }
    }, 60 * 1000);

    this.checkIsAdFree();

    this.checkShinbaAd();
    this.checkShinbaAdInterval = setInterval(() => {
      this.checkShinbaAd();
    }, 60 * 1000);
  }

  componentWillUnmount() {
    if (this.setIsReceivedFailedTimeout)
      clearTimeout(this.setIsReceivedFailedTimeout);
    if (this.checkShinbaAdInterval) clearInterval(this.checkShinbaAdInterval);
  }

  checkIsAdFree = async () => {
    const currentSubscription = await store.get('currentSubscription');
    if (currentSubscription === 'adfree') {
      this.setState({ isAdFree: true });
    }
  };

  checkShinbaAd = async () => {
    const ad = await getAd('shinba');
    const isShowAdCustom = ad.impressionRate > Math.random();
    console.log('isShowAdCustom', isShowAdCustom);

    if (isShowAdCustom && ad.impressionRate > 0) {
      this.setState({
        isShowAdCustom: true,
        key: Math.random(),
      });
    } else {
      this.setState({
        isShowAdCustom: false,
      });
    }
  };

  render() {
    const { margin, backgroundColor, alignItems, unitId } = this.props;
    const {
      isAdFree,
      isReceivedFailed,
      isShowAdCustom,
      isReceived,
    } = this.state;

    if (isAdFree) {
      return null;
    }

    if (isReceivedFailed) {
      return <AdCustom />;
    }

    if (isShowAdCustom) {
      return <AdCustom client="shinba" />;
    }

    let { bannerSize } = this.props;
    let height = 50;
    if (bannerSize === 'LARGE_BANNER') {
      height = 100;
    } else if (DeviceInfo.isTablet()) {
      height = 90;
      bannerSize = 'SMART_BANNER';
    }

    return (
      <View
        style={{
          height: isReceived ? height : 0,
          margin,
          backgroundColor,
          alignItems,
          justifyContent: 'flex-end',
        }}
      >
        <Banner
          key={this.state.key}
          size={bannerSize}
          unitId={unitId && config.admob[unitId]}
          request={request.build()}
          onAdLoaded={() => {
            console.log('Ads received');
            setTimeout(() => {
              this.setState({ isReceived: true });
            }, 1000);
          }}
          onAdFailedToLoad={error => {
            console.log('Ads error', error);
            this.setState({ isReceivedFailed: true });
          }}
        />
      </View>
    );
  }
}
