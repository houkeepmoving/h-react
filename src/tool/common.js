import * as Tool from 'tool';

let isWz = Tool.webApp.checkViolatApp() || Tool.getCookie('iswz');
let dprnVersion = (Tool.getCookie('dprnversion') || '').replace(/\./g, '');
let isAutoApp = Tool.webApp.checkMainApp();

// 页面跳转
export const pageJumpHandel = (path = '', queryParams = {}, browser = 'wk') => { // path:页面路由地址 queryParams：跳转传递query参数
  let currentHost = `${window.location.protocol}//${window.location.host}${window.location.pathname}#/`; // 当前域名
  let query = '';
  Object.keys(queryParams).forEach((key, index) => {
    query += `${index ? '&' : ''}${key}=${queryParams[key]}`;
  });
  let linkUrl = path.includes('http') ? path : `${currentHost}${path}?${query}`;
  let OPEN_LINK_URL = encodeURIComponent(linkUrl);
  if (Tool.webApp.checkMainApp()) { // 端内
    if (Tool.webApp.checkCarcommentApp()) { // 汽车点评
      Tool.openNativePage(`autohome://insidebrowser${browser}?url=${OPEN_LINK_URL}`);
    } else { // 主软环境
      window.location.href = `autohome://insidebrowser${browser}?url=${OPEN_LINK_URL}`;
    }
  } else if (isWz) { // 违章app
    setTimeout(() => {
      window.location.href = `wzsdk://wzarticle?url=${OPEN_LINK_URL}`;
    }, 30);
  } else { // M
    window.location.href = linkUrl;
  }
  // window.location.href = linkUrl;

};

// pv show 统计
export const trackCustomPageInit = (cate = {}, customVars = {}) => {
  // eslint-disable-next-line
  pvTrack.site = cate.site_id;
  // eslint-disable-next-line
  pvTrack.category = cate.category_id;
  // eslint-disable-next-line
  pvTrack.subcategory = cate.sub_category_id;
  // eslint-disable-next-line
  pvTrack.pageVars = customVars;
  // eslint-disable-next-line
  window._yc_ahas.push(['_trackPageInit']);
  // eslint-disable-next-line
  trackCustomEvent('yc_dynamic_page_show', {
    'bus': '1',
    'page': cate.pageId ? cate.pageId : cate.site_id + '-' + cate.category_id + '-' + cate.sub_category_id,
    'refpage': cate.refpage || '',
    'channel': cate.channel || '0',
    'city': cate.cityId || 110100
  }, customVars);
};

// 操作登录信息
export const handleLogin = (params = {}) => {
  console.log(window.location.href, '登录当前url');
  let { backUrl, successCb = '', failCb = '' } = params;
  if (Tool.webApp.checkViolatApp() || Tool.getCookie('iswz')) { // 违章
    window.location.href = 'wzsdk://login';
    window.appCallBack = (appParams) => {
      if (appParams.code === 0) {
        successCb && successCb(appParams);
      }
    };
  } else if (Tool.webApp.checkMainApp()) { // 点评和主软
    require('jsBridge');  // eslint-disable-next-line
    window.jsBridge.openLogin({
      success: (result) => {
        if (result.returncode.toString() === '0') {
          successCb && successCb(result);
        }
        console.log(JSON.stringify(result)); // eslint-disable-line
      },
      fail: (result) => {
        failCb && failCb(result);
        console.log(JSON.stringify(result)); // eslint-disable-line
      }
    });
  } else { // M站
    window.location.href = `http://account.m.autohome.com.cn/?backurl=${backUrl}`;
  }
};

export const wxProgramLogin = () => {
   // 获取当前url
  let locationUrl = encodeURIComponent(window.location.href);
   // 小程序登录
   wx.miniProgram.redirectTo({ url: `/pages/login/login?url=${locationUrl}` }); // eslint-disable-line
};

// 弹窗时候锁定页面
export const ModalHelper = (function(bodyCls) {
  let scrollTop;
  return {
    afterOpen: function() {
      scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      document.body.classList.add(bodyCls);
      document.body.style.top = -scrollTop + 'px';
      // 锁定
      // document.documentElement.style.overflow = 'hidden';
      // document.body.style.overflow = 'hidden';
    },
    beforeClose: function() {
      document.body.classList.remove(bodyCls);
      document.body.scrollTop = scrollTop;
      document.documentElement.scrollTop = scrollTop;
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }
  };
})('modal-open');

// 首页 list && 商家详情 跳转排行榜
export const linkToDealerRankList = (that, rankFlag) => {
  // 判断code码是区域码还是城市码
  let linkUrl = '';
  let currentHost = `${window.location.protocol}//${window.location.host}`; // 当前域名
  if (rankFlag.area % 100 === 0 && rankFlag.area % 1000 !== 0) { // cityCode后两位为0
    linkUrl = `${currentHost}/remark/dealerranklist?brand=${rankFlag.brand}&areaId=&cityId=${rankFlag.area}&category=${rankFlag.category}&source=${rankFlag.source}`;
  } else {
    linkUrl = `${currentHost}/remark/dealerranklist?brand=${rankFlag.brand}&areaId=${rankFlag.area}&cityId=&category=${rankFlag.category}&source=${rankFlag.source}`;
  }
  if (that.isAutoApp) {
    // 主软内
    const OPEN_LINK_URL = encodeURIComponent(linkUrl);
    setTimeout(() => {
      Tool.openNativePage(`autohome://insidebrowser?url=${OPEN_LINK_URL}`);
    }, 10);
  } else if (that.isWz) {
    // 违章内
    const OPEN_LINK_URL = encodeURIComponent(linkUrl);
    setTimeout(() => {
      window.location.href = `wzsdk://wzarticle?url=${OPEN_LINK_URL}`;
    }, 10);
  } else {
    // M站
    if (rankFlag.area % 100 === 0 && rankFlag.area % 1000 !== 0) { // cityCode后两位为0 省份后三位为0
      linkUrl = `/remark/dealerranklist?brand=${rankFlag.brand}&areaId=&cityId=${rankFlag.area}&category=${rankFlag.category}&source=${rankFlag.source}`;
    } else {
      linkUrl = `/remark/dealerranklist?brand=${rankFlag.brand}&areaId=${rankFlag.area}&cityId=&category=${rankFlag.category}&source=${rankFlag.source}`;
    }
    that.$router.push({ path: linkUrl });
  }
};

// 视频播放
export const showVideoPlayer = (that, params) => {
  if (Tool.webApp.checkMainApp()) { // 端内用app端的视频播放器
    if (Tool.webApp.checkCarcommentApp()) { // 点评app
      let dprnVersion = (Tool.getCookie('dprnversion') || '').replace(/\./g, '');
      if (dprnVersion >= 250) { // v2.5.0及以上版本支持播放器
        require('jsBridge');
        window.jsBridgeV2.openNativePageAsyncResult({
          url: `dianpinginside://cfwsmallvideo?videoid=${params.videos[0].videoId}&activityid=&activitytype=&refpage=`,
          requestCode: 1122,
          success: (result) => {
            console.log(JSON.stringify(result));
            if (result.result.requestcode === 1122) {
              // TODO
            }
          },
          fail: (result) => {
            console.log(JSON.stringify(result));
          }
        });
      } else {
        that.props.Toast.$toast('请升级最新客户端观看活动视频～');
      }
    } else { // 主软
      const paramStr = `id=${params.videos[0].videoId}&topicid=&source=31&bsid=11&bsname=QiCheDianPing&loadmodel=4`;
      require('jsBridge');
      window.jsBridgeV2.openNativePageAsyncResult({
        url: `autohome://article/shortvideolist?${paramStr}`,
        requestCode: 1133,
        success: (result) => {
          console.log(JSON.stringify(result));
          if (result.result.requestcode === 1133) {
            // TODO
          }
        },
        fail: (result) => {
          console.log(JSON.stringify(result));
        }
      });
    }
  }
};

export const videoBack = (that) => {
  that.videoShow = false;
  setTimeout(() => {
    that.$refs.videoPlayComponent.pausedVideo();
  }, 10);
};

// 查看大图
export const showGallery = (that, index, originImages) => {
  if (Tool.webApp.checkMainApp()) {
    let autoAppOriginImages = [];
    for (let i = 0, len = originImages.length; i < len; i++) {
      let tmpObj = {
        'url': originImages[i],
        'title': ''
      };
      autoAppOriginImages.push(tmpObj);
    }
    require('jsBridge');
    window.jsBridgeV2.bigimg({
      'currentindex': index + 1,
      'image': autoAppOriginImages,
      success(result) {
        console.log(JSON.stringify(result));
      },
      fail(result) {
        console.log(JSON.stringify(result));
      }
    });
  }
};
// 商家详情 && 商品详情 跳转点评详情
export const handleCommentDetail = (that, data) => {
  let query = that.$route.query;
  let refpageName = query.refpageName;
  let reviewId = data.id;
  let queryParams = {
    ...query,
    refpageName: refpageName,
    reviewId: reviewId
  };

  if (query.shareSource) {
    queryParams.shareSource = query.shareSource;
  }
  if (query.typeSource) {
    queryParams.typeSource = query.typeSource;
  }
  pageJumpHandel('/remark/commentdetail', queryParams);
};

// 商家跳转地图页
export const openMap = (dealerParams) => {
  console.log('开始调用地图页');
  let { latitude, longitude, address } = dealerParams;
  let refpageName = Tool.getUrlParam('refpageName');

  if (isWz) {
    console.log('违章');
    let lgData = Tool.getCookie('lg_data');
    let mapUrl = `wzsdk://map?dlat=${latitude}&dlng=${longitude}&daddress=${address}&refpageName=${refpageName}`;
    if (parseInt(Tool.getCookie('issupportmap')) === 1) {
      // 违章app版本是否支持唤地图， 1 为支持， 非1为不支持
      window.location.href = mapUrl;
    }

    if (lgData && parseInt(JSON.parse(lgData)).issupportmap === 1) {
      // 临时解决 ios 5.0 版本
      window.location.href = mapUrl;
    }
    // window.location.href = `wzsdk://map?dlat=${latitude}&dlng=${longitude}&daddress=${address}`;
  } else if (isAutoApp) {
    // 汽车点评RN环境
    if (dprnVersion >= 200) {
      console.log('点评');
      // RN环境下支持地图导航
      const RN_MAP_VIEW_URL = `rn://DianPing_Main/MapView?name=${encodeURIComponent(dealerParams.name)}&address=${encodeURIComponent(address)}&lat=${latitude}&lng=${longitude}`;

      Tool.openNativePage(`autohome://rninsidebrowser?url=${encodeURIComponent(RN_MAP_VIEW_URL)}`);

      return false;
    }
    console.log('主软');
    // 主软原生环境
    let linkUrl = `https://yczj.m.autohome.com.cn/topic/m/baidumap/index.html?destLng=${longitude}&destLat=${latitude}&refpageName=${refpageName}`;
    let OPEN_LINK_URL = encodeURIComponent(linkUrl);
    setTimeout(() => {
      Tool.openNativePage(`autohome://insidebrowser?url=${OPEN_LINK_URL}`);
    }, 10);
  } else {
    console.log('m端');
    // M
    Tool.checkIsHasApp({
      destLng: longitude,
      destLat: latitude,
      destAddres: address,
      refpageName: refpageName
    });
  }
};
// 将img转成base64
export const img2base64 = (params = {}) => {
  let { imgUrlArr = [], cut = true, canvasWith = 103, canvasHeight = 103, cb = '', failCb = '' } = params;
  if (!imgUrlArr.length) {
    return;
  }
  let imgUrlArrResult = [];
  for (let i = 0; i < imgUrlArr.length; i++) {
    (function(i) {
      // eslint-disable-next-line
      let xhr = new XMLHttpRequest();
      console.log(xhr, 'xhr');
      let xhrUrl = imgUrlArr[i];
      if (xhrUrl.indexOf('http://') !== -1) {
        // 截取
        xhrUrl = xhrUrl.replace('http://', '//');
      }
      xhr.open('get', xhrUrl, true);
      xhr.responseType = 'blob';
      xhr.onload = function () {
        // eslint-disable-next-line
        let img = new Image();
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        let ratio = getPixelRatio(ctx);
        // 注意此处有个坑， canvas 要进行缩放
        canvas.style.width = canvasWith + 'px';
        canvas.style.height = canvasHeight + 'px';
        canvas.width = canvasWith * ratio;
        canvas.height = canvasHeight * ratio;
        if (xhr.status === 200 || xhr.status === 0) {
          // 这里面可以直接通过URL的api将其转换，然后赋值给img.src
          // eslint-disable-next-line
          let imgurl = URL.createObjectURL(xhr.response);
          img.src = imgurl;
          // 图片加载成功
          img.onload = () => {
            if (cut) {
              // 需要裁剪
              let imgRect = coverImg(canvasWith, canvasHeight, img.width, img.height);
              ctx.drawImage(img, imgRect.sx, imgRect.sy, imgRect.sWidth, imgRect.sHeight, 0, 0, canvasWith, canvasHeight);
            } else {
              // 原图输出
              canvas.width = img.width * ratio;
              canvas.height = img.height * ratio;
              ctx.drawImage(img, 0, 0);
            }
            imgUrlArrResult.push(canvas.toDataURL('image/png', 1));
            // eslint-disable-next-line
            URL.revokeObjectURL(imgurl);
            canvas = null;
            img = null;
            cb && cb(imgUrlArrResult);
          };
          // 图片加载失败
          img.onerror = () => {
            console.log('error358: 图片加载失败');
            failCb && failCb(imgUrlArr[i]);
          };
        } else if (xhr.status === 404) {
          failCb && failCb(imgUrlArr[i]);
        }
      };
      xhr.send();
    })(i);
  }
};

export const getPixelRatio = (context) => {
  let backingStore = context.backingStorePixelRatio ||
  context.webkitBackingStorePixelRatio ||
  context.mozBackingStorePixelRatio ||
  context.msBackingStorePixelRatio ||
  context.oBackingStorePixelRatio ||
  context.backingStorePixelRatio || 1;
  return (window.devicePixelRatio || 1) / backingStore;
};

export const coverImg = (boxW, boxH, sourceW, sourceH) => {
  let sx = 0;
  let sy = 0;
  let sWidth = sourceW;
  let sHeight = sourceH;
  if (sourceW > sourceH || (sourceW === sourceH && boxW < boxH)) {
    sWidth = boxW * sHeight / boxH;
    sx = (sourceW - sWidth) / 2;
  } else if (sourceW < sourceH || (sourceW === sourceH && boxW > boxH)) {
    sHeight = boxH * sWidth / boxW;
    sy = (sourceH - sHeight) / 2;
  }
  return {
    sx,
    sy,
    sWidth,
    sHeight
  };
};
export const containImg = (sx, sy, boxW, boxH, sourceW, sourceH) => {
  let dx = sx;
  let dy = sy;
  let dWidth = boxW;
  let dHeight = boxH;
  if (sourceW > sourceH || (sourceW === sourceH && boxW < boxH)) {
    dHeight = sourceH * dWidth / sourceW;
    dy = sy + (boxH - dHeight) / 2;
  } else if (sourceW < sourceH || (sourceW === sourceH && boxW > boxH)) {
    dWidth = sourceW * dHeight / sourceH;
    dx = sx + (boxW - dWidth) / 2;
  }
  return {
    dx,
    dy,
    dWidth,
    dHeight
  };
};

// 选择车型车系：主软 点评 违章
export const choseCar = (param) => {
  if (Tool.webApp.checkMainApp()) { // 主软和点评
    // 主软选车
    // eslint-disable-next-line
    require('jsBridge');
    window.jsBridge.selectAutoHomeCar({
      success: (result) => {
        // 调用回调吧
        typeof param.success === 'function' && param.success(result);
      },
      fail: (result) => {
        typeof param.fail === 'function' && param.fail(result);
      }
    });
  } else if (Tool.webApp.checkViolatApp()) {
    // 违章
    // choosemodels：选择类型「车系1，车型2」
    window.location.href = 'wzsdk://cars?choosemodels=2&carsource=newcar';

    window.appCallBack = (json) => {
      if (json.code === 0) {
        if (json.extras.type === 14) {
          typeof param.success === 'function' && param.success(json.extras);
        } else {
          typeof param.fail === 'function' && param.fail(json.extras);
        }
      }
    };
  }
};

// 添加爱车
export const addCar = (params = {}) => {
  let url = '';
  let { success = '', fail = '' } = params;
  if (Tool.webApp.checkAutoHomeApp()) {
    let linkUrl = encodeURIComponent('rn://CarService_GarageRN/AddOrUpdateCar?fromsource=14&ishideocr=1');
    url = `autohome://rninsidebrowser?url=${linkUrl}`;
  } else if (Tool.webApp.checkCarcommentApp()) {
    url = 'dianpinginside://wzaddcar';
  } else if (Tool.webApp.checkViolatApp()) {
    // TODO: 违章渠道没有添加呢
  }

  require('jsBridge');
  window.jsBridgeV2.openNativePageAsyncResult({
    url: url,
    requestCode: 10000,
    success: (res) => {
      console.log('添加爱车成功', JSON.stringify(res));
      let data = null;
      if (Tool.checkMobileVersions().ios) { // 苹果
        data = JSON.parse(res.result);
      } else {
        data = res.result.data;
      }
      success && success(data);
    },
    fail: (err) => {
      console.log('添加爱车失败', JSON.stringify(err));
      fail && fail(err);
    }
  });
};


/**
 * 获取汽车点评域名
 */
export const getRemarkHostUrl = () => {
  const currentHost = window.location.host;
  console.log(currentHost);
  // http://yczj.transparent.yz.test.autohome.com.cn/#/dealerList?type=1  
  let _URL = '';
  if (currentHost.slice(20, 24) === 'test') {
    // 准生产环境
    _URL = 'http://test.yczj.m.autohome.com.cn';
  } else if (currentHost.slice(0, 6) === 't.yczj') {
    // 本地环境
    // _URL = 'http://test.yczj.m.autohome.com.cn';
    _URL = 'http://t.yczj.m.autohome.com.cn:3001';
  } else {
    // 正式环境
    _URL = 'https://yczj.m.autohome.com.cn';
  }
  return _URL;
};
