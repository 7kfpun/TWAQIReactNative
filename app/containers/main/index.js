import React, { Component } from 'react';
import { func, shape } from 'prop-types';

import {
  ActivityIndicator,
  Alert,
  DeviceEventEmitter,
  Dimensions,
  Linking,
  PermissionsAndroid,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import * as Animatable from 'react-native-animatable';
import { captureRef } from 'react-native-view-shot';
import { iOSColors } from 'react-native-typography';
import DeviceInfo from 'react-native-device-info';
import firebase from 'react-native-firebase';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MapView from 'react-native-maps';
import OneSignal from 'react-native-onesignal';
import store from 'react-native-simple-store';

import ClosestStation from './components/closest-station';
import Indicator from './components/indicator';
import MaskSuggestion from './components/mask-suggestion';

import AdMob from '../../components/admob';
import AlertModal from '../../components/alert-modal';
import Marker from '../../components/marker';
import Rating from '../../components/rating';

import { aqi } from '../../utils/api';
import { getColor, indexTypes } from '../../utils/indexes';
import { locations } from '../../utils/locations';
import I18n from '../../utils/i18n';
import tracker from '../../utils/tracker';

import { config } from '../../config';

const advert = firebase.admob().interstitial(config.admob.android.interstital);

const { AdRequest } = firebase.admob;
const request = new AdRequest();
request.addKeyword('weather').addKeyword('health');

advert.loadAd(request.build());

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 23.3;
const LONGITUDE = 120.8;
const LATITUDE_DELTA = 4.4;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const OUT_OF_BOUND = 30;
const RELOAD_INTERVAL = 30 * 60 * 1000;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  shareImage: {
    position: 'absolute',
    right: 12,
    bottom: 220,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
    width: 48,
    borderRadius: 24,
  },
  defaultLocation: {
    position: 'absolute',
    right: 12,
    bottom: 164,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
    width: 48,
    borderRadius: 24,
  },
  currentLocation: {
    position: 'absolute',
    right: 12,
    bottom: 108,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
    width: 48,
    borderRadius: 24,
  },
  windMode: {
    position: 'absolute',
    left: 12,
    bottom: 108,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
    width: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: iOSColors.white,
  },
  windModeSelected: {
    borderColor: iOSColors.tealBlue,
  },
  refreshContainer: {
    top: Platform.OS === 'ios' ? 30 : 0,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  refreshContainerBody: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshContainerText: {
    fontSize: 12,
  },
  buttonContainer: {
    height: 45,
    flexGrow: 0,
  },
  bubble: {
    height: 42,
    borderWidth: 2,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 2,
    paddingVertical: 6,
    borderRadius: 20,
    borderColor: iOSColors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedBubble: {
    borderColor: iOSColors.tealBlue,
  },
  button: {
    width: 56,
    paddingHorizontal: 2,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  text: {
    fontSize: 12,
  },
  lastUpdatedTime: {
    position: 'absolute',
    bottom: 122,
    fontWeight: '300',
    fontSize: 12,
  },
});

export default class MainView extends Component {
  static propTypes = {
    navigation: shape({
      navigate: func.isRequired,
    }).isRequired,
  };

  static isOutOfBound(latitude, longitude) {
    const distance =
      (latitude - LATITUDE) * (latitude - LATITUDE) +
      (longitude - LONGITUDE) * (longitude - LONGITUDE);
    console.log('Distance', distance);
    return distance > OUT_OF_BOUND;
  }

  static getDefaultLocation() {
    return {
      latitude: LATITUDE,
      longitude: LONGITUDE,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    };
  }

  state = {
    location: {
      latitude: LATITUDE,
      longitude: LONGITUDE,
    },
    centerLocation: {
      latitude: LATITUDE,
      longitude: LONGITUDE,
    },
    selectedIndex: indexTypes[0].key,
    gpsEnabled: false,
    isShareLoading: false,
    isWindMode: false,
    isLocationMovedToDefault: false,
  };

  componentDidMount() {
    OneSignal.addEventListener('received', (data) => this.onReceived(data));
    OneSignal.addEventListener('opened', (data) => this.onOpened(data));

    DeviceEventEmitter.addListener('quickActionShortcut', (data) =>
      this.onQuickActionOpened(data),
    );

    this.checkAskBuyPremium();
    // if (Platform.OS === 'android' && advert.isLoaded()) {
    //   advert.show();
    // }
  }

  componentWillUnmount() {
    if (this.watchID) navigator.geolocation.clearWatch(this.watchID);
    if (this.reloadFetchLatestDataInterval)
      clearInterval(this.reloadFetchLatestDataInterval);

    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
  }

  onReceived(notification) {
    console.log('Notification received: ', notification);
  }

  onOpened(data) {
    const { navigation } = this.props;
    console.log('Message: ', data.notification.payload.body);
    console.log('Data: ', data.notification.payload.additionalData);
    console.log('isActive: ', data.notification.isAppInFocus);
    console.log('data: ', data);
    if (
      data.notification.payload.additionalData &&
      data.notification.payload.additionalData.url === 'app://main'
    ) {
      setTimeout(() => navigation.navigate('Main'), 2000);
    } else if (
      data.notification.payload.additionalData &&
      data.notification.payload.additionalData.url === 'app://forecast'
    ) {
      setTimeout(() => navigation.navigate('Forecast'), 2000);
    } else if (
      data.notification.payload.additionalData &&
      data.notification.payload.additionalData.url === 'app://settings'
    ) {
      setTimeout(() => navigation.navigate('Settings'), 2000);
    } else if (
      data.notification.payload.additionalData &&
      data.notification.payload.additionalData.url === 'app://forecast'
    ) {
      setTimeout(() => navigation.navigate('Forecast'), 2000);
    }
  }

  onRegionChange(region) {
    console.log(region);
    // this.setState({ region, selectedLocation: null });
  }

  onRegionChangeComplete(region) {
    console.log('onRegionChangeComplete', region);
    this.setState({
      centerLocation: region,
    });
  }

  onQuickActionOpened(data) {
    const { navigation } = this.props;
    console.log('Quick action data.title', data.title);
    console.log('Quick action data.type', data.type);
    console.log('Quick action data.userInfo', data.userInfo);
    if (data.userInfo && data.userInfo.url === 'app://main') {
      setTimeout(() => navigation.navigate('Main'), 2000);
    } else if (data.userInfo && data.userInfo.url === 'app://forecast') {
      setTimeout(() => navigation.navigate('Forecast'), 2000);
    }
  }

  getCurrentLocation() {
    return {
      latitude: this.state.location.latitude,
      longitude: this.state.location.longitude,
      latitudeDelta: this.state.gpsEnabled ? 0.2 : LATITUDE_DELTA,
      longitudeDelta: this.state.gpsEnabled
        ? 0.2 * ASPECT_RATIO
        : LONGITUDE_DELTA,
    };
  }

  prepareData() {
    const that = this;
    const trace = firebase.perf().newTrace('api_get_aqi');
    trace.start();
    aqi().then((result) => {
      const keys = Object.keys(result || {}).length;
      console.log('AQI:', result);
      console.log('AQI length:', keys);
      if (result && keys > 0) {
        that.setState({ aqiResult: result });
      }
      trace.stop();
    });
  }

  requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      navigator.geolocation.requestAuthorization();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: I18n.t('location_permission.title'),
            message: I18n.t('location_permission.description'),
          },
        );
        console.log(granted);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          this.setState({
            gpsEnabled: true,
          });
          this.checkLocation();
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  loadMapContent = async () => {
    const that = this;
    store.get('selectedIndex').then((selectedIndex) => {
      if (selectedIndex) {
        that.setState({
          selectedIndex,
        });
      }
    });

    store.get('isWindMode').then((isWindMode) => {
      if (isWindMode) {
        that.setState({
          isWindMode,
        });
      }
    });

    if (Platform.OS === 'ios') {
      this.checkLocation();
    } else {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.checkLocation();
      } else {
        this.requestLocationPermission();
      }
    }

    this.prepareData();

    this.reloadFetchLatestDataInterval = setInterval(() => {
      this.prepareData();
      tracker.logEvent('reload-fetch-latest-data');
    }, RELOAD_INTERVAL);
  };

  checkAskBuyPremium = async () => {
    const isAskedBuyPremium = await store.get('isAskedBuyPremium');
    if (!isAskedBuyPremium && Math.random() < 0.2) {
      this.setState({ isAskBuyPremiumVisible: true });
    }
  };

  checkLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('geolocation', position);
        this.setState({
          location: position.coords,
          gpsEnabled: true,
        });

        const moveLocation = MainView.isOutOfBound(
          position.coords.latitude,
          position.coords.longitude,
        )
          ? MainView.getDefaultLocation()
          : this.getCurrentLocation();
        try {
          this.map.animateToRegion(moveLocation);
        } catch (err) {
          console.error(`Map animateToRegion failed: ${JSON.stringify(err)}`);
        }
      },
      (error) => {
        this.requestLocationPermission();
        if (!this.state.isLocationMovedToDefault) {
          // alert(error.message);
          this.setState({ isLocationMovedToDefault: true });
          setTimeout(() => {
            try {
              console.log(error);
              this.map.animateToRegion(MainView.getDefaultLocation());
            } catch (err) {
              console.error(
                `Map animateToRegion failed: ${JSON.stringify(err)}`,
              );
            }
          }, 2000);
        }
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );

    this.watchID = navigator.geolocation.watchPosition((position) => {
      this.setState({
        location: position.coords,
        gpsEnabled: true,
      });
    });
  }

  render() {
    const { navigation } = this.props;

    const {
      centerLocation,
      aqiResult,
      selectedIndex,
      isAskBuyPremiumVisible,
    } = this.state;

    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          ref={(ref) => {
            this.map = ref;
          }}
          initialRegion={this.getCurrentLocation()}
          onRegionChange={(region) => this.onRegionChange(region)}
          onRegionChangeComplete={(region) =>
            this.onRegionChangeComplete(region)
          }
          onMapReady={this.loadMapContent}
          showsUserLocation={true}
        >
          {aqiResult &&
            locations
              .filter((i) => aqiResult[i.SiteName])
              .map((location) => {
                try {
                  if (
                    this.state.isWindMode &&
                    !(
                      aqiResult[location.SiteName].WindDirec &&
                      aqiResult[location.SiteName].WindSpeed
                    )
                  ) {
                    return null;
                  }

                  return (
                    <MapView.Marker
                      key={location.SiteEngName}
                      coordinate={{
                        latitude: parseFloat(location.TWD97Lat),
                        longitude: parseFloat(location.TWD97Lon),
                      }}
                      onPress={() => {
                        tracker.logEvent('check-main-details', location);
                        navigation.navigate('MainDetails', {
                          item: location,
                          aqi: aqiResult[location.SiteName],
                        });
                      }}
                      flat={this.state.isWindMode}
                      // rotation={parseFloat(aqiResult[location.SiteName].WindDirec)}
                    >
                      {this.state.isWindMode ? (
                        <Ionicons
                          name="md-arrow-round-down"
                          style={{
                            transform: [
                              {
                                rotate: `${
                                  aqiResult[location.SiteName].WindDirec
                                }deg`,
                              },
                            ],
                            textShadowColor: getColor(
                              'AQI',
                              aqiResult[location.SiteName].AQI,
                            ).fontColor,
                            textShadowOffset: {
                              width: 0.6,
                              height: 0.6,
                            },
                            textShadowRadius: 8,
                          }}
                          size={aqiResult[location.SiteName].WindSpeed * 5}
                          color={
                            getColor(
                              selectedIndex,
                              aqiResult[location.SiteName][selectedIndex],
                            ).color
                          }
                        />
                      ) : (
                        <Marker
                          SiteEngName={location.SiteEngName}
                          amount={aqiResult[location.SiteName][selectedIndex]}
                          index={selectedIndex}
                          isNumericShow={true}
                        />
                      )}
                    </MapView.Marker>
                  );
                } catch (err) {
                  log.logError(`Marker failed: ${JSON.stringify(err)}`);
                }
                return null;
              })}
        </MapView>

        <ClosestStation
          lat={centerLocation.latitude}
          long={centerLocation.longitude}
          aqiResult={aqiResult}
          selectedIndex={selectedIndex}
        />

        <Indicator />

        <MaskSuggestion
          lat={centerLocation.latitude}
          long={centerLocation.longitude}
          aqiResult={aqiResult}
        />

        <TouchableOpacity
          style={[
            styles.shareImage,
            DeviceInfo.isTablet() ? { bottom: 260 } : {},
          ]}
          onPress={() => {
            this.setState({ isShareLoading: true }, () => {
              captureRef(this.map, {
                format: 'jpg',
                quality: 0.8,
              }).then(
                (uri) => {
                  console.log('Image saved to', uri);
                  Share.share({
                    title: I18n.t('app_name'),
                    message: `${I18n.t('app_name')} ${
                      Platform.OS === 'ios'
                        ? config.appStore
                        : config.googlePlay
                    }`,
                    url: uri,
                  })
                    .then(() => {
                      this.setState({ isShareLoading: false });
                      if (result.action === Share.sharedAction) {
                        tracker.logEvent('share-map');
                        if (result.activityType) {
                          tracker.logEvent('share-map-shared', {
                            activityType: result.activityType,
                          });
                        } else {
                          tracker.logEvent('share-map-shared');
                        }
                      } else if (result.action === Share.dismissedAction) {
                        tracker.logEvent('share-map-dismiss');
                      }
                    })
                    .catch(() => this.setState({ isShareLoading: false }));
                },
                (error) => {
                  console.error('Oops, snapshot failed', error);
                  this.setState({ isShareLoading: false });
                },
              );
            });
          }}
        >
          {this.state.isShareLoading ? (
            <ActivityIndicator />
          ) : (
            <Ionicons name="ios-share" size={28} color={iOSColors.black} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.defaultLocation,
            DeviceInfo.isTablet() ? { bottom: 208 } : {},
          ]}
          onPress={() => {
            this.map.animateToRegion(MainView.getDefaultLocation());
            tracker.logEvent('move-to-default-location');
          }}
        >
          <Ionicons
            name="ios-qr-scanner"
            style={{ paddingTop: 2, paddingLeft: 1 }}
            size={28}
            color={iOSColors.black}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.currentLocation,
            {
              backgroundColor: this.state.gpsEnabled
                ? iOSColors.white
                : iOSColors.lightGray,
            },
            DeviceInfo.isTablet() ? { bottom: 148 } : {},
          ]}
          onPress={() => {
            if (this.state.gpsEnabled) {
              this.map.animateToRegion(this.getCurrentLocation());
              tracker.logEvent('move-to-current-location');
            } else if (Platform.OS === 'ios') {
              Alert.alert(
                I18n.t('location_permission.title'),
                I18n.t('location_permission.description'),
                [
                  {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  {
                    text: 'OK',
                    onPress: () => Linking.openURL('app-settings:'),
                  },
                ],
                { cancelable: false },
              );
            } else {
              this.requestLocationPermission();
            }
          }}
        >
          <Ionicons
            name="md-navigate"
            style={{ paddingBottom: 1, transform: [{ rotate: '45deg' }] }}
            size={28}
            color={iOSColors.black}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.windMode,
            this.state.isWindMode ? styles.windModeSelected : {},
            DeviceInfo.isTablet() ? { bottom: 148 } : {},
          ]}
          onPress={() => {
            this.setState({ isWindMode: !this.state.isWindMode }, () => {
              store.save('isWindMode', this.state.isWindMode);
              tracker.logEvent('set-wind-mode', {
                label: this.state.isWindMode ? 'on' : 'off',
              });
            });
          }}
        >
          {this.state.isWindMode ? (
            <Animatable.View animation="swing" iterationCount="infinite">
              <Ionicons
                name="ios-leaf"
                style={{ marginLeft: 3, transform: [{ rotate: '-25deg' }] }}
                size={22}
                color={iOSColors.tealBlue}
              />
            </Animatable.View>
          ) : (
            <Ionicons
              name="ios-leaf"
              style={{ marginLeft: 3 }}
              size={22}
              color={iOSColors.black}
            />
          )}
        </TouchableOpacity>

        <Text style={styles.lastUpdatedTime}>
          {aqiResult && aqiResult['中山'] && aqiResult['中山'].PublishTime}
        </Text>

        <View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.buttonContainer}
          >
            {indexTypes.map((item) => (
              <TouchableOpacity
                key={item.key}
                onPress={() => {
                  this.setState({ selectedIndex: item.name });
                  store.save('selectedIndex', item.name);
                  tracker.logEvent('select-index', { label: item.name });
                  console.log('Select index', item.name);
                }}
                style={[
                  styles.bubble,
                  styles.button,
                  selectedIndex === item.name ? styles.selectedBubble : {},
                ]}
              >
                <Text style={styles.text}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <AdMob unitId={`twaqi-${Platform.OS}-main-footer`} />
        </View>

        <Rating />

        <AlertModal
          isVisible={isAskBuyPremiumVisible}
          title={I18n.t('help.buy_premium.title')}
          description={I18n.t('help.buy_premium.description')}
          okText={I18n.t('ok')}
          cancelText={I18n.t('cancel')}
          handleCancel={() => {
            store.save('isAskedBuyPremium', true);
            this.setState({ isAskBuyPremiumVisible: false });
            tracker.logEvent('ask-buy-premium', { value: 'false' });
          }}
          handleOK={() => {
            store.save('isAskedBuyPremium', true);
            this.setState({ isAskBuyPremiumVisible: false });
            navigation.navigate('help');
            tracker.logEvent('ask-buy-premium', { value: 'true' });
          }}
        />
      </View>
    );
  }
}
