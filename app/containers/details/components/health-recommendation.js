import React from 'react';
import { shape, string } from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';

import { iOSColors } from 'react-native-typography';

import Label from '../../../components/label';

import { getColor } from '../../../utils/indexes';
import I18n from '../../../utils/i18n';

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    backgroundColor: iOSColors.white,
    padding: 15,
    flexDirection: 'row',
  },
  leftContainer: {
    flex: 3,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 10,
  },
  rightContainer: {
    flex: 4,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  row: {
    alignItems: 'flex-start',
  },
  aqiText: {
    fontSize: 65,
    fontWeight: '300',
    marginTop: 5,
  },
  descriptionText: {
    fontSize: 12,
    fontWeight: '300',
    marginTop: 6,
  },
});

const HealthRecommendation = ({ data }) => (
  <View style={styles.container}>
    <View style={styles.leftContainer}>
      <Label text="AQI" textColor={iOSColors.black} isBorderOnly />
      <Text style={styles.aqiText}>{data.AQI}</Text>
      <Label
        text={getColor('AQI', data.AQI).status}
        textColor={getColor('AQI', data.AQI).fontColor}
        color={getColor('AQI', data.AQI).color}
      />
    </View>
    <View style={styles.rightContainer}>
      <View style={styles.row}>
        <Label
          text={I18n.t('details.general_public')}
          textColor={iOSColors.black}
          isBorderOnly
        />
        <Text style={styles.descriptionText}>
          {getColor('AQI', data.AQI).general_public_guidance}
        </Text>
      </View>
      <View style={styles.row}>
        <Label
          text={I18n.t('details.sensitive_groups')}
          textColor={iOSColors.black}
          isBorderOnly
        />
        <Text style={styles.descriptionText}>
          {getColor('AQI', data.AQI).sensitive_groups_guidance}
        </Text>
      </View>
      {getColor('AQI', data.AQI).key >= 3 && (
        <View style={styles.row}>
          <Label
            text={I18n.t('details.mask_suggestion')}
            textColor={iOSColors.black}
            isBorderOnly
          />
          {/* <Text style={[styles.descriptionText, { color: iOSColors.blue, marginBottom: 0 }]}>{"> 購買連結 <"}</Text> */}
        </View>
      )}
    </View>
  </View>
);

HealthRecommendation.propTypes = {
  data: shape({
    AQI: string,
  }).isRequired,
};

export default HealthRecommendation;
