import I18n from 'react-native-i18n';

I18n.fallbacks = true;

I18n.translations = {
  en: {
    main: 'Map',
    settings: 'Settings',
    help: 'Help',
    contact: 'Contact',

    rating_title: 'Enjoy using "Taiwan Air Quality"?',
    rating_description: 'Please give us 5 stars to cheer we up if you like this app.',
    feedback_description: 'Give us some feedbacks. We will definitely keep improving.',

    notify_title: 'Notification',

    notify_pollution_title: 'Notice me when the air quality gets significantly worse',
    notify_pollution_therhold: 'Notice me when AQI is above',
    notify_cleanliness_title: 'Notice me when the air gets clean',
    notify_cleanliness_therhold: 'Notice me when AQI is below',
    aqi_full: 'Air Quality Index (AQI)',

    permissions_required: 'Notification permission required',
    too_small_therhold: 'The value is too small, you would get lots of notifications',
    too_large_therhold: 'The value is too large, you would get lots of notifications',

    help_definition: 'Definition',

    contact_title: 'Contact Us',

    status_good: 'Good',
    status_moderate: 'Moderate',
    status_unhealthy_for_sensitive_groups: 'Unhealthy for Sensitive Groups',
    status_unhealthy: 'Unhealthy',
    status_very_unhealthy: 'Very Unhealthy',
    status_hazardous: 'Hazardous',

  },
  zh: {
    main: '地圖',
    settings: '通知設定',
    help: '幫助',
    contact: '聯絡',

    rating_title: '喜歡「台灣空氣品質指標」嗎？',
    rating_description: '請給我們5顆星以鼓勵我們',
    feedback_description: '我們很需要您給點意見，讓此APP越做越好。',

    notify_title: '空氣質素通知',

    notify_pollution_title: '當空氣質素明顯惡化時通知我',
    notify_pollution_therhold: 'AQI 指數超過',
    notify_cleanliness_title: '當空氣質素優良時通知我',
    notify_cleanliness_therhold: 'AQI 指數低於',
    aqi_full: '空氣質素指數（AQI）',

    permissions_required: '請允許通知以獲取最新空氣質素報告',
    too_small_therhold: '您所設定的值偏低，或將會收到很多通知',
    too_large_therhold: '您所設定的值偏高，或將會收到很多通知',

    help_definition: '空氣品質指標的定義',

    contact_title: '聯絡我們',

    status_good: '良好',
    status_moderate: '普通',
    status_unhealthy_for_sensitive_groups: '對敏感族群不良',
    status_unhealthy: '對所有族群不良',
    status_very_unhealthy: '非常不良',
    status_hazardous: '有害',
  },
};

I18n.translations['zh-Hans-US'] = I18n.translations.zh;
I18n.translations['zh-Hans-HK'] = I18n.translations.zh;
I18n.translations['zh-Hans-MN'] = I18n.translations.zh;

I18n.isZh = I18n.locale.startsWith('zh');

export default I18n;
