import React, { Component } from 'react';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import firebase from 'react-native-firebase';
import Icon from 'react-native-vector-icons/MaterialIcons';

import AdMob from '../elements/admob';
import Chart from '../elements/chart';

import { indexes } from '../utils/indexes';
import AQIHistory from '../utils/history';
import I18n from '../utils/i18n';
import tracker from '../utils/tracker';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  titleBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingLeft: 2,
  },
  block: {
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    color: 'black',
    marginLeft: 2,
  },
  text: {
    fontSize: 14,
    color: 'black',
  },
  dateText: {
    fontSize: 10,
  },
});

export default class DetailsView extends Component {
  static navigationOptions = {
    header: null,
    tabBarLabel: I18n.t('details'),
    tabBarIcon: ({ tintColor }) => (
      <Icon name="timeline" size={21} color={tintColor || 'gray'} />
    ),
  };

  state = {}

  componentDidMount() {
    const { state } = this.props.navigation;
    const { item } = state.params;

    const trace = firebase.perf().newTrace('api_get_aqi_history');
    trace.start();
    AQIHistory(item.SiteName).then((result) => {
      trace.stop();
      // console.log(result);
      if (result.SiteName) {
        this.setState({ result });
      }
    });
  }

  render() {
    const { state } = this.props.navigation;
    const { item } = state.params;
    tracker.view('History-Details');
    return (
      <View style={styles.container}>
        <View style={styles.titleBlock}>
          <Icon name="chevron-left" size={40} color={'gray'} onPress={() => this.props.navigation.goBack(null)} />
          <Text style={styles.title}>{I18n.isZh ? item.SiteName : item.SiteEngName}</Text>
        </View>
        <ScrollView>
          {this.state.result && <View style={styles.block}>
            {indexes.map(i => (
              <View key={i} style={{ paddingVertical: 20, borderBottomColor: '#EEEEEE', borderBottomWidth: 1 }}>
                <Text style={styles.text}>{i}</Text>
                <Chart result={this.state.result} index={i.replace('.', '_')} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={styles.dateText}>{this.state.result.PublishTime[0]}</Text>
                  <Text style={styles.dateText}>{this.state.result.PublishTime[this.state.result.PublishTime.length - 1]}</Text>
                </View>
              </View>
            ))}
          </View>}
          {!this.state.result && <ActivityIndicator style={{ marginTop: 30 }} />}
        </ScrollView>
        <AdMob />
      </View>
    );
  }
}
