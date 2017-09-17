import React from 'react';
import {
  Platform,
  StyleSheet,
  View,
} from 'react-native';

import { AdMobBanner } from 'react-native-admob';

import { config } from '../config';

const styles = StyleSheet.create({
  container: {
    height: 50,
  },
});

function AdmobCell(props) {
  return (
    <View style={[styles.container, { margin: props.margin, backgroundColor: props.backgroundColor }]}>
      <AdMobBanner bannerSize={props.bannerSize} adUnitID={config.admob[Platform.OS].banner} />
    </View>
  );
}

AdmobCell.propTypes = {
  bannerSize: React.PropTypes.string,
  margin: React.PropTypes.number,
  backgroundColor: React.PropTypes.string,
};

AdmobCell.defaultProps = {
  margin: 0,
  bannerSize: 'smartBannerPortrait',
  backgroundColor: 'white',
};

module.exports = AdmobCell;
