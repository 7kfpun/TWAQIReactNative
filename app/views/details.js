import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Dimensions,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import firebase from 'react-native-firebase';
import Ionicons from 'react-native-vector-icons/Ionicons';

import AdMob from '../elements/admob';
import Chart from '../elements/chart';
import IndicatorHorizontal from '../elements/indicator-horizontal';
import Marker from '../elements/marker';
import RealtimeWeather from '../elements/realtime-weather';
import SettingsItem from '../elements/settings-item';

import { history, realtimeWeather } from '../utils/api';
import { indexTypes } from '../utils/indexes';
import I18n from '../utils/i18n';

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
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  block: {
    flexDirection: 'row',
    marginLeft: 10,
    paddingRight: 10,
    paddingVertical: 20,
    borderBottomColor: '#EEEEEE',
    borderBottomWidth: 1,
  },
  currentBlock: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginLeft: 10,
    color: 'black',
  },
  text: {
    marginTop: 4,
    fontSize: 12,
    color: 'black',
  },
  unitText: {
    fontSize: 10,
    color: 'gray',
  },
  dateText: {
    fontSize: 10,
  },
  addressText: {
    marginTop: 10,
    color: 'black',
  },
});

export default class DetailsView extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      state: PropTypes.shape({}).isRequired,
      goBack: PropTypes.func.isRequired,
    }).isRequired,
  }

  static navigationOptions = () => ({
    header: null,
    tabBarLabel: I18n.t('details'),
    tabBarIcon: ({ tintColor, focused }) => <Ionicons name={focused ? 'ios-stats' : 'ios-stats-outline'} size={21} color={tintColor} />,
  })

  state = {
    refreshing: true,
    realtimeWeatherData: {},
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
    history(item.SiteName).then((result) => {
      trace.stop();
      // console.log(result);
      if (result.SiteName) {
        this.setState({ result });
      }
      this.setState({ refreshing: false });
    });

    this.getRealtimeWeather(item);
  }

  getRealtimeWeather = (item) => {
    console.log('itemitemitem', item);
    realtimeWeather(item.TWD97Lat, item.TWD97Lon).then((result) => {
      this.setState({ realtimeWeatherData: result });
    });
  }

  goBack = () => {
    this.props.navigation.goBack(null);
  }

  increaseEnabledCount = () => console.log()

  descreaseEnabledCount = () => console.log()

  render() {
    const { state } = this.props.navigation;
    const { item } = state.params;

    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.goBack} >
          <View style={styles.titleBlock}>
            <Ionicons name="ios-arrow-back-outline" size={30} color="gray" />
            <Text style={styles.title}>{I18n.isZh ? item.SiteName : item.SiteEngName}</Text>
          </View>
        </TouchableOpacity>


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

          <View style={{ padding: 10 }}>
            <RealtimeWeather realtimeWeatherData={this.state.realtimeWeatherData} />

            <SettingsItem
              text={I18n.t('notify_title')}
              item={item}
              tags={this.state.tags || {}}
              increaseEnabledCount={this.increaseEnabledCount}
              descreaseEnabledCount={this.descreaseEnabledCount}
            />

            {I18n.isZh && <Text style={styles.addressText}>{item.SiteAddress}</Text>}
          </View>

          <IndicatorHorizontal />

          {!this.state.refreshing && indexTypes.map((indexType) => {
            const { length } = this.state.result.PublishTime;
            return (
              <View key={indexType.key} style={styles.block}>
                <View style={styles.currentBlock}>
                  <Marker
                    amount={this.state.result[indexType.key][length - 1]}
                    index={indexType.name}
                    isNumericShow={true}
                  />
                  <Text style={styles.text}>{indexType.name}</Text>
                  <Text style={styles.unitText}>{indexType.unit}</Text>
                </View>

                <View style={{ width: width - 80 }}>
                  <Chart result={this.state.result} index={indexType.key} />
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.dateText}>{this.state.result.PublishTime[0]}</Text>
                    <Text style={styles.dateText}>{this.state.result.PublishTime[length - 1]}</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
        <AdMob unitId="twaqi-ios-details-footer" bannerSize="LARGE_BANNER" />
      </View>
    );
  }
}
