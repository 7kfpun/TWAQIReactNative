import I18n from 'react-native-i18n';

I18n.fallbacks = true;

I18n.translations = {
  en: {
    app_name: 'Taiwan AQI',

    tab: {
      main: 'Map',
      history: 'List',
      forecast: 'Forecast',
      settings: 'Settings',
      help: 'Help',
    },

    main: 'Map',
    list: 'List',
    details_tab: 'Details',
    forecast_tab: 'Forecast',
    settings: 'Settings',
    help_tab: 'Help',
    contact: 'Contact',

    list_title: 'Detail Data',

    rating_title: 'Enjoy using "Taiwan Air Quality"?',
    rating_description:
      'Please give us 5 stars to cheer we up if you like this app.',
    feedback_description:
      'Give us some feedbacks. We will definitely keep improving.',

    notify_title: 'Notification',

    notify_pollution_title: 'When the air quality gets significantly worse',
    notify_pollution_therhold: 'Notice me when AQI is above',
    notify_cleanliness_title: 'When the air gets clean',
    notify_cleanliness_therhold: 'Notice me when AQI is below',
    aqi_full: 'Air Quality Index (AQI)',

    permissions_required: 'Notification permission required',
    too_small_therhold:
      'The value is too small, you would get lots of notifications',
    too_large_therhold:
      'The value is too large, you would get lots of notifications',

    forecast_title: 'Forecast',
    forecast_notification_label: 'Forecast Notification (daily)',
    forecast_publish_time: 'Publish Time: ',

    help_definition: 'Definition',
    help_cooperation: 'Interested to be Our Business Partner?',

    contact_title: 'Contact Us',

    status_good: 'Good',
    status_good_general_public_guidance: 'Enjoy your usual outdoor activities',
    status_good_sensitive_groups_guidance:
      'Enjoy your usual outdoor activities',
    status_moderate: 'Moderate',
    status_moderate_general_public_guidance:
      'Enjoy your usual outdoor activities',
    status_moderate_sensitive_groups_guidance: 'Can still be active outside',
    status_unhealthy_for_sensitive_groups: 'Unhealthy for Sensitive Groups',
    status_unhealthy_for_sensitive_groups_general_public_guidance:
      'Consider reducing outdoor activities',
    status_unhealthy_for_sensitive_groups_sensitive_groups_guidance:
      'Reduce physical exertion and outdoor activities',
    status_unhealthy: 'Unhealthy',
    status_unhealthy_general_public_guidance:
      'Should reduce physical exertion, particularly outdoors',
    status_unhealthy_sensitive_groups_guidance:
      'Stay indoors and reduce physical exertion',
    status_very_unhealthy: 'Very Unhealthy',
    status_very_unhealthy_general_public_guidance: 'Reduce outdoor activities',
    status_very_unhealthy_sensitive_groups_guidance:
      'Stay indoors and reduce physical exertion',
    status_hazardous: 'Hazardous',
    status_hazardous_general_public_guidance:
      'Avoid outdoor activities and keep doors and windows closed',
    status_hazardous_sensitive_groups_guidance:
      'Stay indoors and avoid physical exertion',

    cancel: 'Cancel',
    search: 'Search',

    location_permission: {
      title: 'Enable Location Service',
      description:
        'We will select the nearest monitoring station for you automatically based on your current location',
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

    details: {
      air_quality: 'Air quality',
      weather: 'Weather forecast',
      mask_suggestion: 'Recommend to wear a mask',
      general_public: 'General public',
      sensitive_groups: 'Sensitive groups',
    },

    forecast_weather: {
      now: 'Now',
      tomorrow: 'TMR',
      the_day_after_tomorrow: 'DAT',
      two_days_after_tomorrow: '2 DAT',
      hours: '',
    },

    forecast: {
      three_days: '3 days',
      details: 'Details',
      北部: 'North',
      竹苗: 'Chu-Miao',
      中部: 'Central',
      雲嘉南: 'Yun-Chia-Nan',
      高屏: 'KaoPing',
      宜蘭: 'Yilan',
      花東: 'Hua-Tun',
      馬祖: 'Matsu',
      金門: 'Kinmen',
      澎湖: 'Magong',
    },

    help: {
      AQI: 'Air quality index',
      AQI_description: '',
      AQI_url: 'https://en.wikipedia.org/wiki/Air_quality_index',
      PM2_5: 'Particulates',
      PM2_5_description: '',
      PM2_5_url: 'https://en.wikipedia.org/wiki/Particulates',
      PM10: 'Particulates',
      PM10_description: '',
      O3: 'Ozone',
      O3_description: '',
      O3_url: 'https://en.wikipedia.org/wiki/Ozone',
      CO: 'Carbon monoxide',
      CO_description: '',
      CO_url: 'https://en.wikipedia.org/wiki/Carbon_monoxide',
      SO2: 'Sulfur dioxide',
      SO2_description: '',
      SO2_url: 'https://en.wikipedia.org/wiki/Sulfur_dioxide',
      NO2: 'Nitrogen dioxide',
      NO2_description: '',
      NO2_url: 'https://en.wikipedia.org/wiki/Nitrogen_dioxide',
    },
  },
  zh: {
    app_name: '台灣空氣品質指標',

    tab: {
      main: '地圖',
      history: '列表',
      forecast: '預測',
      settings: '通知設定',
      help: '幫助',
    },

    main: '地圖',
    list: '列表',
    details_tab: '詳細',
    forecast_tab: '預測',
    settings: '通知設定',
    help_tab: '幫助',
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
    forecast_publish_time: '發布時間：',

    help_definition: '空氣品質指標的定義',
    help_cooperation: '成為我們合作夥伴？',

    contact_title: '聯絡我們',

    status_good: '良好',
    status_good_general_public_guidance: '正常戶外活動',
    status_good_sensitive_groups_guidance: '正常戶外活動',
    status_moderate: '普通',
    status_moderate_general_public_guidance: '正常戶外活動',
    status_moderate_sensitive_groups_guidance: '仍可正常戶外活動',
    status_unhealthy_for_sensitive_groups: '對敏感族群不良',
    status_unhealthy_for_sensitive_groups_general_public_guidance:
      '考慮減少戶外活動',
    status_unhealthy_for_sensitive_groups_sensitive_groups_guidance:
      '減少體力消耗活動及戶外活動',
    status_unhealthy: '對所有族群不良',
    status_unhealthy_general_public_guidance:
      '減少體力消耗，特別是減少戶外活動',
    status_unhealthy_sensitive_groups_guidance: '留在室內並減少體力消耗活動',
    status_very_unhealthy: '非常不良',
    status_very_unhealthy_general_public_guidance: '減少戶外活動',
    status_very_unhealthy_sensitive_groups_guidance:
      '留在室內並減少體力消耗活動',
    status_hazardous: '有害',
    status_hazardous_general_public_guidance: '避免戶外活動',
    status_hazardous_sensitive_groups_guidance: '留在室內並避免體力消耗活動',

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

    details: {
      air_quality: '空氣品質',
      weather: '天氣預報',
      general_public: '一般族群',
      sensitive_groups: '敏感族群',
      mask_suggestion: '出門配戴口罩',
    },

    forecast_weather: {
      now: '目前',
      tomorrow: '明日',
      the_day_after_tomorrow: '後天',
      two_days_after_tomorrow: '大後天',
      hours: '時',
    },

    forecast: {
      three_days: '3 天預測',
      details: '詳細預測',
      北部: '北部',
      竹苗: '竹苗',
      中部: '中部',
      雲嘉南: '雲嘉南',
      高屏: '高屏',
      宜蘭: '宜蘭',
      花東: '花東',
      馬祖: '馬祖',
      金門: '金門',
      澎湖: '澎湖',
    },

    help: {
      AQI: '空氣品質指數',
      AQI_description: '綜合各項污染的空氣指標，數值愈高，空氣愈髒',
      AQI_url:
        'https://zh.wikipedia.org/wiki/%E7%A9%BA%E6%B0%94%E8%B4%A8%E9%87%8F%E6%8C%87%E6%95%B0',
      PM2_5: '細懸浮微粒',
      PM2_5_description: '對心血管、神經系統傷害大，可能含有重金屬等重度污染物',
      PM10: '懸浮微粒',
      PM10_description: '顆粒較大的懸浮微粒，過量可形成霧霾',
      particulates_url:
        'https://zh.wikipedia.org/wiki/%E6%87%B8%E6%B5%AE%E7%B2%92%E5%AD%90',
      O3: '臭氧',
      O3_description: '對眼睛、呼吸道等有侵蝕和損害作用',
      O3_url: 'https://zh.wikipedia.org/wiki/%E8%87%AD%E6%B0%A7',
      CO: '一氧化碳',
      CO_description: '主要由燃燒化石燃料或火山爆發產生，通常在大氣少量存在',
      CO_url:
        'https://zh.wikipedia.org/wiki/%E4%B8%80%E6%B0%A7%E5%8C%96%E7%A2%B3',
      SO2: '二氧化硫',
      SO2_url:
        'https://zh.wikipedia.org/wiki/%E4%BA%8C%E6%B0%A7%E5%8C%96%E7%A1%AB',
      SO2_description: '過量接觸將有眼睛疼痛、肺部傷害',
      NO2: '二氧化氮',
      NO2_url:
        'https://zh.wikipedia.org/wiki/%E4%BA%8C%E6%B0%A7%E5%8C%96%E6%B0%AE',
      NO2_description:
        '來自於車輛廢氣、火力發電廠或其他工業染料，過量吸收傷害肺部',
    },
  },
};

I18n.isZh = I18n.locale.startsWith('zh');
if (I18n.isZh) {
  I18n.translations[I18n.locale] = I18n.translations.zh;
}

export default I18n;
