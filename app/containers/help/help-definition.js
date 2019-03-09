import React, { Component } from 'react';
import { func, shape } from 'prop-types';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import AdMob from '../../components/admob';

import I18n from '../../utils/i18n';

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
    paddingHorizontal: 10,
    paddingVertical: 30,
  },
  title: {
    fontSize: 24,
    marginLeft: 10,
    color: 'black',
  },
  row: {
    flexDirection: 'row',
  },
  index: {
    paddingHorizontal: 10,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 30,
  },
  categoryText: {
    color: 'black',
  },
  descriptionText: {
    fontWeight: '100',
    lineHeight: 20,
    marginVertical: 10,
    color: 'black',
  },
});

const helpTexts = {
  AQI: [
    {
      index: '0 - 50',
      category: 'Good',
      hantCategory: '良好',
      hantwCategory: '良好',
      hansCategory: '良好',
      meaning: 'Air pollution risk is low.',
      hantMeaning: '空氣污染風險很少。',
      hantwMeaning: '空氣品質為良好，污染程度低或無污染。',
      hansMeaning: '空气污染风险很少。',
      backgroundColor: '#009866',
      fontColor: 'white',
    },
    {
      index: '51 - 100',
      category: 'Moderate',
      hantCategory: '一般',
      hantwCategory: '普通',
      hansCategory: '一般',
      meaning: 'Air quality is acceptable.',
      hantMeaning: '空氣質素可以接受。',
      hantwMeaning: '空氣品質普通；但對非常少數之極敏感族群產生輕微影響。',
      hansMeaning: '空气质素可以接受。',
      backgroundColor: '#FEDE33',
      fontColor: 'black',
    },
    {
      index: '101 - 150',
      category: 'Unhealthy for high-risk group',
      hantCategory: '對高危人士不健康',
      hantwCategory: '對敏感族群不健康',
      hansCategory: '对高危人士不健康',
      meaning:
        'High-risk group may have health effects. General public is not affected.',
      hantMeaning: '高危人士可能出現健康反應。公眾暫時未受影響。',
      hantwMeaning:
        '空氣污染物可能會對敏感族群的健康造成影響，但是對一般大眾的影響不明顯。',
      hansMeaning: '高危人士可能出现健康反应。公众暂时未受影响。',
      backgroundColor: '#FE9833',
      fontColor: 'black',
    },
    {
      index: '151 - 200',
      category: 'Unhealthy',
      hantCategory: '不健康',
      hantwCategory: '對所有族群不健康',
      hansCategory: '不健康',
      meaning:
        'High-risk group may have more serious health effects. Some of the general public may have health effects.',
      hantMeaning:
        '高危人士可能出現較嚴重健康反應，部分公眾亦可能出現健康反應。',
      hantwMeaning:
        '對所有人的健康開始產生影響，對於敏感族群可能產生較嚴重的健康影響。',
      hansMeaning:
        '高危人士可能出现较严重健康反应，部分公众亦可能出现健康反应。',
      backgroundColor: '#CC0033',
      fontColor: 'white',
    },
    {
      index: '201 - 300',
      category: 'Very Unhealthy',
      hantCategory: '非常不健康',
      hantwCategory: '非常不健康',
      hansCategory: '非常不健康',
      meaning: 'General public have health effects.',
      hantMeaning: '公眾出現健康反應。',
      hantwMeaning: '健康警報：所有人都可能產生較嚴重的健康影響。',
      hansMeaning: '公众出现健康反应。',
      backgroundColor: '#660098',
      fontColor: 'white',
    },
    {
      index: '301 - 500',
      category: 'Hazardous',
      hantCategory: '危害',
      hantwCategory: '危害',
      hansCategory: '危害',
      meaning:
        'Some of the general public may have more serious health effects.',
      hantMeaning: '部分公眾可能出現較嚴重健康反應。',
      hantwMeaning: '健康威脅達到緊急，所有人都可能受到影響。',
      hansMeaning: '部分公众可能出现较严重健康反应。',
      backgroundColor: '#7E2200',
      fontColor: 'white',
    },
  ],
};

export default class HelpDefinition extends Component {
  static propTypes = {
    navigation: shape({
      goBack: func.isRequired,
    }).isRequired,
  };

  static navigationOptions = {
    header: null,
    tabBarLabel: I18n.t('help_tab'),
    tabBarIcon: ({ tintColor, focused }) => (
      <Ionicons
        name={focused ? 'ios-help-circle' : 'ios-help-circle-outline'}
        size={21}
        color={tintColor}
      />
    ),
  };

  render() {
    const {
      navigation: { goBack },
    } = this.props;

    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => goBack(null)}>
          <View style={styles.titleBlock}>
            <Ionicons name="ios-arrow-back" size={30} color="gray" />
            <Text style={styles.title}>{I18n.t('help_definition')}</Text>
          </View>
        </TouchableOpacity>

        <ScrollView>
          <View style={styles.block}>
            {helpTexts.AQI.map(item => (
              <View key={`help-text-${Math.random()}`}>
                <View style={styles.row}>
                  <View
                    style={[
                      { backgroundColor: item.backgroundColor },
                      styles.index,
                    ]}
                  >
                    <Text style={{ color: item.fontColor }}>{item.index}</Text>
                  </View>
                  <Text style={styles.categoryText}>
                    {I18n.isZh ? item.hantwCategory : item.category}
                  </Text>
                </View>
                <Text style={styles.descriptionText}>
                  {I18n.isZh ? item.hantwMeaning : item.meaning}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>

        <AdMob unitId={`twaqi-${Platform.OS}-help-footer`} />
      </View>
    );
  }
}
