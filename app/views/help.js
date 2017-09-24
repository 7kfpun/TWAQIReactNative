import React, { Component } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

import AdMob from '../elements/admob';
import tracker from '../utils/tracker';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  titleBlock: {
    paddingTop: 60,
    paddingLeft: 10,
    marginBottom: 20,
  },
  block: {
    paddingHorizontal: 10,
    paddingVertical: 30,
  },
  title: {
    fontSize: 24,
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
  description: {
    fontWeight: '100',
    lineHeight: 20,
    marginBottom: 10,
  },
});

const helpTexts = {
  AQI: [{
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
    fontColor: 'black',
  }, {
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
  }, {
    index: '101 - 150',
    category: 'Unhealthy for high-risk group',
    hantCategory: '對高危人士不健康',
    hantwCategory: '對敏感族群不健康',
    hansCategory: '对高危人士不健康',
    meaning: 'High-risk group may have health effects. General public is not affected.',
    hantMeaning: '高危人士可能出現健康反應。公眾暫時未受影響。',
    hantwMeaning: '空氣污染物可能會對敏感族群的健康造成影響，但是對一般大眾的影響不明顯。',
    hansMeaning: '高危人士可能出现健康反应。公众暂时未受影响。',
    backgroundColor: '#FE9833',
    fontColor: 'black',
  }, {
    index: '151 - 200',
    category: 'Unhealthy',
    hantCategory: '不健康',
    hantwCategory: '對所有族群不健康',
    hansCategory: '不健康',
    meaning: 'High-risk group may have more serious health effects. Some of the general public may have health effects.',
    hantMeaning: '高危人士可能出現較嚴重健康反應，部分公眾亦可能出現健康反應。',
    hantwMeaning: '對所有人的健康開始產生影響，對於敏感族群可能產生較嚴重的健康影響。',
    hansMeaning: '高危人士可能出现较严重健康反应，部分公众亦可能出现健康反应。',
    backgroundColor: '#CC0033',
    fontColor: 'white',
  }, {
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
  }, {
    index: '301 - 500',
    category: 'Hazardous',
    hantCategory: '危害',
    hantwCategory: '危害',
    hansCategory: '危害',
    meaning: 'Some of the general public may have more serious health effects.',
    hantMeaning: '部分公眾可能出現較嚴重健康反應。',
    hantwMeaning: '健康威脅達到緊急，所有人都可能受到影響。',
    hansMeaning: '部分公众可能出现较严重健康反应。',
    backgroundColor: '#7E2200',
    fontColor: 'white',
  }],
  AQHI: [{
    index: '1 - 3',
    healthRisk: 'Low',
    hantHealthRisk: '低',
    hansHealthRisk: '低',
    backgroundColor: '#4DB748',
  }, {
    index: '4 - 6',
    healthRisk: 'Moderate',
    hantHealthRisk: '中',
    hansHealthRisk: '中',
    backgroundColor: '#F9AB1A',
  }, {
    index: '7',
    healthRisk: 'High',
    hantHealthRisk: '高',
    hansHealthRisk: '高',
    backgroundColor: '#ED1B24',
  }, {
    index: '8 - 10',
    healthRisk: 'Very high',
    hantHealthRisk: '甚高',
    hansHealthRisk: '甚高',
    backgroundColor: '#A04623',
  }, {
    index: '10+',
    healthRisk: 'Serious',
    hantHealthRisk: '嚴重',
    hansHealthRisk: '严重',
    backgroundColor: '#000000',
  }],
};

export default class HelpView extends Component {
  static navigationOptions = {
    header: null,
    title: 'Help',
    tabBarLabel: '幫助',
    tabBarIcon: ({ tintColor }) => (
      <Icon name="info-outline" size={21} color={tintColor || 'gray'} />
    ),
  };

  render() {
    tracker.view('Help');
    return (
      <View style={styles.container}>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{'空氣品質指標的定義'}</Text>
        </View>
        <ScrollView>
          <View style={styles.block}>
            {helpTexts.AQI.map((item) => {
              const itemCategory = item.hantwCategory;
              const itemDescription = item.hantwMeaning;

              return (<View key={`help-text-${Math.random()}`}>
                <View style={styles.row}>
                  <View style={[{ backgroundColor: item.backgroundColor }, styles.index]}>
                    <Text style={{ color: item.fontColor }}>{item.index}</Text>
                  </View>
                  <Text>{itemCategory}</Text>
                </View>
                <Text style={styles.description}>{itemDescription}</Text>
              </View>);
            })}
          </View>
        </ScrollView>
        <AdMob />
      </View>
    );
  }
}
