/**
 * @file 公用业务函数方法
 */
/**
 * @file share 分享js
 *  store
 *  shareTitle 分享标题
 *  sharUrl 分享链接
 *  shareDesc 分享描述
 *  shareImgUrl 分享小图标
 *  success 成功回调
 *  fail  失败回调
 *  isHandle 是否需要用户点击
 */
import * as Tool from 'tool';
let isCarcommentApp = Tool.webApp.checkCarcommentApp();
let isAutoHomeApp = Tool.webApp.checkAutoHomeApp();
let appVersion = (Tool.getCookie('app_ver') || '').replace(/\./g, '');
export const share = function({ store, params = {}, isHandle = false }) {
  const UA = window.navigator.userAgent.toLowerCase();
  const isAutoApp = Tool.webApp.checkMainApp();
  const isWz = Tool.webApp.checkViolatApp() || Tool.getCookie('iswz');
  let {
    shareTitle = '',
    sharUrl = '',
    shareDesc = '',
    shareImgUrl = '',
    success = '',
    fail = '',
    // binaryimage = '',
    miniProgramUrl = '',
    miniImgUrl = '',
    miniTitle = '',
    objid = 0,
    source = 0
  } = params;
  let shareImgUrlVal = shareImgUrl || `https://x.autoimg.cn/cfw/yc/images/carcomment/carcomment-logo-v2.png`;
  let sharUrlVal = sharUrl || window.location.href;
  let shareTitleApp = encodeURIComponent(shareTitle);
  let shareDescApp = encodeURIComponent(shareDesc);
  let sharUrlApp = '';

  let shareImgUrlValApp = encodeURIComponent(shareImgUrlVal);
  if (UA.match(/MicroMessenger/i) && UA.match(/MicroMessenger/i)[0] === 'micromessenger') {
    const URL = require('url');
    const URLQUERY = URL.parse(window.location.href.split('#')[0], true).query;
    store.dispatch('getWxShareSign', {
      url: window.location.href.split('#')[0]
    }).then((res) => {
      let result = res.result;
      wx.config({ // eslint-disable-line
        debug: false,
        appId: result.appid,
        timestamp: result.timestamp,
        nonceStr: result.nonceStr,
        signature: result.signature,
        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'hideAllNonBaseMenuItem', 'showMenuItems'] //  必填，需要使用的JS接口列表，所有JS接口列表见附录2
      });
      wx.ready(function() { // eslint-disable-line
        wx.hideAllNonBaseMenuItem(); // eslint-disable-line
        // 配置分享
        wx.showMenuItems({ // eslint-disable-line
          menuList: ['menuItem:share:appMessage', 'menuItem:share:timeline'] // 要显示的菜单项，所有menu项见附录3
        });
        // 分享朋友圈
        wx.onMenuShareTimeline({ // eslint-disable-line
          title: decodeURIComponent(decodeURIComponent(shareTitle || URLQUERY.shareTitle || URLQUERY.dealerName)) || '分享标题', //  分享标题
          link: sharUrlVal, //  分享链接
          imgUrl: shareImgUrlVal,
          success: function() {
            typeof success === 'function' && success();
          },
          cancel: function() {
          },
          fail: function() {
            typeof fail === 'function' && fail();
          }
        });
        // 分享给朋友
        wx.onMenuShareAppMessage({ // eslint-disable-line
          title: decodeURIComponent(decodeURIComponent(shareTitle || URLQUERY.shareTitle || URLQUERY.dealerName)) || '分享标题', //  分享标题
          desc: decodeURIComponent(decodeURIComponent(shareDesc || URLQUERY.shareDesc || URLQUERY.dealerAddress)) || '分享描述', //  分享描述
          link: sharUrlVal, //  分享链接
          imgUrl: shareImgUrlVal, //  分享图标
          type: 'link',
          dataUrl: sharUrlVal,
          success: function() {
            typeof success === 'function' && success();
          },
          cancel: function() {
          },
          fail: function() {
            typeof fail === 'function' && fail();
          }
        });
      });
    });
  } else if (isWz && isHandle) {
    if (sharUrlVal.indexOf('?') !== -1) {
      let indexVal = sharUrlVal.indexOf('?');
      sharUrlVal = sharUrlVal.slice(0, indexVal + 1) + 'shareSource=wz&' + sharUrlVal.slice(indexVal + 1);
    } else {
      sharUrlVal = sharUrlVal + '?shareSource=wz';
    }
    sharUrlApp = encodeURIComponent(sharUrlVal);
    window.location.href = `wzsdk://share?sharetitle=${shareTitleApp}&content=${shareDescApp}&shareurl=${sharUrlApp}&icon=${shareImgUrlValApp}&qd=1100`;
    window.appCallBack = (json) => {
      const extras = json.extras;
      if (extras.returncode && extras.returncode === -1) {
        return false;
      }
      if (json.code === 0) {
        // 分享成功
        typeof success === 'function' && success();
      }
    };
  } else if (isAutoApp && isHandle) {
    require('jsBridge');  // eslint-disable-next-line
    if (sharUrlVal.indexOf('?') !== -1) {
      let indexVal = sharUrlVal.indexOf('?');
      sharUrlVal = sharUrlVal.slice(0, indexVal + 1) + 'shareSource=auto&' + sharUrlVal.slice(indexVal + 1);
    } else {
      sharUrlVal = sharUrlVal + '?shareSource=auto';
    }
    let miniOptions = '';
    // 汽车点评 274 以上支持小程序分享  主软 10.2.5 ios 安卓 10.2.2
    if (isCarcommentApp && appVersion >= 274 || (isAutoHomeApp && Tool.checkMobileVersions().android && appVersion >= 1022) || ((isAutoHomeApp && Tool.checkMobileVersions().ios && appVersion >= 1025))) {
      miniOptions = {
        options: {
          wx_mini_program: {
            userName: 'gh_83eeaa9ddbf3',
            path: miniProgramUrl
          }
        }
      };
      if (miniProgramUrl) {
        shareImgUrlVal = miniImgUrl || `http://x.autoimg.cn/cfw/yc/cus/products/src/images/wx_mini_carcomment-logo.png`;
        shareTitle = miniTitle || shareTitle;
      }
    }
    let intentUrlObj = {
      schemeurl: `autohome://insidebrowser?url=${encodeURIComponent(window.location.href)}`,
      type: 25, // 点评业务
      objid: objid,
      title: shareTitle,
      coverimg: shareImgUrlVal,
      jumpurl: window.location.href
    };
    let intentUrlParams = Object.keys(intentUrlObj).map((key) => {
      return `${key}=${encodeURIComponent(intentUrlObj[key])}`;
    }).join('&');
    let intenturl = '';
    let platform = '';
    // 主软同时案例渠道新增分享渠道
    if (Tool.webApp.checkAutoHomeApp() && source === 1) {
      platform = 'weixin&weixincircle&weibo&weibo&qq&qqzone&zhifubao&carfriend';
      intenturl = {
        intenturl: `${intentUrlParams}&` // 注意此处要多追加一个 & 是为了兼容主软的 ios，坑爹呀
      };
    } else {
      platform = 'weixin&weixincircle';
    };
    window.jsBridge.openShare({
      platform: platform,
      url: sharUrlVal,
      title: shareTitle || '分享标题',
      content: shareDesc || '分享摘要',
      imgurl: shareImgUrlVal,
      ...miniOptions,
      ...intenturl,
      success: function(res) {
        console.log('分享成功了111');
        typeof success === 'function' && success();
      },
      fail: function(res) {
        typeof fail === 'function' && fail();
        console.log(JSON.stringify(res, 'fail: 88主软分享'));
      }
    });
  }
};
