import I18n from 'react-native-i18n';

I18n.fallbacks = true;

I18n.translations = {
  en: {
    main: '地圖',
    settings: '通知設定',
    help: '幫助',

    rating_title: '喜歡「台灣空氣品質指標」嗎？',
    rating_description: '請給我們5顆星以鼓勵我們',
    feedback_description: '我們很需要您給點建議，讓此APP越來越好。',

    notify_title: '空氣質素通知',

    notify_pollution_title: '當空氣質素明顯惡化時通知我',
    notify_pollution_therhold: 'AQI 指數超過',
    notify_cleanliness_title: '當空氣質素優良時通知我',
    notify_cleanliness_therhold: 'AQI 指數低於',
    aqi_full: '空氣質素指數（AQI）',
    aqhi_full: '空氣質素健康指數（AQHI）',
    last_update: '更新時間',


    permissions_required: '請允許通知以獲取最新空氣質素報告',
    too_small_therhold: '您所設定的值偏低，或將會收到很多通知',
    too_large_therhold: '您所設定的值偏高，或將會收到很多通知',


    help_definition: '空氣品質指標的定義',
  },
};

I18n.translations['zh-Hans-US'] = I18n.translations.zh;
I18n.translations['zh-Hans-HK'] = I18n.translations.zh;
I18n.translations['zh-Hans-MN'] = I18n.translations.zh;

export default I18n;
