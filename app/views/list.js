import React, { Component } from 'react';
import {
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

import AdMob from '../elements/admob';
import HistoryGroup from '../elements/history-group';

import { countys } from '../utils/locations';
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
  list: {
    paddingVertical: 30,
  },
});


export default class SettingsView extends Component {
  static navigationOptions = {
    header: null,
    tabBarLabel: I18n.t('list'),
    tabBarIcon: ({ tintColor }) => <Icon name="view-list" size={22} color={tintColor} />,
  };

  state = {
    locations: countys,
  };

  render() {
    console.log(countys);
    tracker.view('History-List');
    return (
      <View style={styles.container}>
        <View style={styles.titleBlock}>
          <Text style={styles.titleText}>{I18n.t('list_title')}</Text>
        </View>

        <ScrollView>
          <FlatList
            style={styles.list}
            data={this.state.locations}
            keyExtractor={(item, index) => `${index}-${item}`}
            renderItem={({ item }) => <HistoryGroup style={{ fontSize: 30 }} groupName={item} navigation={this.props.navigation} />}
          />
        </ScrollView>
        <AdMob />
      </View>
    );
  }
}
