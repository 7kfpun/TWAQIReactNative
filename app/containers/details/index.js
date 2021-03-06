import React, { Component } from 'react';
import { func, shape } from 'prop-types';
import {
  Dimensions,
  ImageBackground,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import moment from 'moment';

import { IndicatorViewPager, PagerTitleIndicator } from 'rn-viewpager';
import { iOSColors } from 'react-native-typography';
import firebase from 'react-native-firebase';
import Ionicons from 'react-native-vector-icons/Ionicons';

import AdMob from '../../components/admob';
import Header from '../../components/header';
import IndicatorHorizontal from '../../components/indicator-horizontal';
import Marker from '../../components/marker';
import SettingsItem from '../../components/settings-item';

import Chart from './components/chart';
import HealthRecommendation from './components/health-recommendation';
import RealtimeWeather from './components/realtime-weather';
import ForecastWeather from './components/forecast-weather';

import { flatten, getWeatherIconName, noop } from '../../utils/helpers';
import { forecastWeather, history, realtimeWeather } from '../../utils/api';
import { indexTypes } from '../../utils/indexes';
import I18n from '../../utils/i18n';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: iOSColors.customGray,
  },
  titleBlock: {
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
    paddingBottom: 4,
  },
  block: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingTop: 20,
    backgroundColor: 'white',
  },
  currentBlock: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicatorContainer: {
    backgroundColor: iOSColors.white,
    height: 30,
  },
  indicatorText: {
    fontSize: 12,
    color: iOSColors.gray,
  },
  indicatorSelectedText: {
    fontSize: 12,
    color: iOSColors.black,
  },
  indicatorSelectedBorderStyle: {
    height: 2,
    backgroundColor: iOSColors.tealBlue,
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
    navigation: shape({
      state: shape({}).isRequired,
      goBack: func.isRequired,
    }).isRequired,
  };

  state = {
    refreshing: true,
    realtimeWeatherData: {},
    forecastWeatherData: [],
  };

  componentDidMount() {
    const {
      navigation: {
        state: {
          params: { item },
        },
      },
    } = this.props;

    this.getHistoryAQI();
    this.getRealtimeWeather(item);
    this.getForecastWeather(item);

    if (item.ImageUrl) {
      Image.getSize(item.ImageUrl, (imageWidth, imageHeight) => {
        console.log('getSize', imageWidth, imageHeight);
        this.setState({ ratio: imageHeight / imageWidth });
      });
    }
  }

  getRealtimeWeather = (item) => {
    realtimeWeather(item.TWD97Lat, item.TWD97Lon).then((result) => {
      console.log('realtimeWeather', result);
      this.setState({ realtimeWeatherData: result });
    });
  };

  getForecastWeather = (item) => {
    forecastWeather(item.TWD97Lat, item.TWD97Lon).then((result) => {
      console.log('forecastWeather', result);
      if (result) {
        this.setState({ forecastWeatherData: flatten(result) });
      }
    });
  };

  getHistoryAQI = () => {
    const {
      navigation: {
        state: {
          params: { item },
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
  };

  // TODO: make it component
  renderIndicator = () => (
    <PagerTitleIndicator
      style={styles.indicatorContainer}
      trackScroll={true}
      itemTextStyle={styles.indicatorText}
      selectedItemTextStyle={styles.indicatorSelectedText}
      selectedBorderStyle={styles.indicatorSelectedBorderStyle}
      itemStyle={{ width: width / indexTypes.length }}
      selectedItemStyle={{ width: width / indexTypes.length }}
      titles={indexTypes.map((i) => i.name)}
    />
  );

  render() {
    const {
      navigation: {
        state: {
          params: { item, aqi },
        },
        goBack,
      },
    } = this.props;

    const { forecastWeatherData, realtimeWeatherData } = this.state;

    return (
      <View style={styles.container}>
        <Header
          title={I18n.isZh ? item.SiteName : item.SiteEngName}
          backOnPress={() => goBack(null)}
        />

        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.getHistoryAQI}
            />
          }
        >
          {item.ImageUrl && (
            <ImageBackground
              style={{
                width,
                height: this.state.ratio * width,
                justifyContent: 'flex-end',
              }}
              source={{ uri: item.ImageUrl }}
            >
              <View style={styles.imageBackground}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ color: 'white' }}>
                    {`${realtimeWeatherData.Temp || '- '}℃`}
                  </Text>
                  {realtimeWeatherData.WeatherIcon &&
                    getWeatherIconName(realtimeWeatherData.WeatherIcon) && (
                      <Ionicons
                        name={getWeatherIconName(
                          realtimeWeatherData.WeatherIcon,
                        )}
                        style={{ marginLeft: 4 }}
                        size={18}
                        color="white"
                      />
                    )}
                </View>
                {I18n.isZh && (
                  <Text style={{ color: 'white' }}>{item.SiteAddress}</Text>
                )}
              </View>
            </ImageBackground>
          )}

          {!item.ImageUrl && I18n.isZh && (
            <View style={{ padding: 10, backgroundColor: 'white' }}>
              <Text style={styles.addressText}>{item.SiteAddress}</Text>
            </View>
          )}

          {realtimeWeatherData.Temp && (
            <RealtimeWeather data={realtimeWeatherData} />
          )}

          <View style={{ padding: 10, backgroundColor: 'white' }}>
            <SettingsItem
              text={I18n.t('notify_title')}
              item={item}
              isNeedLoad
              increaseEnabledCount={noop}
              descreaseEnabledCount={noop}
            />
          </View>

          {!Number.isNaN(aqi.AQI) && aqi.AQI > 0 && (
            <HealthRecommendation data={aqi} />
          )}

          <IndicatorHorizontal />

          {!this.state.refreshing && this.state.result && (
            <IndicatorViewPager
              style={{ height: 185, flexDirection: 'column-reverse' }}
              indicator={this.renderIndicator()}
            >
              {!this.state.refreshing &&
                this.state.result &&
                indexTypes.map((indexType) => {
                  const { length } = this.state.result;
                  return (
                    <View key={indexType.key}>
                      <View style={styles.block}>
                        <View style={styles.currentBlock}>
                          <Marker
                            amount={
                              this.state.result[length - 1][
                                indexType.key.replace('_', '')
                              ]
                            }
                            index={indexType.name}
                            isNumericShow={true}
                          />
                          <Text style={styles.text}>{indexType.name}</Text>
                          <Text style={styles.unitText}>{indexType.unit}</Text>
                        </View>

                        <View style={{ width: width - 80 }}>
                          <Chart
                            result={this.state.result}
                            index={indexType.key}
                          />
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}
                          >
                            <Text style={styles.dateText}>
                              {moment(this.state.result[0].publish_time).format(
                                'lll',
                              )}
                            </Text>
                            <Text style={styles.dateText}>
                              {moment(
                                this.state.result[length - 1].publish_time,
                              ).format('lll')}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <View
                        style={{
                          padding: 15,
                          backgroundColor: 'white',
                          marginBottom: 10,
                        }}
                      >
                        <Text style={{ fontSize: 12 }}>
                          {indexType.name} - {I18n.t(`help.${indexType.key}`)}
                        </Text>
                        {I18n.isZh && (
                          <Text
                            style={{
                              fontSize: 10,
                              fontWeight: '300',
                              marginTop: 5,
                            }}
                          >
                            {I18n.t(`help.${indexType.key}_description`)}
                          </Text>
                        )}
                      </View>
                    </View>
                  );
                })}
            </IndicatorViewPager>
          )}

          <View style={{ backgroundColor: 'white', marginTop: 10 }}>
            <Text style={{ paddingTop: 15, paddingLeft: 15 }}>
              {I18n.t('details.weather')}
            </Text>
            <ForecastWeather data={forecastWeatherData} />
          </View>
        </ScrollView>

        <AdMob
          unitId={`twaqi-${Platform.OS}-details-footer`}
          bannerSize="LARGE_BANNER"
        />
      </View>
    );
  }
}
