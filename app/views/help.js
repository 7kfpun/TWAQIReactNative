import React, { Component } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import shortid from 'shortid';

import Icon from 'react-native-vector-icons/MaterialIcons';
import ReactNativeI18n from 'react-native-i18n';

import I18n from '../utils/i18n';
import tracker from '../utils/tracker';

const deviceLocale = ReactNativeI18n.locale;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  close: {
    position: 'absolute',
    right: 15,
    top: 25,
    backgroundColor: 'transparent',
  },
  block: {
    marginVertical: 30,
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
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
    hansCategory: '良好',
    meaning: 'Air pollution risk is low.',
    hantMeaning: '空氣污染風險很少。',
    hansMeaning: '空气污染风险很少。',
    backgroundColor: '#009866',
    fontColor: 'black',
  }, {
    index: '51 - 100',
    category: 'Moderate',
    hantCategory: '一般',
    hansCategory: '一般',
    meaning: 'Air quality is acceptable.',
    hantMeaning: '空氣質素可以接受。',
    hansMeaning: '空气质素可以接受。',
    backgroundColor: '#FEDE33',
    fontColor: 'black',
  }, {
    index: '101 - 150',
    category: 'Unhealthy for high-risk group',
    hantCategory: '對高危人士不健康',
    hansCategory: '对高危人士不健康',
    meaning: 'High-risk group may have health effects. General public is not affected.',
    hantMeaning: '高危人士可能出現健康反應。公眾暫時未受影響。',
    hansMeaning: '高危人士可能出现健康反应。公众暂时未受影响。',
    backgroundColor: '#FE9833',
    fontColor: 'black',
  }, {
    index: '151 - 200',
    category: 'Unhealthy',
    hantCategory: '不健康',
    hansCategory: '不健康',
    meaning: 'High-risk group may have more serious health effects. Some of the general public may have health effects.',
    hantMeaning: '高危人士可能出現較嚴重健康反應，部分公眾亦可能出現健康反應。',
    hansMeaning: '高危人士可能出现较严重健康反应，部分公众亦可能出现健康反应。',
    backgroundColor: '#CC0033',
    fontColor: 'white',
  }, {
    index: '201 - 300',
    category: 'Very Unhealthy',
    hantCategory: '非常不健康',
    hansCategory: '非常不健康',
    meaning: 'General public have health effects.',
    hantMeaning: '公眾出現健康反應。',
    hansMeaning: '公众出现健康反应。',
    backgroundColor: '#660098',
    fontColor: 'white',
  }, {
    index: '301 - 500',
    category: 'Hazardous',
    hantCategory: '危害',
    hansCategory: '危害',
    meaning: 'Some of the general public may have more serious health effects.',
    hantMeaning: '部分公眾可能出現較嚴重健康反應。',
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
  };

  render() {
    const { goBack } = this.props.navigation;
    tracker.trackScreenView('Help');
    return (
      <View style={styles.container}>
        <ScrollView showsHorizontalScrollIndicator={false}>
          <View style={styles.block}>
            <Text style={styles.title}>{I18n.t('aqi_full')}</Text>

            {helpTexts.AQI.map((item) => {
              let itemCategory;
              if (deviceLocale.startsWith('zh-Hans')) {
                itemCategory = item.hansCategory;
                itemDescription = item.hansMeaning;
              } else if (deviceLocale.startsWith('zh')) {
                itemCategory = item.hantCategory;
                itemDescription = item.hantMeaning;
              } else {
                itemCategory = item.category;
                itemDescription = item.meaning;
              }

              return (<View key={shortid.generate()}>
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

          <View style={styles.block}>
            <Text style={{ fontSize: 18, marginBottom: 20 }}>{I18n.t('aqhi_full')}</Text>

            {helpTexts.AQHI.map((item) => {
              let itemHealthRisk;
              if (deviceLocale.startsWith('zh-Hans')) {
                itemHealthRisk = item.hansHealthRisk;
              } else if (deviceLocale.startsWith('zh')) {
                itemHealthRisk = item.hantHealthRisk;
              } else {
                itemHealthRisk = item.healthRisk;
              }

              return (<View key={shortid.generate()} style={styles.row}>
                <View style={[{ backgroundColor: item.backgroundColor }, styles.index]}>
                  <Text style={{ color: 'white' }}>{item.index}</Text>
                </View>
                {<Text>{itemHealthRisk}</Text>}
              </View>);
            })}
          </View>
        </ScrollView>

        <TouchableOpacity style={styles.close} onPress={() => goBack()} >
          <Icon name="close" size={30} color="gray" />
        </TouchableOpacity>
      </View>
    );
  }
}

HelpView.propTypes = {
  navigation: React.PropTypes.shape({
    goBack: React.PropTypes.func.isRequired,
  }).isRequired,
};
