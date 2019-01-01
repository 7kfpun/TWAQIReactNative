import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { iOSColors } from 'react-native-typography';
import Collapsible from 'react-native-collapsible';
import DeviceInfo from 'react-native-device-info';
import Search from 'react-native-search-box';

import Fuse from 'fuse.js';

import AdMob from '../elements/admob';
import HistoryGroup from '../elements/history-group';
import HistoryItem from '../elements/history-item';
import SwipeScrollView from '../elements/SwipeScrollView';

import { countys, locations } from '../utils/locations';
import I18n from '../utils/i18n';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  titleBlock: {
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingLeft: 10,
  },
  titleText: {
    fontSize: 24,
    color: 'black',
  },
  searchBlock: {
    padding: 10,
    paddingTop: 20,
    borderBottomColor: iOSColors.lightGray,
    borderBottomWidth: 1,
  },
  list: {
    paddingVertical: 30,
  },
});


export default class SettingsView extends Component {
  static propTypes = {
    navigation: PropTypes.shape({}).isRequired,
  }

  state = {
    searchText: '',
    searchResult: [],
    collapsed: false,
  };

  onChangeText = (searchText) => {
    const options = {
      shouldSort: true,
      threshold: 0.2,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: [
        'SiteName',
        'SiteEngName',
        'AreaName',
        'County',
        'Township',
        'SiteAddress',
      ],
    };
    const fuse = new Fuse(locations, options);
    const searchResult = fuse.search(searchText);

    this.setState({ searchText, searchResult });
  }

  onCancelOrDelete = () => {
    this.setState({ searchText: '' });
  }

  render() {
    const { navigation } = this.props;

    const {
      collapsed,
      searchText,
      searchResult,
    } = this.state;

    return (
      <View style={styles.container}>
        <Collapsible collapsed={collapsed}>
          <View style={styles.titleBlock}>
            <Text style={styles.titleText}>{I18n.t('list_title')}</Text>
          </View>
        </Collapsible>

        <View style={[styles.searchBlock, { marginTop: collapsed && DeviceInfo.hasNotch() ? 20 : 0 }]}>
          <Search
            backgroundColor={iOSColors.white}
            titleCancelColor={iOSColors.blue}

            onChangeText={this.onChangeText}
            onCancel={this.onCancelOrDelete}
            onDelete={this.onCancelOrDelete}
            cancelTitle={I18n.t('cancel')}
            placeholder={I18n.t('search')}
          />
        </View>

        <SwipeScrollView
          scrollActionOffset={80}
          onScrollUp={() => this.setState({ collapsed: true })}
          onScrollDown={() => this.setState({ collapsed: false })}
        >
          {!!searchText && <FlatList
            style={styles.list}
            data={searchResult}
            keyExtractor={(item, index) => `${index}-${item}`}
            renderItem={({ item }) => (
              <View style={{ paddingHorizontal: 10 }}>
                <HistoryItem item={item} navigation={navigation} />
              </View>
            )}
          />}

          {!searchText && <FlatList
            style={styles.list}
            data={countys}
            keyExtractor={(item, index) => `${index}-${item}`}
            renderItem={({ item }) => <HistoryGroup style={{ fontSize: 30 }} groupName={item} navigation={navigation} />}
          />}
        </SwipeScrollView>

        <AdMob unitId={`twaqi-${Platform.OS}-list-footer`} />
      </View>
    );
  }
}
