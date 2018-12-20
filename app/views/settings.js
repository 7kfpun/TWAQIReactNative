import React, { Component } from 'react';
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { iOSColors } from 'react-native-typography';
import Collapsible from 'react-native-collapsible';
import OneSignal from 'react-native-onesignal';
import Search from 'react-native-search-box';

import Fuse from 'fuse.js';

import AdMob from '../elements/admob';
import SettingsDND from '../elements/settings-dnd';
import SettingsGroup from '../elements/settings-group';
import SettingsItem from '../elements/settings-item';
import SwipeScrollView from '../elements/SwipeScrollView';

import { countys, locations } from '../utils/locations';
import { OneSignalGetTags } from '../utils/onesignal';
import I18n from '../utils/i18n';

const CHECK_INTERVAL = 60 * 1000;

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
  permissionReminderBlock: {
    backgroundColor: '#3949AB',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 1,
  },
  permissionReminderText: {
    fontSize: 12,
    color: 'white',
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
  static requestPermissions() {
    if (Platform.OS === 'ios') {
      const permissions = {
        alert: true,
        badge: true,
        sound: true,
      };
      OneSignal.requestPermissions(permissions);
      OneSignal.registerForPushNotifications();
    }
  }

  state = {
    isShowPermissionReminderBlock: false,
    searchText: '',
    searchResult: [],
    collapsed: false,
  };

  componentDidMount() {
    // Request permission on start
    SettingsView.requestPermissions();
    this.loadEnabledItems();

    this.loadEnabledItemsInterval = setInterval(() => this.loadEnabledItems(), CHECK_INTERVAL);
  }

  componentWillUnmount() {
    if (this.loadEnabledItemsInterval) clearInterval(this.loadEnabledItemsInterval);
    if (this.checkPermissionsInterval) clearInterval(this.checkPermissionsInterval);
  }

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

  checkPermissions(tags) {
    if (Platform.OS === 'ios' && tags && Object.values(tags).indexOf('true') !== -1) {
      OneSignal.checkPermissions((permissions) => {
        console.log('checkPermissions', permissions);
        if (!permissions || (permissions && !permissions.alert)) {
          this.setState({ isShowPermissionReminderBlock: true });
        } else {
          this.setState({ isShowPermissionReminderBlock: false });
        }
      });

      SettingsView.requestPermissions();
    }
  }

  async loadEnabledItems() {
    const tags = await OneSignalGetTags();
    if (JSON.stringify(tags) !== JSON.stringify(this.state.tags)) {
      this.setState({ tags, k: Math.random() });
    }

    this.checkPermissions(tags);
    this.checkPermissionsInterval = setInterval(() => this.checkPermissions(tags), CHECK_INTERVAL);
  }

  render() {
    return (
      <View style={styles.container}>
        <Collapsible collapsed={this.state.collapsed}>
          <View style={styles.titleBlock}>
            <Text style={styles.titleText}>{I18n.t('notify_title')}</Text>
          </View>
        </Collapsible>

        {this.state.isShowPermissionReminderBlock &&
          <View style={styles.permissionReminderBlock}>
            <Text style={styles.permissionReminderText}>{I18n.t('permissions_required')}</Text>
          </View>}

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

        <SwipeScrollView
          scrollActionOffset={80}
          onScrollUp={() => this.setState({ collapsed: true })}
          onScrollDown={() => this.setState({ collapsed: false })}
        >
          {!!this.state.searchText && <FlatList
            key={this.state.k}
            style={styles.list}
            data={this.state.searchResult}
            keyExtractor={(item, index) => `${index}-${item}`}
            renderItem={({ item }) => (
              <View style={{ paddingHorizontal: 10 }}>
                <SettingsItem
                  item={item}
                  tags={this.state.tags}
                />
              </View>
            )}
          />}

          {!this.state.searchText &&
            <View key={this.state.k}>
              <SettingsDND tags={this.state.tags} />
              <FlatList
                style={styles.list}
                data={countys}
                keyExtractor={(item, index) => `${index}-${item}`}
                renderItem={({ item }) => (<SettingsGroup
                  groupName={item}
                  tags={this.state.tags}
                  onToggle={() => this.loadEnabledItems()}
                />)}
              />
            </View>}
        </SwipeScrollView>

        <AdMob unitId={`twaqi-${Platform.OS}-settings-footer`} />
      </View>
    );
  }
}
