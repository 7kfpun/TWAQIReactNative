import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { iOSColors } from 'react-native-typography';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Search from 'react-native-search-box';

import Fuse from 'fuse.js';

import AdMob from '../elements/admob';
import HistoryGroup from '../elements/history-group';
import HistoryItem from '../elements/history-item';

import { countys, locations } from '../utils/locations';
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
    paddingBottom: 10,
  },
  titleText: {
    fontSize: 24,
    color: 'black',
  },
  searchBlock: {
    padding: 10,
    borderBottomColor: iOSColors.lightGray,
    borderBottomWidth: 1,
  },
  list: {
    paddingVertical: 30,
  },
});


export default class SettingsView extends Component {
  static navigationOptions = {
    header: null,
    tabBarLabel: I18n.t('list'),
    tabBarIcon: ({ tintColor }) => <Ionicons name="ios-list-outline" size={26} color={tintColor} />,
  };

  static propTypes = {
    navigation: PropTypes.shape({}).isRequired,
  }

  state = {
    searchText: '',
    searchResult: [],
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
    tracker.view('History-List');
    return (
      <View style={styles.container}>
        <View style={styles.titleBlock}>
          <Text style={styles.titleText}>{I18n.t('list_title')}</Text>
        </View>

        <View style={styles.searchBlock}>
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

        <ScrollView>
          {!!this.state.searchText && <FlatList
            style={styles.list}
            data={this.state.searchResult}
            keyExtractor={(item, index) => `${index}-${item}`}
            renderItem={({ item }) => (
              <View style={{ paddingHorizontal: 10 }}>
                <HistoryItem item={item} navigation={this.props.navigation} />
              </View>
            )}
          />}

          {!this.state.searchText && <FlatList
            style={styles.list}
            data={countys}
            keyExtractor={(item, index) => `${index}-${item}`}
            renderItem={({ item }) => <HistoryGroup style={{ fontSize: 30 }} groupName={item} navigation={this.props.navigation} />}
          />}
        </ScrollView>
        <AdMob unitId="twaqi-ios-list-footer" />
      </View>
    );
  }
}
