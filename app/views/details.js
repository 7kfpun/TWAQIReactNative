import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Dimensions,
  ImageBackground,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import moment from 'moment';

import { iOSColors } from 'react-native-typography';
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
    backgroundColor: iOSColors.customGray,
  },
  titleContainer: {
    // position: 'absolute',
    // top: 0,
    // left: 0,
    // right: 0,
  },
  titleBody: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: 12,
    paddingBottom: 5,
    backgroundColor: iOSColors.white,
    // backgroundColor: 'rgba(55,55,55,0.7)',
  },
  imageBackground: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingBottom: 5,
  },
  block: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderBottomColor: '#EEEEEE',
    borderBottomWidth: 1,
    backgroundColor: 'white',
  },
  currentBlock: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginLeft: 10,
    // color: 'white',
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

  state = {
    refreshing: true,
    realtimeWeatherData: {},
  }

  componentDidMount() {
    const {
      navigation: {
        state: {
          params: {
            item,
          },
        },
      },
    } = this.props;

    this.prepareData();
    this.getRealtimeWeather(item);

    if (item.ImageUrl) {
      Image.getSize(item.ImageUrl, (imageWidth, imageHeight) => {
        console.log('getSize', imageWidth, imageHeight);
        this.setState({ ratio: imageHeight / imageWidth });
      });
    }
  }

  getRealtimeWeather = (item) => {
    realtimeWeather(item.TWD97Lat, item.TWD97Lon).then((result) => {
      this.setState({ realtimeWeatherData: result });
    });
  }

  prepareData = () => {
    const {
      navigation: {
        state: {
          params: {
            item,
          },
        },
      },
    } = this.props;

    const trace = firebase.perf().newTrace('api_get_aqi_history');
    trace.start();
    history(item.SiteName).then((result) => {
      trace.stop();
      if (result.data) {
        this.setState({ result: result.data });
      }
      this.setState({ refreshing: false });
    });
  }

  goBack = () => {
    this.props.navigation.goBack(null);
  }

  increaseEnabledCount = () => console.log()

  descreaseEnabledCount = () => console.log()

  render() {
    const weatherIconMapping = {
      '01': moment().format('H') >= 6 && moment().format('H') < 18 ? 'ios-sunny' : 'ios-moon',
      '02': 'ios-cloud-outline',
      '03': 'ios-cloud',
      26: 'ios-rainy',
      99: false,
    };

    const {
      navigation: {
        state: {
          params: {
            item,
          },
        },
      },
    } = this.props;

    const { realtimeWeatherData } = this.state;

    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.titleContainer} onPress={this.goBack}>
          <View style={styles.titleBody}>
            <Ionicons name="ios-arrow-back" size={30} color="black" />
            <Text style={styles.title}>{I18n.isZh ? item.SiteName : item.SiteEngName}</Text>
            <View />
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
          {item.ImageUrl &&
            <ImageBackground
              style={{ width, height: this.state.ratio * width, justifyContent: 'flex-end' }}
              source={{ uri: item.ImageUrl }}
            >
              <View style={styles.imageBackground}>
                <View>
                  <Text style={{ color: 'white' }}>{`${realtimeWeatherData.Temp || '- '}℃`}</Text>
                  {realtimeWeatherData.WeatherIcon
                    && weatherIconMapping[realtimeWeatherData.WeatherIcon]
                    && <Ionicons name={weatherIconMapping[realtimeWeatherData.WeatherIcon]} style={{ marginLeft: 4 }} size={32} color="black" />}
                </View>
                {I18n.isZh && <Text style={{ color: 'white' }}>{item.SiteAddress}</Text>}
              </View>
            </ImageBackground>}

          {!item.ImageUrl && I18n.isZh &&
            <View style={{ padding: 10, backgroundColor: 'white' }}>
              <Text style={styles.addressText}>{item.SiteAddress}</Text>
            </View>}

          <RealtimeWeather realtimeWeatherData={realtimeWeatherData} />

          <View style={{ padding: 10, backgroundColor: 'white' }}>
            <SettingsItem
              text={I18n.t('notify_title')}
              item={item}
              isNeedLoad
              increaseEnabledCount={this.increaseEnabledCount}
              descreaseEnabledCount={this.descreaseEnabledCount}
            />
          </View>

          <IndicatorHorizontal />

          {!this.state.refreshing && this.state.result && indexTypes.map((indexType) => {
            const { length } = this.state.result;
            return (
              <View key={indexType.key} style={styles.block}>
                <View style={styles.currentBlock}>
                  <Marker
                    amount={this.state.result[length - 1][indexType.key.replace('_', '')]}
                    index={indexType.name}
                    isNumericShow={true}
                  />
                  <Text style={styles.text}>{indexType.name}</Text>
                  <Text style={styles.unitText}>{indexType.unit}</Text>
                </View>

                <View style={{ width: width - 80 }}>
                  <Chart result={this.state.result} index={indexType.key} />
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.dateText}>{moment(this.state.result[0].publish_time).format('lll')}</Text>
                    <Text style={styles.dateText}>{moment(this.state.result[length - 1].publish_time).format('lll')}</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>

        <AdMob unitId={`twaqi-${Platform.OS}-details-footer`} bannerSize="LARGE_BANNER" />
      </View>
    );
  }
}
