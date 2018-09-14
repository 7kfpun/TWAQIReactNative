import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { getAd } from '../utils/firebase-config';
import { openURL } from '../utils/helpers';
import tracker from '../utils/tracker';

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
    destinationUrl: '',
    imageUrl: '',
  };

  async componentDidMount() {
    const { client } = this.props;

    const ad = await getAd(client);
    if (ad.impressionRate > 0 && ad.destinationUrl && ad.imageUrl) {
      this.setState({
        isReceived: true,
        destinationUrl: ad.destinationUrl,
        imageUrl: ad.imageUrl,
      });

      tracker.logEvent(`ad-custom-${client}-impression`, {
        client,
        destinationUrl: ad.destinationUrl,
        imageUrl: ad.imageUrl,
      });
    }
  }

  onOpenAd = (imageUrl, destinationUrl) => {
    const { client } = this.props;
    openURL(destinationUrl);

    tracker.logEvent(`ad-custom-${client}-click`, {
      client,
      destinationUrl,
      imageUrl,
    });
  }

  render() {
    const { margin, backgroundColor, alignItems } = this.props;
    const { isReceived, destinationUrl, imageUrl } = this.state;

    if (!isReceived) {
      return null;
    }

    return (
      <TouchableWithoutFeedback
        onPress={() => this.onOpenAd(imageUrl, destinationUrl)}
      >
        <View
          style={{
            height: 50,
            margin,
            backgroundColor,
            alignItems,
            justifyContent: 'flex-end',
          }}
        >
          <Image
            style={{ width: 320, height: 50 }}
            source={{
              uri: imageUrl,
            }}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
