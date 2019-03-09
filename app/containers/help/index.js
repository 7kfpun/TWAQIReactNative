import React, { Component } from 'react';
import { func, shape } from 'prop-types';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';

import store from 'react-native-simple-store';

import AdMob from '../../components/admob';
import Header from '../../components/header';

import Row from './components/row';

import { openURL } from '../../utils/helpers';
import I18n from '../../utils/i18n';
import tracker from '../../utils/tracker';

import { config } from '../../config';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default class HelpView extends Component {
  state = {
    isAdFree: false,
  };

  componentDidMount() {
    this.checkIsAdFree();
  }

  checkIsAdFree = async () => {
    const currentSubscription = await store.get('currentSubscription');
    if (currentSubscription === 'adfree') {
      this.setState({ isAdFree: true });
    }
  };

  render() {
    const { navigation } = this.props;
    const { isAdFree } = this.state;

    return (
      <View style={styles.container}>
        <Header
          title={I18n.t('help_tab')}
          iconName="ios-mail"
          onPress={() =>
            openURL(I18n.isZh ? config.feedbackUrl.zh : config.feedbackUrl.en)
          }
        />

        <ScrollView>
          <Row
            title={I18n.t('help_definition')}
            onPress={() => {
              tracker.logEvent('help-aqi-definition');
              navigation.navigate('HelpDefinition');
            }}
          />

          <Row
            title={I18n.t('help.AQI')}
            onPress={() => {
              tracker.logEvent('help-aqi-wiki');
              openURL(I18n.t('help.AQI_url'));
            }}
          />

          <Row
            title={I18n.t('help.PM2_5')}
            onPress={() => {
              tracker.logEvent('help-particulates-wiki');
              openURL(I18n.t('help.particulates_url'));
            }}
          />

          <Row
            title={I18n.t('help.O3')}
            onPress={() => {
              tracker.logEvent('help-o3-wiki');
              openURL(I18n.t('help.O3_url'));
            }}
          />

          <Row
            title={I18n.t('help.CO')}
            onPress={() => {
              tracker.logEvent('help-co-wiki');
              openURL(I18n.t('help.CO_url'));
            }}
          />

          <Row
            title={I18n.t('help.SO2')}
            onPress={() => {
              tracker.logEvent('help-so2-wiki');
              openURL(I18n.t('help.SO2_url'));
            }}
          />

          <Row
            title={I18n.t('help.NO2')}
            onPress={() => {
              tracker.logEvent('help-no2-wiki');
              openURL(I18n.t('help.NO2_url'));
            }}
          />

          <Row
            title={I18n.t('help_cooperation')}
            onPress={() => {
              tracker.logEvent('help-cooperation');
              openURL(I18n.isZh ? config.partnerUrl.zh : config.partnerUrl.en);
            }}
            iconName="ios-briefcase"
          />

          <Row
            title={I18n.t('help.buy_premium.title')}
            description={I18n.t('help.buy_premium.description')}
            onPress={() => {
              tracker.logEvent('help-adfree');
              navigation.navigate('HelpAdfree');
            }}
            iconName="ios-cafe"
            disabled={isAdFree}
          />
        </ScrollView>

        <AdMob unitId={`twaqi-${Platform.OS}-help-footer`} />
      </View>
    );
  }
}

HelpView.propTypes = {
  navigation: shape({
    goBack: func.isRequired,
  }).isRequired,
};
