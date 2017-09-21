import React, { Component } from 'react';
import {
  ActivityIndicator,
  DeviceEventEmitter,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  NativeModules,
} from 'react-native';

import * as Animatable from 'react-native-animatable';
import { AdMobInterstitial } from 'react-native-admob';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MapView from 'react-native-maps';
import store from 'react-native-simple-store';
import timer from 'react-native-timer';

import AdMob from '../elements/admob';
import Marker from '../elements/marker';

import { indexes } from '../utils/indexes';
import aqi from '../utils/aqi';
import tracker from '../utils/tracker';
import locations from '../utils/locations';

const { width, height } = Dimensions.get('window');

const { RNLocation } = NativeModules;

const ASPECT_RATIO = width / height;
const LATITUDE = 23.53;
const LONGITUDE = 120.94;
const LATITUDE_DELTA = 3.9;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const OUT_OF_BOUND = 30;
const FIVE_MINUTES = 5 * 60 * 1000;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 50,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  menu: {
    position: 'absolute',
    left: 15,
    top: 30,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    height: 44,
    width: 44,
    borderRadius: 22,
  },
  help: {
    position: 'absolute',
    right: 15,
    top: 30,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    height: 44,
    width: 44,
    borderRadius: 22,
  },
  currentLocation: {
    position: 'absolute',
    right: 14,
    bottom: 60,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    height: 44,
    width: 44,
    borderRadius: 22,
  },
  infomationContainer: {
    position: 'absolute',
    top: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: 'transparent',
  },
  infomationBubble: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  infomationBubbleBody: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infomationBubbleText: {
    fontSize: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 6,
    backgroundColor: 'transparent',
  },
  bubble: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 2,
    paddingVertical: 12,
    borderRadius: 20,
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
});

export default class MainView extends Component {
  static navigationOptions = {
    header: null,
    title: 'Main',
  };

  static isOutOfBound(latitude, longitude) {
    const distance = ((latitude - LATITUDE) * (latitude - LATITUDE)) + ((longitude - LONGITUDE) * (longitude - LONGITUDE));
    console.log('Distance', distance);
    return distance > OUT_OF_BOUND;
  }

  static getHongKongLocation() {
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
    locations: [],
    selectedIndex: indexes[0],
    isLoading: false,
    gpsEnabled: false,
  };

  componentDidMount() {
    if (Platform.OS === 'ios') {
      RNLocation.requestWhenInUseAuthorization();
      // RNLocation.requestAlwaysAuthorization();
      RNLocation.startUpdatingLocation();
      RNLocation.setDistanceFilter(5.0);
      DeviceEventEmitter.addListener('locationUpdated', (location) => {
        console.log('Location updated', location);
        this.setState({
          location: location.coords,
          gpsEnabled: true,
        });

        if (MainView.isOutOfBound(location.coords.latitude, location.coords.longitude)) {
          timer.setTimeout(this, 'MoveToHongKong', () => {
            this.map.animateToRegion(MainView.getHongKongLocation());
          }, 1000);
        }
      });
    } else {
      DeviceEventEmitter.addListener('updateLocation', (location) => {
        console.log('Location updated', location);
        this.setState({
          location: {
            latitude: location.Latitude,
            longitude: location.Longitude,
          },
          gpsEnabled: true,
        });

        if (MainView.isOutOfBound(location.Latitude, location.Longitude)) {
          timer.setTimeout(this, 'MoveToHongKong', () => {
            this.map.animateToRegion(MainView.getHongKongLocation());
          }, 1000);
        }
      });

      // Initialize RNALocation
      RNALocation.getLocation();
    }

    this.prepareLocations();
    this.prepareData();

    timer.setInterval(this, 'ReloadDataInterval', () => this.prepareData(), FIVE_MINUTES);

    const FIVE_SECONDS = 5 * 1000;
    timer.setTimeout(this, 'AdMobInterstitialTimeout', () => {
      AdMobInterstitial.requestAd(() => AdMobInterstitial.showAd(errorAdmob => errorAdmob && console.log(errorAdmob)));
    }, FIVE_SECONDS);
  }

  onRegionChange(region) {
    console.log(region);
    this.setState({ region, selectedLocation: null });
  }

  getCurrentLocation() {
    return {
      latitude: this.state.location.latitude,
      longitude: this.state.location.longitude,
      latitudeDelta: this.state.gpsEnabled ? 0.6 : LATITUDE_DELTA,
      longitudeDelta: this.state.gpsEnabled ? 0.6 * ASPECT_RATIO : LONGITUDE_DELTA,
    };
  }

  prepareLocations() {
    const that = this;
    store.get('locationsCache').then((locationsCache) => {
      if (locationsCache && locationsCache.length > 0) {
        that.setState({ locations: locationsCache });
      }

      locations().then((result) => {
        if (result && result.length > 0) {
          console.log('Locations:', result);
          that.setState({ locations: result });
          store.save('locationsCache', result);
        }
      });
    });
  }

  prepareData() {
    this.setState({ isLoading: true }, () => {
      const that = this;
      store.get('aqiResult').then((aqiResult) => {
        if (aqiResult) {
          that.setState({
            aqiResult,
            // isLoading: false,
          });
        }

        aqi().then((result) => {
          const keys = Object.keys(result || {}).length;
          console.log('AQI:', result);
          console.log('AQI length:', keys);
          if (result && keys > 0) {
            that.setState({ aqiResult: result });
            store.save('aqiResult', result);
          }

          that.setState({ isLoading: false });
        });
      });
    });
  }

  render() {
    tracker.view('Main');

    const { navigate } = this.props.navigation;

    return (
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <View style={styles.container}>
          <MapView
            style={styles.map}
            ref={(ref) => { this.map = ref; }}
            initialRegion={this.getCurrentLocation()}
            onRegionChange={region => this.onRegionChange(region)}
          >
            {this.state.aqiResult && this.state.locations.map((location) => {
              const title = `${location.SiteName} ${this.state.selectedIndex} 值為 ${(this.state.aqiResult[location.SiteName] && this.state.aqiResult[location.SiteName][this.state.selectedIndex]) || '-'}`;

              return (<MapView.Marker
                key={location.SiteEngName}
                coordinate={{
                  latitude: parseFloat(location.TWD97Lat),
                  longitude: parseFloat(location.TWD97Lon),
                }}
                title={title}
                description={location.SiteAddress}
                onPress={() => {
                  this.setState({ selectedLocation: location.SiteName });
                  tracker.logEvent('select-location', location);
                }}
              >
                {this.state.aqiResult[location.SiteName] && <Marker
                  amount={this.state.aqiResult[location.SiteName][this.state.selectedIndex]}
                  index={this.state.selectedIndex}
                  status={this.state.aqiResult[location.SiteName].Status}
                />}
              </MapView.Marker>);
            })}

            {this.state.gpsEnabled && this.state.location && <MapView.Marker
              coordinate={this.state.location}
            />}
          </MapView>

          <TouchableOpacity style={styles.menu} onPress={() => navigate('Settings')}>
            <Animatable.View animation="tada" delay={2000} iterationCount={40}>
              <Icon name="notifications-active" size={26} color="#616161" />
            </Animatable.View>
          </TouchableOpacity>

          {<View style={styles.infomationContainer}>
            <TouchableOpacity
              onPress={() => {
                this.prepareData();
                tracker.logEvent('fetch-latest-data');
              }}
              style={styles.infomationBubble}
            >
              <View style={styles.infomationBubbleBody}>
                <Text style={styles.infomationBubbleText}>{this.state.aqiResult && this.state.aqiResult['中山'] && this.state.aqiResult['中山'].PublishTime}</Text>
                {!this.state.isLoading && <Icon name="refresh" style={{ marginLeft: 5 }} size={20} color="#616161" />}
                {this.state.isLoading && <ActivityIndicator style={{ marginLeft: 5 }} />}
              </View>
            </TouchableOpacity>
          </View>}

          {/* <TouchableOpacity style={styles.help} onPress={() => navigate('Help')} >
            <Icon name="help-outline" size={26} color="#616161" />
          </TouchableOpacity> */}

          {this.state.gpsEnabled && <TouchableOpacity
            style={styles.currentLocation}
            onPress={() => {
              this.map.animateToRegion(this.getCurrentLocation());
              tracker.logEvent('move-to-current-location');
            }}
          >
            <Icon name="near-me" size={26} color="#616161" />
          </TouchableOpacity>}

          <View style={styles.buttonContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {indexes.map(item => (
                <TouchableOpacity
                  key={item}
                  onPress={() => {
                    this.setState({ selectedIndex: item });
                    tracker.logEvent('select-index', { label: item });
                  }}
                  style={[styles.bubble, styles.button]}
                >
                  <Text style={styles.text}>{item}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        <AdMob />
      </View>
    );
  }
}

MainView.propTypes = {
  navigation: React.PropTypes.shape({
    navigate: React.PropTypes.func.isRequired,
  }).isRequired,
};
