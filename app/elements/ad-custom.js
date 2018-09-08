import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  Linking,
  Platform,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import SafariView from 'react-native-safari-view';

import tracker from '../utils/tracker';
import { getAd } from '../utils/firebase-config';

export default class AdCustom extends Component {
  static propTypes = {
    margin: PropTypes.number,
    backgroundColor: PropTypes.string,
    alignItems: PropTypes.string,
    client: PropTypes.string,
  }

  static defaultProps = {
    margin: 0,
    backgroundColor: 'rgba(0,0,0,0)',
    alignItems: 'center',
    client: 'self',
  }

  state = {
    isReceived: false,
    imageUrl: '',
    destinationUrl: '',
  };

  async componentDidMount() {
    const ad = await getAd(this.props.client);
    if (ad.impressionRate > 0) {
      this.setState({
        isReceived: true,
        imageUrl: ad.imageUrl,
        destinationUrl: ad.destinationUrl,
      });
    }

    tracker.logEvent(`ad-custom-${this.props.client}-impression`, {
      client: this.props.client,
      url: ad.imageUrl,
      destinationUrl: ad.destinationUrl,
    });
  }

  onOpenAd = (url) => {
    if (Platform.OS === 'ios') {
      SafariView.isAvailable()
        .then(SafariView.show({ url }))
        .catch((error) => {
          console.log(error);
          Linking.openURL(url);
        });
    } else {
      Linking.openURL(url);
    }
    tracker.logEvent(`ad-custom-${this.props.client}-click`, {
      url,
      client: this.props.client,
    });
  }

  render() {
    if (!this.state.isReceived) {
      return null;
    }

    return (
      <TouchableWithoutFeedback
        onPress={() => this.onOpenAd(this.state.destinationUrl)}
      >
        <View
          style={{
            height: 50,
            margin: this.props.margin,
            backgroundColor: this.props.backgroundColor,
            alignItems: this.props.alignItems,
            justifyContent: 'flex-end',
          }}
        >
          <Image
            style={{ width: 320, height: 50 }}
            source={{
              uri: this.state.imageUrl,
            }}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
