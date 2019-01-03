import React, { Component } from 'react';
import { shape, string } from 'prop-types';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

import I18n from '../utils/i18n';
import tracker from '../utils/tracker';

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 16,
    color: 'black',
  },
  addressText: {
    fontWeight: '300',
    fontSize: 14,
    color: '#666666',
  },
});

export default class HistoryItem extends Component {
  static propTypes = {
    navigation: shape({}).isRequired,
    item: shape({
      SiteName: string,
      SiteEngName: string,
      AreaName: string,
      County: string,
      Township: string,
      SiteAddress: string,
      TWD97Lon: string,
      TWD97Lat: string,
      SiteType: string,
    }).isRequired,
  };

  render() {
    const { item, navigation } = this.props;
    return (
      <TouchableOpacity
        onPress={() => {
          tracker.logEvent('check-list-details', item);
          navigation.navigate('HistoryDetails', { item });
        }}
      >
        <View style={styles.container}>
          <Text style={styles.text}>
            {I18n.isZh ? item.SiteName : item.SiteEngName}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.addressText}>
              {I18n.isZh ? item.SiteAddress : ''}
            </Text>
            <Icon name="chevron-right" size={21} color="gray" />
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
