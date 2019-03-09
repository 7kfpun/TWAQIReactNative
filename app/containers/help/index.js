import React, { Component } from 'react';
import { func, shape } from 'prop-types';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { iOSColors } from 'react-native-typography';
import Ionicons from 'react-native-vector-icons/Ionicons';

import AdMob from '../../components/admob';
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
  titleBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  block: {
    paddingHorizontal: 10,
    paddingVertical: 30,
  },
  title: {
    fontSize: 24,
    color: 'black',
  },
});

export default class HelpView extends Component {
  static propTypes = {
    navigation: shape({
      goBack: func.isRequired,
    }).isRequired,
  };

  render() {
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{I18n.t('help_tab')}</Text>
          <TouchableOpacity
            onPress={() =>
              openURL(I18n.isZh ? config.feedbackUrl.zh : config.feedbackUrl.en)
            }
          >
            <Ionicons name="ios-mail" size={30} color={iOSColors.gray} />
          </TouchableOpacity>
        </View>
        <ScrollView>
          <Row
            title={I18n.t('help_definition')}
            onPress={() => {
              tracker.logEvent('help-aqi-definition');
              navigation.navigate('HelpAQI');
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
            title={I18n.t('buy_premium')}
            description={I18n.t('buy_premium_description')}
            onPress={() => {
              tracker.logEvent('help-cooperation');
              openURL(I18n.isZh ? config.partnerUrl.zh : config.partnerUrl.en);
            }}
            iconName="ios-cafe"
          />
        </ScrollView>

        <AdMob unitId={`twaqi-${Platform.OS}-help-footer`} />
      </View>
    );
  }
}
