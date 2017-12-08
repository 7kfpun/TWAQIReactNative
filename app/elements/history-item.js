import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

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
  },
  addressText: {
    fontWeight: '300',
    fontSize: 14,
    color: '#666666',
  },
});

export default class HistoryItem extends Component {
  static propTypes = {
    // navigation: React.PropTypes.object.isRequired,
    item: PropTypes.shape({
      SiteName: PropTypes.string,
      SiteEngName: PropTypes.string,
      AreaName: PropTypes.string,
      County: PropTypes.string,
      Township: PropTypes.string,
      SiteAddress: PropTypes.string,
      TWD97Lon: PropTypes.string,
      TWD97Lat: PropTypes.string,
      SiteType: PropTypes.string,
    }).isRequired,
  }

  render() {
    const item = this.props.item;
    const navigation = this.props.navigation;
    return (<TouchableOpacity
      onPress={() => navigation.navigate('HistoryDetails', { item })}
    >
      <View style={styles.container}>
        <Text style={styles.text}>{I18n.isZh ? item.SiteName : item.SiteEngName}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.addressText}>{I18n.isZh ? item.SiteAddress : ''}</Text>
          <Icon name="chevron-right" size={21} color={'gray'} />
        </View>
      </View>
    </TouchableOpacity>);
  }
}
