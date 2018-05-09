import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { iOSColors } from 'react-native-typography';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SafariView from 'react-native-safari-view';

import AdMob from '../elements/admob';

import I18n from '../utils/i18n';
import tracker from '../utils/tracker';

import { config } from '../config';

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
  row: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 16,
    color: 'black',
  },
});

export default class HelpView extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      goBack: PropTypes.func.isRequired,
    }).isRequired,
  }

  static navigationOptions = {
    header: null,
    tabBarLabel: I18n.t('help_tab'),
    tabBarIcon: ({ tintColor, focused }) => <Ionicons name={focused ? 'ios-help-circle' : 'ios-help-circle-outline'} size={21} color={tintColor} />,
  };

  static openUrl(url) {
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
  }

  render() {
    const {
      navigation,
    } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{I18n.t('help_tab')}</Text>
          <TouchableOpacity onPress={() => HelpView.openUrl(I18n.isZh ? config.feedbackUrl.zh : config.feedbackUrl.en)}>
            <Ionicons name="ios-mail-outline" size={30} color={iOSColors.gray} />
          </TouchableOpacity>
        </View>
        <ScrollView>
          <TouchableOpacity
            style={styles.row}
            onPress={() => {
              tracker.logEvent('help-aqi-definition');
              navigation.navigate('HelpAQI');
            }}
          >
            <Text style={styles.text}>{I18n.t('help_definition')}</Text>
            <Icon name="chevron-right" size={21} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.row}
            onPress={() => {
              tracker.logEvent('help-aqi-wiki');
              HelpView.openUrl(I18n.t('help.aqi_url'));
            }}
          >
            <Text style={styles.text}>{I18n.t('help.aqi')}</Text>
            <Icon name="chevron-right" size={21} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.row}
            onPress={() => {
              tracker.logEvent('help-particulates-wiki');
              HelpView.openUrl(I18n.t('help.particulates_url'));
            }}
          >
            <Text style={styles.text}>{I18n.t('help.particulates')}</Text>
            <Icon name="chevron-right" size={21} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.row}
            onPress={() => {
              tracker.logEvent('help-o3-wiki');
              HelpView.openUrl(I18n.t('help.o3_url'));
            }}
          >
            <Text style={styles.text}>{I18n.t('help.o3')}</Text>
            <Icon name="chevron-right" size={21} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.row}
            onPress={() => {
              tracker.logEvent('help-co-wiki');
              HelpView.openUrl(I18n.t('help.co_url'));
            }}
          >
            <Text style={styles.text}>{I18n.t('help.co')}</Text>
            <Icon name="chevron-right" size={21} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.row}
            onPress={() => {
              tracker.logEvent('help-so2-wiki');
              HelpView.openUrl(I18n.t('help.so2_url'));
            }}
          >
            <Text style={styles.text}>{I18n.t('help.so2')}</Text>
            <Icon name="chevron-right" size={21} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.row}
            onPress={() => {
              tracker.logEvent('help-no2-wiki');
              HelpView.openUrl(I18n.t('help.no2_url'));
            }}
          >
            <Text style={styles.text}>{I18n.t('help.no2')}</Text>
            <Icon name="chevron-right" size={21} color="gray" />
          </TouchableOpacity>
        </ScrollView>

        <AdMob unitId={`twaqi-${Platform.OS}-help-footer`} />
      </View>
    );
  }
}
