import React, { Component } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

import Communications from 'react-native-communications';

import AdMob from '../elements/admob';

import I18n from '../utils/i18n';
import tracker from '../utils/tracker';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  titleBlock: {
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingLeft: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: 'black',
  },
  emailBlock: {
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  emailText: {
    paddingVertical: 10,
  },
});

export default class ContactView extends Component {
  static navigationOptions = {
    header: null,
    tabBarLabel: I18n.t('contact'),
    tabBarIcon: ({ tintColor }) => (
      <Icon name="email" size={21} color={tintColor || 'gray'} />
    ),
  };

  render() {
    const email = 'info@dllm.io';
    tracker.view('Help');
    return (
      <View style={styles.container}>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{I18n.t('contact_title')}</Text>
        </View>
        <ScrollView>
          <TouchableOpacity onPress={() => Communications.email([email], null, null, '「台灣空氣品質指標」改進意見', '')} >
            <View style={styles.emailBlock}>
              <Text style={styles.emailText}>{I18n.t('feedback_description')}</Text>
              <Text style={[styles.emailText, { textDecorationLine: 'underline' }]}>{email}</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
        <AdMob />
      </View>
    );
  }
}
