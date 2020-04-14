// import MD5 from 'blueimp-md5';

export const refreshJsBridge = () => {
  if (isBrowser) {
    // eslint-disable-next-line
    require('../app/jsBridge');
    window.jsBridge.ycTabClick({
      success: function (result) {
        window.location.reload();
      },
      fail: function (result) {
        console.log(JSON.stringify(result));
      }
    });
  }
};

// 主软件 拨打电话
export const autoTel = (tel) => {
  if (isBrowser) {
    window.jsBridgeV2.tel({
      tel: tel,
      success: (result) => {
        console.log(JSON.stringify(result));
      },
      fail: (result) => {
        console.log(JSON.stringify(result));
      }
    });
  }
};
/**
  * 打开原生页面
  */
export const openNativePage = (url) => {
  // eslint-disable-next-line
  require('../app/jsBridge');
  window.jsBridgeV2.openNativePage({
    url: url,
    success: (result) => {
      console.log(JSON.stringify(result));
    },
    fail: (result) => {
      console.log(JSON.stringify(result));
    }
  });
};

 /**
  * 移动终端浏览器版本信息
  */
export const checkMobileVersions = () => {
  let u = navigator.userAgent;
  return { // 移动终端浏览器版本信息
    trident: u.indexOf('Trident') > -1, // IE内核
    presto: u.indexOf('Presto') > -1, // opera内核
    webKit: u.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1, // 火狐内核
    mobile: !!u.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, // android终端或uc浏览器
    iPhone: u.indexOf('iPhone') > -1, // 是否为iPhone或者QQHD浏览器
    iPad: u.indexOf('iPad') > -1, // 是否iPad
    pad: u.indexOf('iPad') > -1 || u.indexOf('pad') > -1,
    webApp: u.indexOf('Safari') === -1 // 是否web应该程序，没有头部与底部
  };
};

// const crypto = require('crypto');
let timer = null;
/**
 * 获取cookie
 * @param {String} 要获取的cookie的name
 * @return {Object} 返回对应cookie的value
 */
export const getCookie = (name) => {
  if (isBrowser) {
    let arr = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)(;|$)'));
    if (arr != null) {
      return decodeURI(arr[2]);
    }
    return null;
  }
};

/**
 * 设置cookie
 * @param {String} name cookie的name
 * @param {String} value cookie的value
 * @param {Number} t cookie的保存时间（小时为单位）
 */
export const setCookie = (name, value, t) => {
  if (isBrowser) {
    if (t) {
      let exp = new Date();
      exp.setTime(exp.getTime() + t * 60 * 60 * 1000);
      document.cookie = name + '=' + encodeURI(value) + ';expires=' + exp.toGMTString() + ';path=/';
    } else {
      document.cookie = name + '=' + encodeURI(value) + ';path=/';
    }
  }
};

export const setCookie2 = (name, value, t) => {
  if (isBrowser) {
    if (t) {
      let exp = new Date();
      exp.setTime(exp.getTime() + t * 60 * 60 * 1000);
      document.cookie = name + '=' + value + ';expires=' + exp.toGMTString();
    } else {
      document.cookie = name + '=' + value + ';path=/';
    }
  }
};

/**
 * 删除cookie
 * @param {String} name cookie的name
 */
export const removeCookie = (name) => {
  if (isBrowser) {
    let exp = new Date();
    exp.setTime(exp.getTime() - 1);
    let cval = getCookie(name);
    if (cval != null) {
      document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString() + ';path=/';
    }
  }
};
export const removeCookie2 = (name) => {
  if (isBrowser) {
    let exp = new Date();
    exp.setTime(exp.getTime() - 1);
    let cval = getCookie(name);
    if (cval != null) {
      document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString() + ';path=/;domain=.autohome.com.cn';
    }
  }
};

/**
 * 判断是否嵌入App
 * @param {String} name cookie的name
 */
export const webApp = {
  // 验证是否是自己登录主App
  // validateSign: function() {
  //   var paramStr = 'app_deviceid' + getCookie('app_deviceid') +
  //   'app_devicename' + getCookie('app_devicename') +
  //   'app_key' + getCookie('app_key') +
  //   'app_platform' + getCookie('app_platform') +
  //   'app_sysver' + getCookie('app_sysver') +
  //   'app_userid' + getCookie('app_userid') +
  //   'app_ver' + getCookie('app_ver');
  //   var appKey = '@7U$aPOE@$'; // AppKey 客户端固定值
  //   var sign = MD5(appKey + paramStr + appKey).toLowerCase();
  //   var appSignName = getCookie('app_sign').toLowerCase();
  //   if (appSignName === sign) {
  //     return true;
  //   }
  //   return false;
  // },
  // 检查是否嵌入主App
  checkMainApp: function() {
    let appKey = '';
    if (isBrowser) {
      appKey = getCookie('app_key');
    } else {
      appKey = process.cookies['app_key'];
    }
    if (appKey && (appKey === 'auto_iphone' || appKey === 'auto_android' || appKey === 'carcomment_ios' || appKey === 'carcomment_android')) {
      // 兼容下汽车点评app 页面中判断环境时 优先判断checkCarcommentApp方法！
      return true;
    }
    return false;
  },
  // 是否在主软环境
  checkAutoHomeApp() {
    let appKey = '';
    if (isBrowser) {
      appKey = getCookie('app_key');
    } else {
      appKey = process.cookies['app_key'];
    }
    if (appKey && (appKey === 'auto_iphone' || appKey === 'auto_android')) {
      // 兼容下汽车点评app 页面中判断环境时 优先判断checkCarcommentApp方法！
      return true;
    }
    return false;
  },
  // 检查是否嵌入汽车点评App
  checkCarcommentApp() {
    let appKey = '';

    if (isBrowser) {
      appKey = getCookie('app_key');
    } else {
      appKey = process.cookies['app_key'];
    }

    if (appKey && (appKey === 'carcomment_ios' || appKey === 'carcomment_android')) {
      return true;
    }

    return false;
  },
  // 检查IOS APP环境
  checkIosApp() {
    let appKey = '';
    if (isBrowser) {
      appKey = getCookie('app_key');
    } else {
      appKey = process.cookies['app_key'];
    }
    if (appKey && (appKey === 'auto_iphone' || appKey === 'carcomment_ios')) {
      return true;
    }
    return false;
  },
  checkBrowserAuto() {
    this.setShareSource();
    let appKey = '';

    if (isBrowser) {
      appKey = getCookie('shareSource');
    }

    if (appKey && (appKey === 'auto' || appKey === 'dealerapp')) {
      return true;
    } else {
      removeCookie2('shareSource');
      return false;
    }
  },
  setShareSource() {
    let shareSource = '';

    if (isBrowser) {
      shareSource = getUrlParam('shareSource');
    } else {
      const URL = require('url');
      const URLQUERY = URL.parse(process.url, true).query;
      shareSource = URLQUERY.shareSource;
    }

    if (shareSource === 'auto') {
      // 主软分享落地页
      setCookie2('shareSource', 'auto');
    } else if (shareSource === 'dealerapp') {
      // 商家APP 车店通
      setCookie2('shareSource', 'dealerapp');
    } else {
      removeCookie2('shareSource');
    }
  },
  //  判断是否嵌入二手车app
  checkSecondCarApp: function() {
    const secCarApp = getCookie('selectGeo');
    if (secCarApp) {
      return true;
    }
    return false;
  },
  // 是否嵌入违章app
  checkViolatApp: function() {
    let appKey = '';
    if (isBrowser) {
      appKey = getCookie('app_key');
    } else {
      appKey = process.cookies['app_key'];
    }
    // no-mixed-operators
    if (appKey && (appKey === 'wz_ios' || appKey === 'wz_android') || getCookie('iswz')) { // no-mixed-operators
      return true;
    }
    return false;
  },
  // 是否嵌入app
  isApp: function() {
    return this.checkMainApp() || this.checkSecondCarApp() || this.checkViolatApp();
  },
  // 是否嵌入微信小程序
  isWxProgram() {
    if (isBrowser) {
      let UA = window.navigator.userAgent.toLowerCase();
      if (UA.match(/miniProgram/i) && UA.match(/miniProgram/i)[0] === 'miniprogram' || window.__wxjs_environment === 'miniprogram') {
        return true;
      } else {
        return false;
      }
    }
  },
  // 是否是故障通微信小程序
  isBreakDownWxProgram() {
    console.log(getCookie('isFaultMini'));
    console.log(Boolean(getCookie('isFaultMini')));
    console.log(this.isWxProgram());
    return this.isWxProgram() && Boolean(getCookie('isFaultMini'));
  },
  // 前端校验是否已经登录主软件
  checkMainSign: function() {
    let appUserid = getCookie('app_userid');
    if (appUserid && Number(appUserid) !== 0) {
      return true;
    }
    return false;
  },
  // 跟新主软件 cookie
  setAppcookie: function() {
    if (this.checkMainApp()) {
      let appUserid = getCookie('app_userid');
      if (appUserid !== undefined && appUserid !== null && appUserid !== '0' && appUserid !== '') {
        setCookie('yczj_userid', appUserid);
      } else {
        setCookie('yczj_userid', 0);
      }
    }
  }
};

/**
 * 获取地理位置（经纬度）
 * @param {Object} fn 回调函数
 */
export const geolocation = (fn) => {
  let locationSuccess = function(position) {
    fn({
      result: 1,
      position: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }
    });
  };

  let locationError = function(error) {
    fn({
      result: 0,
      error: error
    });
  };
  if (window.navigator.geolocation) {
    window.navigator.geolocation.getCurrentPosition(locationSuccess, locationError, {
      //  指定获取地理位置的超时时间，默认不限时，单位为毫秒
      timeout: 5000,
      //  最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置。
      maximumAge: 0
    });
  } else {
    fn({
      result: 0,
      error: '浏览器不支持'
    });
  }
};

/**
 * 获取服务器时间
 * @return {Object} 返回毫秒数
 */
export const getSevertime = () => {
	// eslint-disable-next-line
  var xmlHttp = new XMLHttpRequest();
  if (!xmlHttp) {
    // eslint-disable-next-line
    xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
  }
  xmlHttp.open('HEAD', '/explosion/expand/OwnersDay/ashx/GetDate.ashx?t=' + Math.random() * 1, false);
  xmlHttp.send();
  var severtime = new Date(xmlHttp.getResponseHeader('Date'));
  return severtime;
};

/**
 * 小于10的数字前加零
 * @param {Number} num 数字
 * @return {Number} 返回数字
 */
export const setNum = (num) => {
  return num < 10 ? '0' + num : '' + num;
};

/**
 * 倒计时
 * @param {Object} o json对象
 * @param {Object} o.hour 获取到元素, 用于显示小时
 * @param {Object} o.mini 获取到元素, 用于显示分钟
 * @param {Object} o.sec 获取到元素, 用于显示秒
 * @param {Number} newTime 倒计时的时间（毫秒）
 * @param {Function} fn 倒计时执行结束，执行的回调函数
 * @return {Number} 返回数字
 */

// 示例
// hourCountDown({
//   sec: document.querySelector('.sec'),
//   mini: document.querySelector('.mini'),
//   hour: document.querySelector('.hour')
// }, 100000);

export const hourCountDown = (o, newTime, fn) => {
  const f = {
    // 获取服务器时间
    getSevertime: function() {
      // eslint-disable-next-line
      var xmlHttp = new XMLHttpRequest();
      if (!xmlHttp) {
        // eslint-disable-next-line
        xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
      }
      xmlHttp.open('HEAD', '/explosion/expand/OwnersDay/ashx/GetDate.ashx?t=' + Math.random() * 1, false);
      xmlHttp.send();
      var severtime = new Date(xmlHttp.getResponseHeader('Date'));
      return severtime;
    },
    dv: function() {
      var down = newTime || Date.UTC(2050, 0, 1); // 如果未定义时间，则我们设定倒计时日期是2050年1月1日
      var now = f.getSevertime();

      // 现在将来秒差值
      var dur = Math.round((down - now.getTime()) / 1000);
      var pms = {
        sec: '00',
        mini: '00',
        hour: '00'
      };

      if (dur > 0) {
        pms.sec = setNum(dur % 60);
        pms.mini = Math.floor((dur / 60)) > 0 ? setNum(Math.floor((dur / 60)) % 60) : '00';
        pms.hour = Math.floor((dur / 3600)) > 0 ? setNum(Math.floor(dur / 3600)) : '00';
      } else {
        // 活动结束
        pms.end = true;
      }
      return pms;
    },
    ui: function() {
      var time = f.dv();
      if (o.sec) {
        o.sec.innerHTML = time.sec;
      }

      if (o.mini) {
        o.mini.innerHTML = time.mini;
      }

      if (o.hour) {
        o.hour.innerHTML = time.hour;
      }

      if (o.day) {
        o.day.innerHTML = time.day;
      }

      if (o.month) {
        o.month.innerHTML = time.month;
      }

      if (o.year) {
        o.year.innerHTML = time.year;
      }

      clearTimeout(timer);
      timer = setTimeout(function() {
        f.ui();
        // 活动结束
        if (time.end) {
          clearTimeout(timer);
          fn(timer);
        }
      }, 1000);
    }
  };
  f.ui();
};

/**
 * 设置title
 * @param {String} title title名称
 */
export const setTitle = (title) => {
  document.title = title;
  const mobile = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(mobile)) {
    var iframe = document.createElement('iframe');
    iframe.style.visibility = 'hidden';
    // 替换成站标favicon路径或者任意存在的较小的图片即可
    iframe.setAttribute('src', '//x.autoimg.cn/cfw/yc/images/favicon.ico');
    const iframeCallback = function () {
      setTimeout(function () {
        iframe.removeEventListener('load', iframeCallback);
        document.body.removeChild(iframe);
      }, 0);
    };
    iframe.addEventListener('load', iframeCallback);
    document.body.appendChild(iframe);

    // eslint-disable-next-line
    require('../app/jsBridge');
    window.jsBridgeV2.actionbarinfoTitle({
      title: title,
      addmenulist: [],
      stablemenulist: [],
      success: (res) => {
        console.log(res, '动态设置title---success');
      },
      fail: (res) => {
        console.log(res, '动态设置title---fial');
      }
    });
  }
};

/**
 * 判断当前是否在浏览器中
 * @return {Bollean}
 */
export const isBrowser = typeof window !== 'undefined';

/**
 * 判断移动端浏览器是否支持本地存储（localStorage/sessionStorage）
 * @return {Bollean}
 */
export const isLocalStorageSupported = () => {
  const testKey = 'testKey';
  const storage = window.localStorage;

  try {
    storage.setItem(testKey, 'testValue');
    storage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
};
/**
 *  判断是否为空对象
 *
 */
export const isEmptyObj = (obj) => {
  for (let name in obj) {
    return false;
  }
  return true;
};
/**
 * 车型车系 本地存储
 *
 */
export const carStorage = (params) => {
  if (isLocalStorageSupported()) {
    // 本地存储
    window.localStorage.setItem('brandname', params.brandname);
    window.localStorage.setItem('brandid', params.brandid);
    window.localStorage.setItem('seriesname', params.seriesname);
    window.localStorage.setItem('seriesid', params.seriesid);
    window.localStorage.setItem('specname', params.specname);
    window.localStorage.setItem('specid', params.specid);
  } else {
    setCookie('brandname', params.brandname);
    setCookie('brandid', params.brandid);
    setCookie('seriesname', params.seriesname);
    setCookie('seriesid', params.seriesid);
    setCookie('specname', params.specname);
    setCookie('specid', params.specid);
  }
};

/**
 * 正则校验手机号
 *
 */
export const checkMobilePhone = (mobilePhone) => {
  if (/^[1][34578][0-9]{9}$/.test(mobilePhone)) {
    return true;
  }
  return false;
};

/**
 * 检测是否手机是否安装 app
 * 安装 app 跳转  没有安装 toast 提示
 */
export const checkIsHasApp = ({ destLat, destLng, destAddres }) => {
  // 如果不是在App中内嵌
  // 如果在Safari浏览器中
  let versions = checkMobileVersions();
  const UA = window.navigator.userAgent.toLowerCase();
  var millisec = 0; // 等待延时时间
  if (versions.iPhone || versions.webApp) {
    millisec = 5000;
  } else if (versions.android) {
    millisec = 5000;
  }
  // 创建一个隐藏的iframe
  let iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  if (versions.android) {
    iframe.src = `bdapp://map/direction?destination=latlng:${destLat},${destLng}|name:${destAddres}&mode=driving&region=北京&output=html`;
  } else {
    window.location.href = `baidumap://map/direction?destination=latlng:${destLat},${destLng}|name:${destAddres}&mode=driving&region=北京&output=html`;
  }
  document.body.appendChild(iframe);
  let openTime = Date.now(); // 记录唤醒时间
  let longitudeUser = getCookie('yczj_longitude');
  let latitudeUser = getCookie('yczj_latitude');
  if (UA.match(/MicroMessenger/i) && UA.match(/MicroMessenger/i)[0] === 'micromessenger') {
    if (longitudeUser && latitudeUser) {
      window.location.href = `https://apis.map.qq.com/uri/v1/routeplan?type=drive&fromcoord=${latitudeUser},${longitudeUser}&to=${destAddres}&tocoord=${destLat},${destLng}&referer=myapp`;
    }
  } else {
    window.setTimeout(function() {
      document.body.removeChild(iframe);
      // 如果setTimeout 回调超过2500ms，则跳下载页
      if (Date.now() - openTime < (millisec + 400)) {
        // http://api.map.baidu.com/lbsapi/getpoint/index.html
        // 116.326613,39.85032
        if (longitudeUser && latitudeUser) {
          window.location.href = 'https://api.map.baidu.com/direction?origin=latlng:' + latitudeUser + ',' + longitudeUser + '|name:我家&destination=latlng:' + destLat + ',' + destLng + '|name:' + destAddres + '&mode=driving&region=北京&output=html&src=yourCompanyName|yourAppName';
        }
      }
    }, millisec);
  }
};

/**
 * 本地存储点评用户选择的车品牌车系
 */
export const setRemarkUserBrandStorage = (param) => {
  if (isLocalStorageSupported()) {
    // 本地存储
    window.localStorage.setItem('remark_selectedcar_data', param);
  } else {
    setCookie('remark_selectedcar_data', param);
  }
};

/*
* 删除 url 指定参数
 */
export const delQueStr = (url, ref) => {
  let str = '';
  if (url.indexOf('?') !== -1) {
    str = url.substr(url.indexOf('?') + 1);
  } else {
    return url;
  }
  let arr = '';
  let returnurl = '';
  if (str.indexOf('&') !== -1) {
    arr = str.split('&');
    for (let i in arr) {
      if (arr[i].split('=')[0] !== ref) {
        returnurl = returnurl + arr[i].split('=')[0] + '=' + arr[i].split('=')[1] + '&';
      }
    }
    return url.substr(0, url.indexOf('?')) + '?' + returnurl.substr(0, returnurl.length - 1);
  } else {
    arr = str.split('=');
    if (arr[0] === ref) {
      return url.substr(0, url.indexOf('?'));
    } else {
      return url;
    }
  }
};

/*
* 获取url参数
 */
export const getUrlParam = (name) => {
  let str = '';
  let url = window.location.href;
  if (url.indexOf('?') !== -1) {
    str = url.substr(url.indexOf('?'));
  } else {
    return null;
  }
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
  let r = str.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
};

export const getUrlParamQuery = (str) => {
  var paramObj = {};
  var url = str || window.location.href;
  var paramstr = url.split('?');
  if (paramstr.length > 1) {
    var params = paramstr[1].split('&');
    for (var i = 0; i < params.length; i++) {
      var param = params[i].split('=');
      paramObj[param[0]] = decodeURIComponent(param[1]);
    }
  }
  return paramObj;
};

/**
 * 获取商家版APP域名地址
 */
export const getDealerAppHostUrl = () => {
  const currentHost = window.location.host;
  let _URL = '';

  if (currentHost.slice(0, 4) === 'test') {
    // 准生产环境
    _URL = 'http://test.dealerapp.m.autohome.com.cn';
  } else if (currentHost.slice(0, 4) === 'yczj') {
    // 正式环境
    _URL = 'https://dealerapp.m.autohome.com.cn';
  }

  return _URL;
};

/**
 * 元素是否在可视区内
 */
export const isElementInViewport = (el) => {
  let rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};
// 平滑滚动
export const scrollSmoothTo = (element, direction, scrollTo, time) => {
  const scrollFrom = parseInt(element[direction], 10);
  let i = 0;
  const runEvery = 5; // run every 5ms
  const scrollTo1 = parseInt(scrollTo, 10);
  const element1 = element;
  let time1 = time;
  time1 /= runEvery;
  const interval = setInterval(() => {
    i += 1;
    element1[direction] = ((scrollTo1 - scrollFrom) / time1) * i + scrollFrom;
    if (i >= time1) {
      clearInterval(interval);
    }
  }, runEvery);
};

// 本地&测试环境
export const isLocalEnv = () => {
  return window.location.host.slice(0, 6) === 't.yczj';
};
// 准生产环境
export const isTestBetaEnv = () => {
  return window.location.host.slice(0, 4) === 'test';
};
// 线上环境
export const isProductionEnv = () => {
  return window.location.host.slice(0, 4) === 'yczj';
};
/**
 * 减法运算
 */
export const subStr = (arg1, arg2) => {
  var r1, r2, m, n;
  r1 = arg1 && arg1.toString().split('.')[1] && arg1.toString().split('.')[1].length ? arg1.toString().split('.')[1].length : 0;
  r2 = arg2 && arg2.toString().split('.')[1] && arg2.toString().split('.')[1].length ? arg2.toString().split('.')[1].length : 0;

  m = Math.pow(10, Math.max(r1, r2));
  n = (r1 >= r2) ? r1 : r2;
  return ((arg1 * m - arg2 * m) / m).toFixed(n);
};
/**
 * 文档高度
 */
export const getDocumentTop = () => {
  let scrollTop = 0;
  let bodyScrollTop = 0;
  let documentScrollTop = 0;

  if (document.body) {
    bodyScrollTop = document.body.scrollTop;
  }
  if (document.documentElement) {
    documentScrollTop = document.documentElement.scrollTop;
  }

  scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;

  return scrollTop;
};

/**
 * 可视窗口高度
 */
export const getWindowHeight = () => {
  let windowHeight = 0;

  if (document.compatMode === 'CSS1Compat') {
    windowHeight = document.documentElement.clientHeight;
  } else {
    windowHeight = document.body.clientHeight;
  }

  return windowHeight;
};

/**
 * 滚动条滚动高度
 */
export const getScrollHeight = () => {
  let scrollHeight = 0;
  let bodyScrollHeight = 0;
  let documentScrollHeight = 0;

  if (document.body) {
    bodyScrollHeight = document.body.scrollHeight;
  }
  if (document.documentElement) {
    documentScrollHeight = document.documentElement.scrollHeight;
  }

  scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;

  return scrollHeight;
};

/*
* 时间格式化
* @param 时间戳
* @return 根据发布时间判断：几秒前(小于1分)；10小时前（小于一天）；3月29日 15：21（当年）；2018年3月29日（当年以前）
**/
export const formatTimeByReleaseTime = (timeStamp) => {
  timeStamp = Number(timeStamp);
  let nowTime = new Date();
  let curTimestamp = nowTime.getTime();
  let dif = (curTimestamp - timeStamp) / 1000;

  let nowYear = nowTime.getFullYear();

  let valYear = new Date(timeStamp).getFullYear();
  let valMonth = new Date(timeStamp).getMonth() + 1;
  let valDate = new Date(timeStamp).getDate();
  let valHour = new Date(timeStamp).getHours() < 10 ? '0' + new Date(timeStamp).getHours() : new Date(timeStamp).getHours();
  let valMinute = new Date(timeStamp).getMinutes() < 10 ? '0' + new Date(timeStamp).getMinutes() : new Date(timeStamp).getMinutes();
  if (dif < 60) {
    return '几秒前';
  } else if (dif < 60 * 60) {
    return `${parseInt((dif) / 60)}分钟前`;
  } else if (dif < 60 * 60 * 24) {
    return `${parseInt(dif / 3600)}小时前`;
  } else if (dif >= 60 * 60 && valYear === nowYear) {
    return `${valMonth}月${valDate}日 ${valHour}:${valMinute}`;
  } else if (dif >= 60 * 60 && valYear < nowYear) {
    return `${valYear}年${valMonth}月${valDate}日`;
  }
};
