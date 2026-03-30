/**
 * IP 归属地欢迎组件 - 修复版
 * 修复：1. 深色模式文字颜色  2. 全局字体继承
 */

window.IP_CONFIG = {
    API_KEY: '539d031458737893', // 填写你的 API 密钥
    BLOG_LOCATION: {
        lng: 118.36, 
        lat: 35.11   
    },
    CACHE_DURATION: 1000 * 60 * 60,
    HOME_PAGE_ONLY: true,
};

// ==========================================
// 样式注入（修复颜色与字体）
// ==========================================
const addStyles = () => {
    if (document.getElementById('ip-welcome-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'ip-welcome-styles';
    style.textContent = `
        /* 欢迎卡片容器 - 移除硬编码字体，继承全局 */
        #welcome-info {
            user-select: none;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 120px;
            padding: 16px;
            margin-top: 8px;
            border-radius: 12px;
            background-color: var(--anzhiyu-background);
            outline: 1px solid var(--anzhiyu-card-border);
            /* 关键修复：不设置font-family，继承全局字体 */
            color: var(--anzhiyu-font); /* 使用主题文字颜色变量 */
        }
        
        /* 加载动画 */
        .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(128, 128, 128, 0.2); /* 改为灰色，避免纯白/纯黑 */
            border-radius: 50%;
            border-top: 3px solid var(--anzhiyu-main);
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        /* IP 模糊保护 */
        .ip-address {
            filter: blur(5px);
            transition: filter 0.3s ease;
            cursor: pointer;
            color: var(--anzhiyu-font) !important; /* 强制继承文字色 */
        }
        .ip-address:hover {
            filter: blur(0);
        }
        
        /* 错误提示 - 使用CSS变量确保深色模式可见 */
        .error-message {
            color: var(--anzhiyu-font); /* 不使用硬编码红色，或确保对比度 */
            opacity: 0.9;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            gap: 8px;
        }
        .error-message p { 
            margin: 0; 
            color: var(--anzhiyu-font); /* 强制使用主题文字色 */
        }
        .error-icon { 
            font-size: 2.5rem; 
            opacity: 0.8;
        }
        
        /* 重试按钮 */
        #retry-button {
            cursor: pointer;
            color: var(--anzhiyu-main);
            text-decoration: underline;
            font-weight: bold;
            margin: 0 4px;
            transition: opacity 0.3s;
        }
        #retry-button:hover { opacity: 0.8; }
        
        /* 权限弹窗 */
        .permission-dialog {
            text-align: center;
            padding: 10px;
            color: var(--anzhiyu-font); /* 确保文字颜色 */
        }
        .permission-dialog .error-icon { 
            font-size: 2rem; 
            margin-bottom: 8px;
            color: var(--anzhiyu-font);
        }
        .permission-dialog p { 
            margin: 0 0 12px 0; 
            color: var(--anzhiyu-font); /* 关键修复：使用主题变量 */
        }
        .permission-dialog button {
            margin: 0 6px;
            padding: 6px 16px;
            border: none;
            border-radius: 6px;
            background-color: var(--anzhiyu-main);
            color: var(--anzhiyu-white, #fff); /* 按钮文字用白色或变量 */
            font-size: 13px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .permission-dialog button:hover {
            opacity: 0.85;
            transform: translateY(-1px);
        }
        
        /* 欢迎文字样式 - 关键修复 */
        .welcome-text {
            line-height: 1.8;
            font-size: 14px;
            /* 关键修复：使用主题文字颜色变量，不硬编码 */
            color: var(--anzhiyu-font);
            text-align: center;
            /* 不设置font-family，继承全局字体 */
        }
        .welcome-text b {
            color: var(--anzhiyu-main); /* 高亮文字使用主题色 */
            font-weight: 600;
        }
        
        /* 确保所有子元素继承颜色 */
        .welcome-text span,
        .welcome-text div {
            color: inherit;
        }
    `;
    document.head.appendChild(style);
};

// ==========================================
// 其余逻辑保持不变...
// ==========================================
const isHomePage = () => {
    const path = window.location.pathname;
    return path === '/' || path === '/index.html' || path === '/index.php' || path === '';
};

const getWelcomeInfoElement = () => document.querySelector('#welcome-info');

const fetchIpData = async () => {
    const response = await fetch(`https://v1.nsuuu.com/api/ipip?key=${IP_CONFIG.API_KEY}`);
    if (!response.ok) throw new Error('网络响应不正常');
    
    const json = await response.json();
    if (json.code !== 200) throw new Error(json.message || 'API返回错误');
    
    const apiData = json.data;
    
    return {
        ip: apiData.ip || '未知',
        data: {
            country: apiData.country || '神秘地区',
            province: apiData.province || '',
            city: apiData.city || '',
            lng: parseFloat(apiData.longitude) || 0,
            lat: parseFloat(apiData.latitude) || 0
        }
    };
};

const showWelcome = ({ data, ip }) => {
    if (!data) return showErrorMessage('数据解析失败');

    const { lng, lat, country, province, city } = data;
    const welcomeInfo = getWelcomeInfoElement();
    if (!welcomeInfo) return;

    const dist = calculateDistance(lng, lat);
    const ipDisplay = formatIpDisplay(ip);
    const pos = formatLocation(country, province, city);

    welcomeInfo.innerHTML = generateWelcomeMessage(pos, dist, ipDisplay, country, province, city);
};

const calculateDistance = (lng, lat) => {
    const R = 6371;
    const rad = Math.PI / 180;
    const dLat = (lat - IP_CONFIG.BLOG_LOCATION.lat) * rad;
    const dLon = (lng - IP_CONFIG.BLOG_LOCATION.lng) * rad;
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(IP_CONFIG.BLOG_LOCATION.lat * rad) * Math.cos(lat * rad) *
        Math.sin(dLon / 2) ** 2;
    return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

const formatIpDisplay = (ip) => 
    ip.includes(":") ? "<br>好复杂，咱看不懂~(ipv6)" : ip;

const formatLocation = (country, prov, city) => {
    if (!country || country === '神秘地区') return '神秘地区';
    
    if (country === "中国") {
        if (prov && city && (prov === city || prov.includes(city) || city.includes(prov))) {
            return city;
        }
        return `${prov} ${city}`.trim() || prov;
    }
    return country;
};

const generateWelcomeMessage = (pos, dist, ipDisplay, country, prov, city) => `
    <div class="welcome-text">
        欢迎来自 <b>${pos}</b> 的小友💖<br>
        你当前距博主约 <b>${dist}</b> 公里！<br>
        你的IP地址：<b class="ip-address">${ipDisplay}</b><br>
        ${getTimeGreeting()}<br>
        Tip：<b>${getGreeting(country, prov, city)}🍂</b>
    </div>
`;

const findMatchingKey = (object, searchKey) => {
    if (!object || !searchKey) return null;
    if (object[searchKey]) return searchKey;
    
    const keys = Object.keys(object);
    const match = keys.find(key => 
        key.includes(searchKey) || searchKey.includes(key)
    );
    return match || null;
};

const getGreeting = (country, province, city) => {
    const matchedCountryKey = findMatchingKey(greetings, country);
    const countryConfig = matchedCountryKey ? greetings[matchedCountryKey] : greetings["其他"];

    if (typeof countryConfig === 'string') return countryConfig;

    const matchedProvinceKey = findMatchingKey(countryConfig, province);
    const provinceConfig = matchedProvinceKey ? countryConfig[matchedProvinceKey] : countryConfig["其他"];

    if (typeof provinceConfig === 'string') return provinceConfig;

    const matchedCityKey = findMatchingKey(provinceConfig, city);
    return matchedCityKey ? provinceConfig[matchedCityKey] : 
           provinceConfig["其他"] || 
           countryConfig["其他"] || 
           greetings["其他"];
};

const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) return "凌晨好还在修仙吗？💤";
    if (hour < 9) return "早上好，一日之计在于晨 🌅";
    if (hour < 12) return "上午好，工作顺利嘛？💻";
    if (hour < 14) return "中午好，午休时间到啦 ☀️";
    if (hour < 17) return "下午好，饮茶先啦 🍵";
    if (hour < 19) return "即将下班，记得按时吃饭 🍜";
    if (hour < 22) return "晚上好，放松一下吧 🌙";
    return "夜深了，早点休息喔 🛌";
};

const greetings = {
    "中国": {
        "北京市": "这里有紫禁城的红墙黄瓦，也有胡同里的烟火人间",
        "上海市": "魔都结界，咖啡与生煎共舞，侬好呀！",
        "天津市": "结界！这里是天津卫，煎饼果子来一套？",
        "重庆市": "勒是雾都！8D魔幻城市，火锅底料整起！",
        "香港": "东方之珠，购物天堂",
        "澳门": "中西合璧，美食无限",
        "河北省": {
            "石家庄市": "国际庄欢迎您，摇滚之乡！",
            "秦皇岛市": "东临碣石，以观沧海",
            "保定市": "驴肉火烧，真香！",
            "唐山市": "凤凰涅槃，工业重镇",
            "邯郸市": "三千年古都，成语之乡",
            "其他": "山势巍巍成壁垒，无限江山"
        },
        "山西省": {
            "太原市": "人说山西好风光，地肥水美五谷香",
            "大同市": "云冈石窟，千年微笑",
            "平遥": "穿越回清朝，看古城风貌",
            "临汾市": "华夏第一都，寻根问祖",
            "其他": "展开坐具长三尺，已占山河五百余"
        },
        "内蒙古自治区": {
            "呼和浩特市": "青城乳香飘，我在草原等你",
            "包头市": "鹿城风光好，钢铁意志强",
            "呼伦贝尔市": "大草原，大森林，大湿地",
            "其他": "天苍苍，野茫茫，风吹草低见牛羊"
        },
        "辽宁省": {
            "沈阳市": "一朝发祥地，两代帝王都，鸡架管够！",
            "大连市": "海风吹，海浪涌，这里是浪漫之都",
            "鞍山市": "钢铁之都，共和国长子",
            "其他": "老铁，来吃顿烧烤不？"
        },
        "吉林省": {
            "长春市": "北国春城，电影与汽车的摇篮",
            "吉林市": "雾凇岛上看雾凇，松花江畔吹晚风",
            "延边": "这里的冷面和打糕超级好吃！",
            "其他": "长白山下，雪花飘飘"
        },
        "黑龙江省": {
            "哈尔滨市": "东方小巴黎，中央大街走一走",
            "齐齐哈尔市": "这里是烧烤的耶路撒冷！",
            "大庆市": "石油之城，铁人精神",
            "漠河": "去找北，看极光",
            "其他": "不管是也是北，此处最北！"
        },
        "江苏省": {
            "南京市": "六朝古都，鸭血粉丝汤一绝",
            "苏州市": "君到姑苏见，人家尽枕河",
            "无锡市": "太湖佳绝处，毕竟在鼋头",
            "常州市": "中华恐龙园，童心未泯",
            "扬州市": "烟花三月下扬州，早上皮包水",
            "徐州市": "彭城自古列九州，帝王之乡",
            "连云港市": "孙大圣的老家，花果山下",
            "其他": "散装江苏，各自精彩！"
        },
        "浙江省": {
            "杭州市": "欲把西湖比西子，淡妆浓抹总相宜",
            "宁波市": "书藏古今，港通天下",
            "温州市": "这里的人都很会做生意！",
            "绍兴市": "鲁迅故里，乌篷船摇",
            "嘉兴市": "南湖烟雨，红船启航",
            "其他": "鱼米之乡，丝绸之府"
        },
        "安徽省": {
            "合肥市": "霸都欢迎你，科技之光闪耀",
            "芜湖市": "芜湖！起飞！",
            "黄山市": "五岳归来不看山，黄山归来不看岳",
            "安庆市": "黄梅戏乡，万里长江此封喉",
            "其他": "一生痴绝处，无梦到徽州"
        },
        "福建省": {
            "福州市": "七溜八溜，不离福州",
            "厦门市": "城在海上，海在城中，文艺圣地",
            "泉州市": "半城烟火半城仙，诸神人间办事处",
            "武夷山": "大红袍的故乡，丹霞地貌",
            "其他": "爱拼才会赢，来杯功夫茶？"
        },
        "江西省": {
            "南昌市": "落霞与孤鹜齐飞，拌粉瓦罐汤绝配",
            "景德镇市": "天青色等烟雨，而我在等你",
            "赣州市": "客家摇篮，红色故都",
            "九江市": "庐山真面目，只缘身在此山中",
            "其他": "物华天宝，人杰地灵"
        },
        "山东省": {
            "济南市": "四面荷花三面柳，一城山色半城湖",
            "青岛市": "红瓦绿树，碧海蓝天，哈啤酒吃嘎啦",
            "烟台市": "人间仙境，苹果真甜",
            "威海市": "走遍四海，还是威海",
            "淄博市": "进淄赶烤，好客山东！",
            "泰安市": "登泰山，小天下",
            "曲阜": "孔子故里，儒家文化",
            "其他": "孔孟之乡，礼仪之邦"
        },
        "河南省": {
            "郑州市": "天地之中，功夫郑州",
            "洛阳市": "若问古今兴废事，请君只看洛阳城",
            "开封市": "一城宋韵，半城水，梦回千年",
            "南阳市": "臣本布衣，躬耕于南阳",
            "信阳市": "江南北国，北国江南，毛尖茶香",
            "安阳市": "一片甲骨惊天下",
            "其他": "中原大地，老家河南，整碗烩面中不中？"
        },
        "湖北省": {
            "武汉市": "热干面配蛋酒，过早文化博大精深",
            "宜昌市": "高峡出平湖，当惊世界殊",
            "襄阳市": "铁打的襄阳，侠义之城",
            "恩施": "仙居恩施，世外桃源",
            "其他": "天上九头鸟，地下湖北佬"
        },
        "湖南省": {
            "长沙市": "茶颜悦色喝到了吗？臭豆腐吃了吗？",
            "张家界市": "缩小的仙境，放大的盆景",
            "岳阳市": "洞庭天下水，岳阳天下楼",
            "凤凰": "边城故事，吊脚楼旁",
            "其他": "吃得苦，耐得烦，霸得蛮"
        },
        "广东省": {
            "广州市": "饮佐茶未？食在广州，味在西关",
            "深圳市": "来了就是深圳人，搞钱要紧！",
            "珠海市": "百岛之市，浪漫随行",
            "佛山市": "黄飞鸿的故乡，功夫美食皆一流",
            "东莞市": "世界工厂，潮流之都",
            "汕头市": "海滨邹鲁，美食孤岛",
            "湛江市": "中国海鲜美食之都",
            "其他": "靓仔/靓女，来玩呀！"
        },
        "广西壮族自治区": {
            "南宁市": "老友粉不仅是味道，更是情怀",
            "桂林市": "桂林山水甲天下，阳朔山水甲桂林",
            "柳州市": "闻着臭吃着香，螺蛳粉yyds！",
            "北海市": "去银滩踩沙，去涠洲岛看海",
            "其他": "唱山歌，这边唱来那边和"
        },
        "海南省": {
            "海口市": "骑楼老街，椰风海韵",
            "三亚市": "天涯海角，东方夏威夷",
            "文昌市": "看火箭升空，吃文昌鸡",
            "其他": "在椰树下躺平，听海浪的声音"
        },
        "四川省": {
            "成都市": "和我在成都的街头走一走，看大熊猫",
            "绵阳市": "富乐之乡，科技之城",
            "乐山市": "食在四川，味在乐山，看大佛",
            "阿坝": "九寨归来不看水",
            "宜宾市": "万里长江第一城，五粮液故乡",
            "其他": "巴适得板，安逸得惨"
        },
        "贵州省": {
            "贵阳市": "爽爽的贵阳，避暑天堂",
            "遵义市": "转折之城，红色圣地",
            "六盘水市": "中国凉都，19度的夏天",
            "其他": "天无三日晴，地无三里平，但风景绝美"
        },
        "云南省": {
            "昆明市": "天气常如二三月，花枝不断四时春",
            "大理": "上关花，下关风，苍山雪，洱海月",
            "丽江市": "去有风的地方，发发呆",
            "西双版纳": "热带雨林，孔雀之乡",
            "香格里拉": "心中的日月，人间的天堂",
            "其他": "彩云之南，心之所向"
        },
        "西藏自治区": {
            "拉萨市": "日光城，布达拉宫的信仰",
            "林芝市": "西藏江南，桃花盛开",
            "日喀则市": "珠峰的故乡",
            "其他": "离天堂最近的地方"
        },
        "陕西省": {
            "西安市": "吹过的风都是文化，踩下的土都是历史",
            "宝鸡市": "炎帝故里，青铜器之乡",
            "延安市": "几回回梦里回延安",
            "咸阳市": "秦砖汉瓦，帝王陵寝",
            "榆林市": "塞上驼城，能源之都",
            "其他": "三秦大地，肉夹馍凉皮来一套"
        },
        "甘肃省": {
            "兰州市": "一碗牛肉面，一条母亲河，一本读者",
            "天水市": "羲皇故里，麦积烟雨，吃呱呱了吗？",
            "嘉峪关市": "天下第一雄关，大漠孤烟直",
            "酒泉市": "敦者大也，煌者盛也，一眼千年看莫高",
            "张掖市": "七彩丹霞，上帝的调色盘",
            "其他": "羌笛何须怨杨柳，春风不度玉门关"
        },
        "青海省": {
            "西宁市": "中国夏都，清凉一夏",
            "格尔木市": "昆仑山口，万山之祖",
            "其他": "天空之镜，万湖之源"
        },
        "宁夏回族自治区": {
            "银川市": "塞上江南，神奇宁夏",
            "中卫市": "大漠孤烟直，长河落日圆",
            "其他": "星星的故乡"
        },
        "新疆维吾尔自治区": {
            "乌鲁木齐市": "离海洋最远的城市，瓜果飘香",
            "喀什地区": "不到喀什，不算到新疆",
            "伊犁": "塞外江南，薰衣草花海",
            "吐鲁番": "火焰山下，葡萄沟甜",
            "其他": "此时此刻，你也许在吃烤包子？"
        },
        "台湾": "宝岛风光，夜市美食",
        "其他": "带我去你的城市逛逛吧！"
    },
    "美国": "Make yourself at home.",
    "日本": "こんにちは，樱花开了吗？",
    "韩国": "안녕하세요，炸鸡啤酒安排上？",
    "俄罗斯": "战斗民族，伏特加吨吨吨",
    "英国": "天气不错，来杯下午茶？",
    "法国": "Bonjour，浪漫的国度",
    "德国": "严谨与啤酒的碰撞",
    "澳大利亚": "小心袋鼠拳击手！",
    "加拿大": "枫叶之国，冰雪奇缘",
    "新加坡": "花园城市，海南鸡饭",
    "泰国": "萨瓦迪卡，冬阴功汤",
    "其他": "世界那么大，欢迎你来看！"
};

const IP_CACHE_KEY = 'ip_info_cache_v2';

const getIpInfoFromCache = () => {
    try {
        const cached = localStorage.getItem(IP_CACHE_KEY);
        if (!cached) return null;
        
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp > IP_CONFIG.CACHE_DURATION) {
            localStorage.removeItem(IP_CACHE_KEY);
            return null;
        }
        return data;
    } catch (e) {
        return null;
    }
};

const setIpInfoCache = (data) => {
    try {
        localStorage.setItem(IP_CACHE_KEY, JSON.stringify({
            data,
            timestamp: Date.now()
        }));
    } catch (e) {
        console.warn('缓存失败:', e);
    }
};

const checkLocationPermission = () => 
    localStorage.getItem('ip_welcome_permission') === 'granted';

const saveLocationPermission = (permission) => 
    localStorage.setItem('ip_welcome_permission', permission);

const showLoadingSpinner = () => {
    const el = getWelcomeInfoElement();
    if (el) el.innerHTML = '<div class="loading-spinner"></div>';
};

const showLocationPermissionDialog = () => {
    const el = getWelcomeInfoElement();
    if (!el) return;
    
    el.innerHTML = `
        <div class="permission-dialog">
            <div class="error-icon">🔒</div>
            <p>是否允许获取位置信息以显示欢迎卡片？</p>
            <button id="btn-allow">允许</button>
            <button id="btn-deny">拒绝</button>
        </div>
    `;
    
    document.getElementById('btn-allow')?.addEventListener('click', () => {
        handleLocationPermission('granted');
    });
    document.getElementById('btn-deny')?.addEventListener('click', () => {
        handleLocationPermission('denied');
    });
};

const handleLocationPermission = (permission) => {
    saveLocationPermission(permission);
    if (permission === 'granted') {
        showLoadingSpinner();
        fetchIpInfo();
    } else {
        showErrorMessage('您已拒绝访问位置信息');
    }
};

const showErrorMessage = (message = '抱歉，无法获取信息') => {
    const el = getWelcomeInfoElement();
    if (!el) return;
    
    el.innerHTML = `
        <div class="error-message">
            <div class="error-icon">😕</div>
            <p>${message}</p>
            <p>点击 <span id="retry-button">这里</span> 重试</p>
        </div>
    `;
    
    document.getElementById('retry-button')?.addEventListener('click', () => {
        if (!checkLocationPermission()) {
            showLocationPermissionDialog();
        } else {
            fetchIpInfo();
        }
    });
};

const fetchIpInfo = async () => {
    if (!checkLocationPermission()) {
        showLocationPermissionDialog();
        return;
    }
    
    showLoadingSpinner();
    
    const cachedData = getIpInfoFromCache();
    if (cachedData) {
        showWelcome(cachedData);
        return;
    }
    
    try {
        const data = await fetchIpData();
        setIpInfoCache(data);
        showWelcome(data);
    } catch (error) {
        console.error('获取IP信息失败:', error);
        showErrorMessage(error.message || '网络请求失败');
    }
};

const insertAnnouncementComponent = () => {
    const announcementCards = document.querySelectorAll('.card-widget.card-announcement');
    
    if (!announcementCards.length) return;
    
    if (IP_CONFIG.HOME_PAGE_ONLY && !isHomePage()) {
        announcementCards.forEach(card => {
            const welcomeInfo = card.querySelector('#welcome-info');
            if (welcomeInfo) welcomeInfo.remove();
        });
        return;
    }
    
    const targetCard = announcementCards[0];
    let welcomeInfo = targetCard.querySelector('#welcome-info');
    
    if (!welcomeInfo) {
        welcomeInfo = document.createElement('div');
        welcomeInfo.id = 'welcome-info';
        targetCard.appendChild(welcomeInfo);
    }
    
    fetchIpInfo();
};

const init = () => {
    addStyles();
    insertAnnouncementComponent();
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

document.addEventListener('pjax:complete', () => {
    setTimeout(insertAnnouncementComponent, 100);
});