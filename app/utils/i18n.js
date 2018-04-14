import I18n from 'react-native-i18n';

I18n.fallbacks = true;

I18n.translations = {
  en: {
    app_name: 'Taiwan AQI',

    main: 'Map',
    list: 'List',
    details: 'Details',
    forecast: 'Forecast',
    settings: 'Settings',
    help: 'Help',
    contact: 'Contact',

    list_title: 'Detail Data',

    rating_title: 'Enjoy using "Taiwan Air Quality"?',
    rating_description: 'Please give us 5 stars to cheer we up if you like this app.',
    feedback_description: 'Give us some feedbacks. We will definitely keep improving.',

    notify_title: 'Notification',

    notify_pollution_title: 'When the air quality gets significantly worse',
    notify_pollution_therhold: 'Notice me when AQI is above',
    notify_cleanliness_title: 'When the air gets clean',
    notify_cleanliness_therhold: 'Notice me when AQI is below',
    aqi_full: 'Air Quality Index (AQI)',

    permissions_required: 'Notification permission required',
    too_small_therhold: 'The value is too small, you would get lots of notifications',
    too_large_therhold: 'The value is too large, you would get lots of notifications',

    forecast_title: 'Forecast',
    forecast_notification_label: 'Forecast Notification (daily)',

    help_definition: 'Definition',

    contact_title: 'Contact Us',

    status_good: 'Good',
    status_moderate: 'Moderate',
    status_unhealthy_for_sensitive_groups: 'Unhealthy for Sensitive Groups',
    status_unhealthy: 'Unhealthy',
    status_very_unhealthy: 'Very Unhealthy',
    status_hazardous: 'Hazardous',

    cancel: 'Cancel',
    search: 'Search',

    location_permission: {
      title: 'Enable Location Service',
      description: 'We will select the nearest monitoring station for you automatically based on your current location',
    },
    do_not_disturb: {
      title: 'Do not disturb',
      start_time: 'Start time',
      end_time: 'End time',
    },
    realtime_weather: {
      rain: 'Hourly Precipitation',
      rh: 'Relative Humidity',
      cloud: 'Cloud Cover',
      visibility: 'Visibility',
    },
  },
  zh: {
    app_name: '台灣空氣品質指標',

    main: '地圖',
    list: '列表',
    details: '詳細',
    forecast: '預測',
    settings: '通知設定',
    help: '幫助',
    contact: '聯絡',

    list_title: '詳細紀錄',

    rating_title: '喜歡「台灣空氣品質指標」嗎？',
    rating_description: '給我們5顆星以鼓勵我們吧',
    feedback_description: '我們很需要您給點意見，讓此APP越做越好。',

    notify_title: '空氣品質通知',

    notify_pollution_title: '當空氣品質明顯惡化時通知我',
    notify_pollution_therhold: 'AQI 指數超過',
    notify_cleanliness_title: '當空氣品質優良時通知我',
    notify_cleanliness_therhold: 'AQI 指數低於',
    aqi_full: '空氣品質指數（AQI）',

    permissions_required: '請允許通知以獲取最新空氣品質報告',
    too_small_therhold: '您所設定的值偏低，或將會收到很多通知',
    too_large_therhold: '您所設定的值偏高，或將會收到很多通知',

    forecast_title: '空氣品質預報',
    forecast_notification_label: '空氣品質預報通知（每日）',

    help_definition: '空氣品質指標的定義',

    contact_title: '聯絡我們',

    status_good: '良好',
    status_moderate: '普通',
    status_unhealthy_for_sensitive_groups: '對敏感族群不良',
    status_unhealthy: '對所有族群不良',
    status_very_unhealthy: '非常不良',
    status_hazardous: '有害',

    cancel: '取消',
    search: '搜索',

    location_permission: {
      title: '啟用位置服務',
      description: '根據您當前的位置將自動選擇最近的監測站',
    },
    do_not_disturb: {
      title: '請勿打擾',
      start_time: '開始',
      end_time: '結束',
    },
    realtime_weather: {
      rain: '時累積雨量',
      rh: '濕度',
      cloud: '雲量',
      visibility: '能見度',
    },
  },
};

I18n.isZh = I18n.locale.startsWith('zh');
if (I18n.isZh) {
  I18n.translations[I18n.locale] = I18n.translations.zh;
}

export default I18n;
