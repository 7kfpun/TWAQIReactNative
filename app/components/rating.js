import React, { Component } from 'react';
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

import * as Animatable from 'react-native-animatable';
import * as StoreReview from 'react-native-store-review';
import Icon from 'react-native-vector-icons/MaterialIcons';
import StarRating from 'react-native-star-rating';
import store from 'react-native-simple-store';

import I18n from '../utils/i18n';
import tracker from '../utils/tracker';
import { openURL } from '../utils/helpers';

import { config } from '../config';

const { height } = Dimensions.get('window');

const RATING_VERSION = 1;
const STARS_TO_APP_STORE = 4;
const SHOW_RATING_AFTER = 30 * 60 * 1000;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: height / 3,
    margin: 15,
    padding: 15,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: 8,
  },
  button: {
    marginTop: 6,
    padding: 10,
    backgroundColor: '#3B5998',
    borderRadius: 2,
  },
  ratingTitleText: {
    fontSize: 14,
    marginTop: 20,
  },
  ratingDescriptionText: {
    fontSize: 12,
    marginVertical: 15,
    textAlign: 'center',
  },
  feedbackDescriptionText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
  close: {
    position: 'absolute',
    padding: 5,
    top: 6,
    right: 10,
  },
});

export default class Rating extends Component {
  static openFeedbackUrl() {
    const url = I18n.isZh ? config.feedbackUrl.zh : config.feedbackUrl.en;
    openURL(url);
  }

  state = {
    starCount: 0,
    isRatingClose: true,
  };

  componentDidMount() {
    const that = this;
    store.get(`isRatingGiven.${RATING_VERSION}`).then(isRatingGiven => {
      if (isRatingGiven) {
        that.setState({ isRatingClose: true });
      } else {
        this.showRatingBlockTimeout = setTimeout(() => {
          that.setState({ isRatingClose: false });
        }, SHOW_RATING_AFTER);
      }
    });
  }

  componentWillUnmount() {
    if (this.showRatingBlockTimeout) clearTimeout(this.showRatingBlockTimeout);
  }

  onStarRatingPress(rating) {
    this.setState({
      starCount: rating,
    });

    let type;
    if (rating >= STARS_TO_APP_STORE) {
      if (StoreReview.isAvailable) {
        StoreReview.requestReview();
        type = 'inapp-store-review';
      } else if (Platform.OS === 'ios') {
        openURL(config.appStore);
        type = 'apple-store';
      } else if (Platform.OS === 'android') {
        openURL(config.googlePlay);
        type = 'google-play';
      }
    }

    store.save(`isRatingGiven.${RATING_VERSION}`, true);
    tracker.logEvent('give-rating', { type, rating: String(rating) });
  }

  render() {
    if (this.state.isRatingClose) {
      return null;
    }

    return (
      <Animatable.View style={styles.container} animation="fadeIn">
        <TouchableOpacity
          style={styles.close}
          onPress={() => this.setState({ isRatingClose: true })}
        >
          <Icon name="clear" size={24} color="#616161" />
        </TouchableOpacity>

        <Animatable.View animation="tada" iterationCount="infinite">
          <Icon name="thumb-up" size={32} color="#616161" />
        </Animatable.View>
        <Text style={styles.ratingTitleText}>{I18n.t('rating_title')}</Text>
        <Text style={styles.ratingDescriptionText}>
          {I18n.t('rating_description')}
        </Text>
        <StarRating
          starSize={36}
          rating={this.state.starCount}
          selectedStar={rating => this.onStarRatingPress(rating)}
        />
        {this.state.starCount > 0 && this.state.starCount < STARS_TO_APP_STORE && (
          <TouchableOpacity onPress={() => Rating.openFeedbackUrl()}>
            <Animatable.View style={styles.button} animation="fadeIn">
              <Text style={styles.feedbackDescriptionText}>
                {I18n.t('feedback_description')}
              </Text>
            </Animatable.View>
          </TouchableOpacity>
        )}
      </Animatable.View>
    );
  }
}
