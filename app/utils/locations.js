const uniq = (a) => {
  const seen = {};
  const out = [];
  const len = a.length;
  let j = 0;
  for (let i = 0; i < len; i += 1) {
    const item = a[i];
    if (seen[item] !== 1) {
      seen[item] = 1;
      out[j++] = item;
    }
  }
  return out;
};

const compare = (a, b) => {
  if (a.TWD97Lat > b.TWD97Lat) {
    return -1;
  }
  if (a.TWD97Lat < b.TWD97Lat) {
    return 1;
  }
  return 0;
};

const locations = [
  {
    SiteName: '臺東',
    SiteEngName: 'Taitung',
    AreaName: '花東空品區',
    County: '臺東縣',
    Township: '臺東市',
    SiteAddress: '臺東市中山路276號',
    TWD97Lon: '121.1504500000',
    TWD97Lat: '22.7553580000',
    SiteType: '一般測站',
    ImageUrl: 'https://taqm.epa.gov.tw/taqm/webcam.ashx?site=62&type=l',
  }, {
    SiteName: '臺南',
    SiteEngName: 'Tainan',
    AreaName: '雲嘉南空品區',
    County: '臺南市',
    Township: '中西區',
    SiteAddress: '臺南市中西區南寧街45號',
    TWD97Lon: '120.2026170000',
    TWD97Lat: '22.9845810000',
    SiteType: '一般測站',
  }, {
    SiteName: '臺西',
    SiteEngName: 'Taixi',
    AreaName: '雲嘉南空品區',
    County: '雲林縣',
    Township: '臺西鄉',
    SiteAddress: '雲林縣臺西鄉五港路505號',
    TWD97Lon: '120.2028420000',
    TWD97Lat: '23.7175330000',
    SiteType: '工業測站',
    ImageUrl: 'https://taqm.epa.gov.tw/taqm/webcam.ashx?site=41&type=l',
  }, {
    SiteName: '觀音',
    SiteEngName: 'Guanyin',
    AreaName: '北部空品區',
    County: '桃園市',
    Township: '觀音區',
    SiteAddress: '桃園市觀音區文化路2號',
    TWD97Lon: '121.0827610000',
    TWD97Lat: '25.0355030000',
    SiteType: '背景測站',
    ImageUrl: 'https://taqm.epa.gov.tw/taqm/webcam.ashx?site=19&type=l',
  }, {
    SiteName: '關山',
    SiteEngName: 'Guanshan',
    AreaName: '花東空品區',
    County: '臺東縣',
    Township: '關山鎮',
    SiteAddress: '臺東縣關山鎮自強路66號',
    TWD97Lon: '121.1619330000',
    TWD97Lat: '23.0450830000',
    SiteType: '其它測站',
    ImageUrl: 'https://taqm.epa.gov.tw/taqm/webcam.ashx?site=80&type=l',
  }, {
    SiteName: '豐原',
    SiteEngName: 'Fengyuan',
    AreaName: '中部空品區',
    County: '臺中市',
    Township: '豐原區',
    SiteAddress: '臺中市豐原區水源路150號',
    TWD97Lon: '120.7417110000',
    TWD97Lat: '24.2565860000',
    SiteType: '一般測站',
    ImageUrl: 'https://taqm.epa.gov.tw/taqm/webcam.ashx?site=28&type=l',
  }, {
    SiteName: '龍潭',
    SiteEngName: 'Longtan',
    AreaName: '北部空品區',
    County: '桃園市',
    Township: '龍潭區',
    SiteAddress: '桃園市龍潭區中正路210號',
    TWD97Lon: '121.2163500000',
    TWD97Lat: '24.8638690000',
    SiteType: '一般測站',
  }, {
    SiteName: '頭份',
    SiteEngName: 'Toufen',
    AreaName: '竹苗空品區',
    County: '苗栗縣',
    Township: '頭份鎮',
    SiteAddress: '苗栗縣頭份鎮文化街20號',
    TWD97Lon: '120.8985720000',
    TWD97Lat: '24.6969690000',
    SiteType: '工業測站',
  }, {
    SiteName: '橋頭',
    SiteEngName: 'Qiaotou',
    AreaName: '高屏空品區',
    County: '高雄市',
    Township: '橋頭區',
    SiteAddress: '高雄市橋頭區隆豐北路1號',
    TWD97Lon: '120.3056890000',
    TWD97Lat: '22.7575060000',
    SiteType: '背景測站',
  }, {
    SiteName: '線西',
    SiteEngName: 'Xianxi',
    AreaName: '中部空品區',
    County: '彰化縣',
    Township: '線西鄉',
    SiteAddress: '彰化縣線西鄉寓埔村中央路二段145號',
    TWD97Lon: '120.4690610000',
    TWD97Lat: '24.1316720000',
    SiteType: '工業測站',
    ImageUrl: 'https://taqm.epa.gov.tw/taqm/webcam.ashx?site=34&type=l',
  }, {
    SiteName: '潮州',
    SiteEngName: 'Chaozhou',
    AreaName: '高屏空品區',
    County: '屏東縣',
    Township: '潮州鎮',
    SiteAddress: '屏東縣潮州鎮九塊里復興路66號',
    TWD97Lon: '120.5611750000',
    TWD97Lat: '22.5231080000',
    SiteType: '一般測站',
    ImageUrl: 'https://taqm.epa.gov.tw/taqm/webcam.ashx?site=60&type=l',
  }, {
    SiteName: '鳳山',
    SiteEngName: 'Fengshan',
    AreaName: '高屏空品區',
    County: '高雄市',
    Township: '鳳山區',
    SiteAddress: '高雄市鳳山區曹公路6號',
    TWD97Lon: '120.3580830000',
    TWD97Lat: '22.6273920000',
    SiteType: '交通測站',
    ImageUrl: 'https://taqm.epa.gov.tw/taqm/webcam.ashx?site=50&type=l',
  }, {
    SiteName: '彰化',
    SiteEngName: 'Changhua',
    AreaName: '中部空品區',
    County: '彰化縣',
    Township: '彰化市',
    SiteAddress: '彰化縣彰化市文心街55號',
    TWD97Lon: '120.5415190000',
    TWD97Lat: '24.0660000000',
    SiteType: '一般測站',
  }, {
    SiteName: '嘉義',
    SiteEngName: 'Chiayi',
    AreaName: '雲嘉南空品區',
    County: '嘉義市',
    Township: '西區',
    SiteAddress: '嘉義市西區新民路580號',
    TWD97Lon: '120.4408330000',
    TWD97Lat: '23.4627780000',
    SiteType: '一般測站',
    ImageUrl: 'https://taqm.epa.gov.tw/taqm/webcam.ashx?site=42&type=l',
  }, {
    SiteName: '萬華',
    SiteEngName: 'Wanhua',
    AreaName: '北部空品區',
    County: '臺北市',
    Township: '萬華區',
    SiteAddress: '臺北市萬華區中華路1段66號',
    TWD97Lon: '121.5079720000',
    TWD97Lat: '25.0465030000',
    SiteType: '一般測站',
    ImageUrl: 'https://taqm.epa.gov.tw/taqm/webcam.ashx?site=13&type=l',
  }, {
    SiteName: '萬里',
    SiteEngName: 'Wanli',
    AreaName: '北部空品區',
    County: '新北市',
    Township: '萬里區',
    SiteAddress: '新北市萬里區瑪鋉路221號',
    TWD97Lon: '121.6898810000',
    TWD97Lat: '25.1796670000',
    SiteType: '一般測站',
  }, {
    SiteName: '楠梓',
    SiteEngName: 'Nanzi',
    AreaName: '高屏空品區',
    County: '高雄市',
    Township: '楠梓區',
    SiteAddress: '高雄市楠梓區楠梓路262號',
    TWD97Lon: '120.3282890000',
    TWD97Lat: '22.7336670000',
    SiteType: '一般測站',
  }, {
    SiteName: '新營',
    SiteEngName: 'Xinying',
    AreaName: '雲嘉南空品區',
    County: '臺南市',
    Township: '新營區',
    SiteAddress: '臺南市新營區中正路4號',
    TWD97Lon: '120.3172500000',
    TWD97Lat: '23.3056330000',
    SiteType: '一般測站',
    ImageUrl: 'https://taqm.epa.gov.tw/taqm/webcam.ashx?site=43&type=l',
  }, {
    SiteName: '新港',
    SiteEngName: 'Xingang',
    AreaName: '雲嘉南空品區',
    County: '嘉義縣',
    Township: '新港鄉',
    SiteAddress: '嘉義縣新港鄉登雲路105號',
    TWD97Lon: '120.3455310000',
    TWD97Lat: '23.5548390000',
    SiteType: '一般測站',
    ImageUrl: 'https://taqm.epa.gov.tw/taqm/webcam.ashx?site=39&type=l',
  }, {
    SiteName: '新莊',
    SiteEngName: 'Xinzhuang',
    AreaName: '北部空品區',
    County: '新北市',
    Township: '新莊區',
    SiteAddress: '新北市新莊區中正路510號',
    TWD97Lon: '121.4325000000',
    TWD97Lat: '25.0379720000',
    SiteType: '一般測站',
    ImageUrl: 'https://taqm.epa.gov.tw/taqm/webcam.ashx?site=7&type=l',
  }, {
    SiteName: '新店',
    SiteEngName: 'Xindian',
    AreaName: '北部空品區',
    County: '新北市',
    Township: '新店區',
    SiteAddress: '新北市新店區民族路108號',
    TWD97Lon: '121.5377780000',
    TWD97Lat: '24.9772220000',
    SiteType: '一般測站',
    ImageUrl: 'https://taqm.epa.gov.tw/taqm/webcam.ashx?site=4&type=l',
  }, {
    SiteName: '新竹',
    SiteEngName: 'Hsinchu',
    AreaName: '竹苗空品區',
    County: '新竹市',
    Township: '東區',
    SiteAddress: '新竹市民族路33號',
    TWD97Lon: '120.9720750000',
    TWD97Lat: '24.8056190000',
    SiteType: '一般測站',
  }, {
    SiteName: '陽明',
    SiteEngName: 'Yangming',
    AreaName: '北部空品區',
    County: '臺北市',
    Township: '北投區',
    SiteAddress: '臺北市北投區竹子湖路111號',
    TWD97Lon: '121.5295830000',
    TWD97Lat: '25.1827220000',
    SiteType: '公園測站',
    ImageUrl: 'https://taqm.epa.gov.tw/taqm/webcam.ashx?site=64&type=l',
  }, {
    SiteName: '菜寮',
    SiteEngName: 'Cailiao',
    AreaName: '北部空品區',
    County: '新北市',
    Township: '三重區',
    SiteAddress: '新北市三重區中正北路163號',
    TWD97Lon: '121.4810280000',
    TWD97Lat: '25.0689500000',
    SiteType: '一般測站',
  }, {
    SiteName: '善化',
    SiteEngName: 'Shanhua',
    AreaName: '雲嘉南空品區',
    County: '臺南市',
    Township: '善化區',
    SiteAddress: '臺南市善化區益名寮60號',
    TWD97Lon: '120.2971420000',
    TWD97Lat: '23.1150970000',
    SiteType: '一般測站',
    ImageUrl: 'https://taqm.epa.gov.tw/taqm/webcam.ashx?site=44&type=l',
  }, {
    SiteName: '湖口',
    SiteEngName: 'Hukou',
    AreaName: '竹苗空品區',
    County: '新竹縣',
    Township: '湖口鄉',
    SiteAddress: '新竹縣湖口鄉成功路360號',
    TWD97Lon: '121.0386530000',
    TWD97Lat: '24.9001420000',
    SiteType: '一般測站',
  }, {
    SiteName: '復興',
    SiteEngName: 'Fuxing',
    AreaName: '高屏空品區',
    County: '高雄市',
    Township: '前鎮區',
    SiteAddress: '高雄市前鎮區民權二路331號',
    TWD97Lon: '120.3120170000',
    TWD97Lat: '22.6087110000',
    SiteType: '交通測站',
  }, {
    SiteName: '麥寮',
    SiteEngName: 'Mailiao',
    AreaName: '雲嘉南空品區',
    County: '雲林縣',
    Township: '麥寮鄉',
    SiteAddress: '雲林縣麥寮鄉中興路115號',
    TWD97Lon: '120.2518250000',
    TWD97Lat: '23.7535060000',
    SiteType: '工業測站',
    ImageUrl: 'https://taqm.epa.gov.tw/taqm/webcam.ashx?site=83&type=l',
  }, {
    SiteName: '淡水',
    SiteEngName: 'Tamsui',
    AreaName: '北部空品區',
    County: '新北市',
    Township: '淡水區',
    SiteAddress: '新北市淡水區中正東路42巷6號',
    TWD97Lon: '121.4492390000',
    TWD97Lat: '25.1645000000',
    SiteType: '一般測站',
  }, {
    SiteName: '崙背',
    SiteEngName: 'Lunbei',
    AreaName: '雲嘉南空品區',
    County: '雲林縣',
    Township: '崙背鄉',
    SiteAddress: '雲林縣崙背鄉南陽村大成路91號',
    TWD97Lon: '120.3487420000',
    TWD97Lat: '23.7575470000',
    SiteType: '一般測站',
    ImageUrl: 'https://taqm.epa.gov.tw/taqm/webcam.ashx?site=38&type=l',
  }, {
    SiteName: '基隆',
    SiteEngName: 'Keelung',
    AreaName: '北部空品區',
    County: '基隆市',
    Township: '信義區',
    SiteAddress: '基隆市東信路324號',
    TWD97Lon: '121.7600560000',
    TWD97Lat: '25.1291670000',
    SiteType: '一般測站',
    ImageUrl: 'https://taqm.epa.gov.tw/taqm/webcam.ashx?site=1&type=l',
  }, {
    SiteName: '馬祖',
    SiteEngName: 'Matsu',
    AreaName: '其他',
    County: '連江縣',
    Township: '南竿鄉',
    SiteAddress: '連江縣南竿鄉介壽村13號',
    TWD97Lon: '119.9498750000',
    TWD97Lat: '26.1604690000',
    SiteType: '一般測站',
    ImageUrl: 'https://taqm.epa.gov.tw/taqm/webcam.ashx?site=75&type=l',
  }, {
    SiteName: '馬公',
    SiteEngName: 'Magong',
    AreaName: '其他',
    County: '澎湖縣',
    Township: '馬公市',
    SiteAddress: '澎湖縣馬公市中正路115號',
    TWD97Lon: '119.5661580000',
    TWD97Lat: '23.5690310000',
    SiteType: '一般測站',
    ImageUrl: 'https://taqm.epa.gov.tw/taqm/webcam.ashx?site=78&type=l',
  }, {
    SiteName: '桃園',
    SiteEngName: 'Taoyuan',
    AreaName: '北部空品區',
    County: '桃園市',
    Township: '桃園區',
    SiteAddress: '桃園市桃園區成功路二段144號',
    TWD97Lon: '121.3199640000',
    TWD97Lat: '24.9947890000',
    SiteType: '一般測站',
    ImageUrl: 'https://taqm.epa.gov.tw/taqm/webcam.ashx?site=18&type=l',
  }, {
    SiteName: '埔里',
    SiteEngName: 'Puli',
    AreaName: '中部空品區',
    County: '南投縣',
    Township: '埔里鎮',
    SiteAddress: '南投縣埔里鎮西安路一段193號',
    TWD97Lon: '120.9679030000',
    TWD97Lat: '23.9688420000',
    SiteType: '其它測站',
  }, {
    SiteName: '苗栗',
    SiteEngName: 'Miaoli',
    AreaName: '竹苗空品區',
    County: '苗栗縣',
    Township: '苗栗市',
    SiteAddress: '苗栗市縣府路100號',
    TWD97Lon: '120.8202000000',
    TWD97Lat: '24.5652690000',
    SiteType: '一般測站',
  }, {
    SiteName: '美濃',
    SiteEngName: 'Meinong',
    AreaName: '高屏空品區',
    County: '高雄市',
    Township: '美濃區',
    SiteAddress: '高雄市美濃區中壇里忠孝路19號',
    TWD97Lon: '120.5305420000',
    TWD97Lat: '22.8835830000',
    SiteType: '一般測站',
    ImageUrl: 'https://taqm.epa.gov.tw/taqm/webcam.ashx?site=47&type=l',
  }, {
    SiteName: '恆春',
    SiteEngName: 'Hengchun',
    AreaName: '高屏空品區',
    County: '屏東縣',
    Township: '恆春鎮',
    SiteAddress: '屏東縣恆春鎮公園路44號',
    TWD97Lon: '120.7889280000',
    TWD97Lat: '21.9580690000',
    SiteType: '一般測站',
    ImageUrl: 'https://taqm.epa.gov.tw/taqm/webcam.ashx?site=61&type=l',
  }, {
    SiteName: '屏東',
    SiteEngName: 'Pingtung',
    AreaName: '高屏空品區',
    County: '屏東縣',
    Township: '屏東市',
    SiteAddress: '屏東市蘇州街75號',
    TWD97Lon: '120.4880330000',
    TWD97Lat: '22.6730810000',
    SiteType: '一般測站',
  }, {
    SiteName: '南投',
    SiteEngName: 'Nantou',
    AreaName: '中部空品區',
    County: '南投縣',
    Township: '南投市',
    SiteAddress: '南投市南陽路269號',
    TWD97Lon: '120.6853060000',
    TWD97Lat: '23.9130000000',
    SiteType: '一般測站',
    ImageUrl: 'https://taqm.epa.gov.tw/taqm/webcam.ashx?site=36&type=l',
  }, {
    SiteName: '前鎮',
    SiteEngName: 'Qianzhen',
    AreaName: '高屏空品區',
    County: '高雄市',
    Township: '前鎮區',
    SiteAddress: '高雄市前鎮區中山三路43號',
    TWD97Lon: '120.3075640000',
    TWD97Lat: '22.6053860000',
    SiteType: '工業測站',
    ImageUrl: 'https://taqm.epa.gov.tw/taqm/webcam.ashx?site=57&type=l',
  }, {
    SiteName: '前金',
    SiteEngName: 'Qianjin',
    AreaName: '高屏空品區',
    County: '高雄市',
    Township: '前金區',
    SiteAddress: '高雄市前金區河南二路196號',
    TWD97Lon: '120.2880860000',
    TWD97Lat: '22.6325670000',
    SiteType: '一般測站',
  }, {
    SiteName: '金門',
    SiteEngName: 'Kinmen',
    AreaName: '其他',
    County: '金門縣',
    Township: '金城鎮',
    SiteAddress: '金門縣金城鎮民權路32號',
    TWD97Lon: '118.3122560000',
    TWD97Lat: '24.4321330000',
    SiteType: '一般測站',
    ImageUrl: 'https://taqm.epa.gov.tw/taqm/webcam.ashx?site=77&type=l',
  }, {
    SiteName: '花蓮',
    SiteEngName: 'Hualien',
    AreaName: '花東空品區',
    County: '花蓮縣',
    Township: '花蓮市',
    SiteAddress: '花蓮市中正路210號',
    TWD97Lon: '121.5997690000',
    TWD97Lat: '23.9713060000',
    SiteType: '一般測站',
    ImageUrl: 'https://taqm.epa.gov.tw/taqm/webcam.ashx?site=63&type=l',
  }, {
    SiteName: '松山',
    SiteEngName: 'Songshan',
    AreaName: '北部空品區',
    County: '臺北市',
    Township: '松山區',
    SiteAddress: '臺北市松山區八德路四段746號',
    TWD97Lon: '121.5786110000',
    TWD97Lat: '25.0500000000',
    SiteType: '一般測站',
  }, {
    SiteName: '板橋',
    SiteEngName: 'Banqiao',
    AreaName: '北部空品區',
    County: '新北市',
    Township: '板橋區',
    SiteAddress: '新北市板橋區文化路一段25號',
    TWD97Lon: '121.4586670000',
    TWD97Lat: '25.0129720000',
    SiteType: '一般測站',
  }, {
    SiteName: '林園',
    SiteEngName: 'Linyuan',
    AreaName: '高屏空品區',
    County: '高雄市',
    Township: '林園區',
    SiteAddress: '高雄市林園區北汕路58巷2號',
    TWD97Lon: '120.4117500000',
    TWD97Lat: '22.4795000000',
    SiteType: '一般測站',
    ImageUrl: 'https://taqm.epa.gov.tw/taqm/webcam.ashx?site=52&type=l',
  }, {
    SiteName: '林口',
    SiteEngName: 'Linkou',
    AreaName: '北部空品區',
    County: '新北市',
    Township: '林口區',
    SiteAddress: '新北市林口區民治路25號',
    TWD97Lon: '121.3768690000',
    TWD97Lat: '25.0771970000',
    SiteType: '一般測站',
    ImageUrl: 'https://taqm.epa.gov.tw/taqm/webcam.ashx?site=9&type=l',
  }, {
    SiteName: '忠明',
    SiteEngName: 'Zhongming',
    AreaName: '中部空品區',
    County: '臺中市',
    Township: '南屯區',
    SiteAddress: '臺中市南屯區公益路二段296號',
    TWD97Lon: '120.6410920000',
    TWD97Lat: '24.1519580000',
    SiteType: '一般測站',
    ImageUrl: 'https://taqm.epa.gov.tw/taqm/webcam.ashx?site=31&type=l',
  }, {
    SiteName: '宜蘭',
    SiteEngName: 'Yilan',
    AreaName: '宜蘭空品區',
    County: '宜蘭縣',
    Township: '宜蘭市',
    SiteAddress: '宜蘭縣宜蘭市復興路二段77號',
    TWD97Lon: '121.7463940000',
    TWD97Lat: '24.7479170000',
    SiteType: '一般測站',
    ImageUrl: 'https://taqm.epa.gov.tw/taqm/webcam.ashx?site=65&type=l',
  }, {
    SiteName: '沙鹿',
    SiteEngName: 'Shalu',
    AreaName: '中部空品區',
    County: '臺中市',
    Township: '沙鹿區',
    SiteAddress: '臺中市沙鹿區英才路150號',
    TWD97Lon: '120.5687940000',
    TWD97Lat: '24.2256280000',
    SiteType: '一般測站',
    ImageUrl: 'https://taqm.epa.gov.tw/taqm/webcam.ashx?site=29&type=l',
  }, {
    SiteName: '西屯',
    SiteEngName: 'Xitun',
    AreaName: '中部空品區',
    County: '臺中市',
    Township: '西屯區',
    SiteAddress: '臺中市西屯區安和路1號',
    TWD97Lon: '120.6169170000',
    TWD97Lat: '24.1621970000',
    SiteType: '一般測站',
    ImageUrl: 'https://taqm.epa.gov.tw/taqm/webcam.ashx?site=32&type=l',
  }, {
    SiteName: '竹東',
    SiteEngName: 'Zhudong',
    AreaName: '竹苗空品區',
    County: '新竹縣',
    Township: '竹東鎮',
    SiteAddress: '新竹縣竹東鎮榮樂里三民街70號',
    TWD97Lon: '121.0889030000',
    TWD97Lat: '24.7406440000',
    SiteType: '一般測站',
  }, {
    SiteName: '竹山',
    SiteEngName: 'Zhushan',
    AreaName: '中部空品區',
    County: '南投縣',
    Township: '竹山鎮',
    SiteAddress: '南投縣竹山鎮大明路666號',
    TWD97Lon: '120.6773060000',
    TWD97Lat: '23.7563890000',
    SiteType: '一般測站',
    ImageUrl: 'https://taqm.epa.gov.tw/taqm/webcam.ashx?site=69&type=l',
  }, {
    SiteName: '汐止',
    SiteEngName: 'Xizhi',
    AreaName: '北部空品區',
    County: '新北市',
    Township: '汐止區',
    SiteAddress: '新北市汐止區樟樹一路141巷2號',
    TWD97Lon: '121.6405878',
    TWD97Lat: '25.0658384',
    SiteType: '一般測站',
    ImageUrl: 'https://taqm.epa.gov.tw/taqm/webcam.ashx?site=2&type=l',
  }, {
    SiteName: '朴子',
    SiteEngName: 'Puzi',
    AreaName: '雲嘉南空品區',
    County: '嘉義縣',
    Township: '朴子市',
    SiteAddress: '嘉義縣朴子市光復路34號',
    TWD97Lon: '120.2473500000',
    TWD97Lat: '23.4653080000',
    SiteType: '一般測站',
    ImageUrl: 'https://taqm.epa.gov.tw/taqm/webcam.ashx?site=40&type=l',
  }, {
    SiteName: '安南',
    SiteEngName: 'Annan',
    AreaName: '雲嘉南空品區',
    County: '臺南市',
    Township: '安南區',
    SiteAddress: '臺南市安南區安和路三段193號',
    TWD97Lon: '120.2175000000',
    TWD97Lat: '23.0481970000',
    SiteType: '一般測站',
    ImageUrl: 'https://taqm.epa.gov.tw/taqm/webcam.ashx?site=45&type=l',
  }, {
    SiteName: '永和',
    SiteEngName: 'Yonghe',
    AreaName: '北部空品區',
    County: '新北市',
    Township: '永和區',
    SiteAddress: '新北市永和區永和路光復路交口',
    TWD97Lon: '121.5163060000',
    TWD97Lat: '25.0170000000',
    SiteType: '交通測站',
    ImageUrl: 'https://taqm.epa.gov.tw/taqm/webcam.ashx?site=70&type=l',
  }, {
    SiteName: '平鎮',
    SiteEngName: 'Pingzhen',
    AreaName: '北部空品區',
    County: '桃園市',
    Township: '平鎮區',
    SiteAddress: '桃園市平鎮區文化街189號',
    TWD97Lon: '121.2039860000',
    TWD97Lat: '24.9527860000',
    SiteType: '一般測站',
  }, {
    SiteName: '左營',
    SiteEngName: 'Zuoying',
    AreaName: '高屏空品區',
    County: '高雄市',
    Township: '左營區',
    SiteAddress: '高雄市左營區翠華路687號',
    TWD97Lon: '120.2929170000',
    TWD97Lat: '22.6748610000',
    SiteType: '一般測站',
  }, {
    SiteName: '古亭',
    SiteEngName: 'Guting',
    AreaName: '北部空品區',
    County: '臺北市',
    Township: '大安區',
    SiteAddress: '臺北市大安區羅斯福路三段153號',
    TWD97Lon: '121.5295560000',
    TWD97Lat: '25.0206080000',
    SiteType: '一般測站',
  }, {
    SiteName: '冬山',
    SiteEngName: 'Dongshan',
    AreaName: '宜蘭空品區',
    County: '宜蘭縣',
    Township: '冬山鄉',
    SiteAddress: '宜蘭縣冬山鄉南興村照安路26號',
    TWD97Lon: '121.7929280000',
    TWD97Lat: '24.6322030000',
    SiteType: '一般測站',
    ImageUrl: 'https://taqm.epa.gov.tw/taqm/webcam.ashx?site=66&type=l',
  }, {
    SiteName: '斗六',
    SiteEngName: 'Douliu',
    AreaName: '雲嘉南空品區',
    County: '雲林縣',
    Township: '斗六市',
    SiteAddress: '雲林縣斗六市民生路224號',
    TWD97Lon: '120.5449940000',
    TWD97Lat: '23.7118530000',
    SiteType: '一般測站',
    ImageUrl: 'https://taqm.epa.gov.tw/taqm/webcam.ashx?site=37&type=l',
  }, {
    SiteName: '仁武',
    SiteEngName: 'Renwu',
    AreaName: '高屏空品區',
    County: '高雄市',
    Township: '仁武區',
    SiteAddress: '高雄市仁武區八卦里永仁街555號',
    TWD97Lon: '120.3326310000',
    TWD97Lat: '22.6890560000',
    SiteType: '一般測站',
    ImageUrl: 'https://taqm.epa.gov.tw/taqm/webcam.ashx?site=49&type=l',
  }, {
    SiteName: '中壢',
    SiteEngName: 'Zhongli',
    AreaName: '北部空品區',
    County: '桃園市',
    Township: '中壢區',
    SiteAddress: '桃園市中壢區延平路622號',
    TWD97Lon: '121.2216670000',
    TWD97Lat: '24.9532780000',
    SiteType: '交通測站',
    ImageUrl: 'https://taqm.epa.gov.tw/taqm/webcam.ashx?site=68&type=l',
  }, {
    SiteName: '中山',
    SiteEngName: 'Zhongshan',
    AreaName: '北部空品區',
    County: '臺北市',
    Township: '中山區',
    SiteAddress: '臺北市中山區林森北路511號',
    TWD97Lon: '121.5265280000',
    TWD97Lat: '25.0623610000',
    SiteType: '一般測站',
  }, {
    SiteName: '小港',
    SiteEngName: 'Xiaogang',
    AreaName: '高屏空品區',
    County: '高雄市',
    Township: '小港區',
    SiteAddress: '高雄市小港區平和南路185號',
    TWD97Lon: '120.3377360000',
    TWD97Lat: '22.5658330000',
    SiteType: '一般測站',
    ImageUrl: 'https://taqm.epa.gov.tw/taqm/webcam.ashx?site=58&type=l',
  }, {
    SiteName: '大寮',
    SiteEngName: 'Daliao',
    AreaName: '高屏空品區',
    County: '高雄市',
    Township: '大寮區',
    SiteAddress: '高雄市大寮區潮寮路61號',
    TWD97Lon: '120.4250810000',
    TWD97Lat: '22.5657470000',
    SiteType: '一般測站',
    ImageUrl: 'https://taqm.epa.gov.tw/taqm/webcam.ashx?site=51&type=l',
  }, {
    SiteName: '大園',
    SiteEngName: 'Dayuan',
    AreaName: '北部空品區',
    County: '桃園市',
    Township: '大園區',
    SiteAddress: '桃園市大園區中正東路160號',
    TWD97Lon: '121.2018110000',
    TWD97Lat: '25.0603440000',
    SiteType: '一般測站',
    ImageUrl: 'https://taqm.epa.gov.tw/taqm/webcam.ashx?site=18&type=l',
  }, {
    SiteName: '大里',
    SiteEngName: 'Dali',
    AreaName: '中部空品區',
    County: '臺中市',
    Township: '大里區',
    SiteAddress: '臺中市大里區大新街36號',
    TWD97Lon: '120.6776890000',
    TWD97Lat: '24.0996110000',
    SiteType: '一般測站',
  }, {
    SiteName: '大同',
    SiteEngName: 'Datong',
    AreaName: '北部空品區',
    County: '臺北市',
    Township: '大同區',
    SiteAddress: '臺北市大同區重慶北路三段2號',
    TWD97Lon: '121.5133110000',
    TWD97Lat: '25.0632000000',
    SiteType: '交通測站',
  }, {
    SiteName: '士林',
    SiteEngName: 'Shilin',
    AreaName: '北部空品區',
    County: '臺北市',
    Township: '北投區',
    SiteAddress: '臺北市北投區文林北路155號',
    TWD97Lon: '121.5153890000',
    TWD97Lat: '25.1054170000',
    SiteType: '一般測站',
    ImageUrl: 'https://taqm.epa.gov.tw/taqm/webcam.ashx?site=11&type=l',
  }, {
    SiteName: '土城',
    SiteEngName: 'Tucheng',
    AreaName: '北部空品區',
    County: '新北市',
    Township: '土城區',
    SiteAddress: '新北市土城區學府路一段241號',
    TWD97Lon: '121.4518610000',
    TWD97Lat: '24.9825280000',
    SiteType: '一般測站',
  }, {
    SiteName: '三義',
    SiteEngName: 'Sanyi',
    AreaName: '竹苗空品區',
    County: '苗栗縣',
    Township: '三義鄉',
    SiteAddress: '苗栗縣三義鄉西湖村上湖61-1號',
    TWD97Lon: '120.7588330000',
    TWD97Lat: '24.3829420000',
    SiteType: '一般測站',
    ImageUrl: 'https://taqm.epa.gov.tw/taqm/webcam.ashx?site=27&type=l',
  }, {
    SiteName: '三重',
    SiteEngName: 'Sanchong',
    AreaName: '北部空品區',
    County: '新北市',
    Township: '三重區',
    SiteAddress: '新北市三重區三和路重陽路交口',
    TWD97Lon: '121.4938060000',
    TWD97Lat: '25.0726110000',
    SiteType: '交通測站',
  }, {
    SiteName: '二林',
    SiteEngName: 'Erlin',
    AreaName: '中部空品區',
    County: '彰化縣',
    Township: '二林鎮',
    SiteAddress: '彰化縣二林鎮萬合里江山巷1號',
    TWD97Lon: '120.4096530000',
    TWD97Lat: '23.9251750000',
    SiteType: '一般測站',
    ImageUrl: 'https://taqm.epa.gov.tw/taqm/webcam.ashx?site=35&type=l',
  }, {
    SiteName: '富貴角',
    SiteEngName: 'FugueiCape',
    AreaName: '北部空品區',
    County: '新北市',
    Township: '石門區',
    SiteAddress: '新北市石門區山溪里10鄰九芎林13號',
    TWD97Lon: '121.5652580000',
    TWD97Lat: '25.2637830000',
    SiteType: '一般測站',
    ImageUrl: 'https://taqm.epa.gov.tw/taqm/webcam.ashx?site=84&type=l',
  },
];


const getClosestStation = (lat, long) => {
  let distance = Number.POSITIVE_INFINITY;
  let closestIndex = 40;

  for (i = 0; i < locations.length; i += 1) {
    const squarePlus = ((lat - locations[i].TWD97Lat) ** 2) + ((long - locations[i].TWD97Lon) ** 2);

    if (squarePlus < distance) {
      distance = Math.min(squarePlus, distance);
      closestIndex = i;
    }
  }

  return locations[closestIndex];
};


exports.getClosestStation = getClosestStation;
exports.countys = uniq(locations.sort(compare).map(item => item.County));
exports.locations = locations;
