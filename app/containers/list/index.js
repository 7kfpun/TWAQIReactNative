import React, { Component } from 'react';
import { shape } from 'prop-types';
import { FlatList, Platform, StyleSheet, Text, View } from 'react-native';

import { iOSColors } from 'react-native-typography';
import Collapsible from 'react-native-collapsible';
import DeviceInfo from 'react-native-device-info';
import firebase from 'react-native-firebase';
import Search from 'react-native-search-box';

import Fuse from 'fuse.js';

import AdMob from '../../components/admob';
import SwipeScrollView from '../../components/swipe-scroll-view';

import HistoryGroup from './components/history-group';
import HistoryItem from './components/history-item';

import { aqi } from '../../utils/api';
import { countys, locations } from '../../utils/locations';
import I18n from '../../utils/i18n';

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
    navigation: shape({}).isRequired,
  };

  state = {
    searchText: '',
    searchResult: [],
    collapsed: false,
    aqiResult: {},
  };

  componentDidMount() {
    this.prepareData();
  }

  onChangeText = searchText => {
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
  };

  onCancelOrDelete = () => {
    this.setState({ searchText: '' });
  };

  prepareData() {
    const that = this;
    const trace = firebase.perf().newTrace('api_get_aqi');
    trace.start();
    aqi().then(result => {
      const keys = Object.keys(result || {}).length;
      console.log('AQI:', result);
      console.log('AQI length:', keys);
      if (result && keys > 0) {
        that.setState({ aqiResult: result });
      }

      that.setState({ isLoading: false });
      trace.stop();
    });
  }

  render() {
    const { navigation } = this.props;
    const { aqiResult, collapsed, searchText, searchResult } = this.state;

    return (
      <View style={styles.container}>
        <Collapsible collapsed={collapsed}>
          <View style={styles.titleBlock}>
            <Text style={styles.titleText}>{I18n.t('list_title')}</Text>
          </View>
        </Collapsible>

        <View
          style={[
            styles.searchBlock,
            { marginTop: collapsed && DeviceInfo.hasNotch() ? 20 : 0 },
          ]}
        >
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
          {!!searchText && (
            <FlatList
              style={styles.list}
              data={searchResult}
              keyExtractor={(item, index) => `${index}-${item}`}
              renderItem={({ item }) => (
                <View style={{ paddingHorizontal: 10 }}>
                  <HistoryItem
                    item={item}
                    aqi={aqiResult[item.SiteName]}
                    navigation={navigation}
                  />
                </View>
              )}
            />
          )}

          {!searchText && (
            <FlatList
              style={styles.list}
              data={countys}
              keyExtractor={(item, index) => `${index}-${item}`}
              renderItem={({ item }) => (
                <HistoryGroup
                  style={{ fontSize: 30 }}
                  groupName={item}
                  aqiResult={aqiResult}
                  navigation={navigation}
                />
              )}
            />
          )}
        </SwipeScrollView>

        <AdMob unitId={`twaqi-${Platform.OS}-list-footer`} />
      </View>
    );
  }
}
