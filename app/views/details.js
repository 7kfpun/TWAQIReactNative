import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import firebase from 'react-native-firebase';
import Icon from 'react-native-vector-icons/MaterialIcons';

import AdMob from '../elements/admob';
import Chart from '../elements/chart';

import { indexTypes } from '../utils/indexes';
import AQIHistory from '../utils/history';
import I18n from '../utils/i18n';
import tracker from '../utils/tracker';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  titleBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingLeft: 2,
    marginBottom: 10,
  },
  block: {
    marginLeft: 10,
    paddingRight: 10,
    paddingVertical: 20,
    borderBottomColor: '#EEEEEE',
    borderBottomWidth: 1,
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
  amountText: {
    fontSize: 14,
    color: 'gray',
  },
  dateText: {
    fontSize: 10,
  },
});

export default class DetailsView extends Component {
  static navigationOptions = {
    header: null,
    tabBarLabel: I18n.t('details'),
    tabBarIcon: ({ tintColor }) => <Icon name="timeline" size={21} color={tintColor} />,
  };

  state = {
    refreshing: true,
  }

  componentDidMount() {
    this.prepareData();

    const { state } = this.props.navigation;
    const { item } = state.params;
    if (item.ImageUrl) {
      Image.getSize(item.ImageUrl, (imageWidth, imageHeight) => {
        console.log('getSize', imageWidth, imageHeight);
        this.setState({ ratio: imageHeight / imageWidth });
      });
    }
  }

  prepareData = () => {
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
      this.setState({ refreshing: false });
    });
  }

  goBack = () => {
    this.props.navigation.goBack(null);
  }

  render() {
    const { state } = this.props.navigation;
    const { item } = state.params;
    tracker.view('History-Details');
    return (
      <View style={styles.container}>
        <View style={styles.titleBlock}>
          <Icon name="chevron-left" size={40} color={'gray'} onPress={this.goBack} />
          <Text style={styles.title}>{I18n.isZh ? item.SiteName : item.SiteEngName}</Text>
        </View>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.prepareData}
            />
          }
        >
          {item.ImageUrl && <Image
            style={{ width, height: this.state.ratio * width }}
            source={{ uri: item.ImageUrl }}
          />}
          {!this.state.refreshing && indexTypes.map((indexType) => {
            const length = this.state.result.PublishTime.length;
            return (
              <View key={indexType.key} style={styles.block}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={styles.text}>{indexType.name}</Text>
                  <Text style={styles.amountText}>{`${this.state.result[indexType.key][length - 1]} ${indexType.unit}`}</Text>
                </View>

                <Chart result={this.state.result} index={indexType.key} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={styles.dateText}>{this.state.result.PublishTime[0]}</Text>
                  <Text style={styles.dateText}>{this.state.result.PublishTime[length - 1]}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
        <AdMob unitId={'twaqi-ios-details-footer'} />
      </View>
    );
  }
}
