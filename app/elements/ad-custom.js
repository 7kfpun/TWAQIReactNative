import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  Linking,
  Platform,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import firebase from 'react-native-firebase';
import SafariView from 'react-native-safari-view';

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
    imageUrl: '',
    destinationUrl: '',
  };

  componentDidMount() {
    firebase.config().fetch(60) // cache for 60 seconds
      .then(() => firebase.config().activateFetched())
      .then(() => firebase.config().getKeysByPrefix(`ad_custom_${this.props.client}_`))
      .then(arr => firebase.config().getValues(arr))
      .then((objects) => {
        const data = {};
        // Retrieve values
        Object.keys(objects).forEach((key) => {
          data[key] = objects[key].val();
        });

        console.log('firebase config values', data);
        if (data[`ad_custom_${this.props.client}_impression_rate`] > 0) {
          this.setState({
            isReceived: true,
            imageUrl: data[`ad_custom_${this.props.client}_image_url`],
            destinationUrl: data[`ad_custom_${this.props.client}_destination_url`],
          });
        }
      })
      .then(() => {
        tracker.logEvent(`ad-custom-${this.props.client}-impression`, {
          client: this.props.client,
          url: this.state.imageUrl,
          destinationUrl: this.state.destinationUrl,
        });
      })
      .catch(console.error);
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
