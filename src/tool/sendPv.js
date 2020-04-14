import * as Tool from 'tool';
/**
 * @file  页面发送pv
 * @author jingzhaoyang
 */
export const sendPV = ({ vm, to, from }) => {
  let param = vm.$route.query;
  let channel = ''; // 下载渠道
  let cityId = ''; // 城市id
  let refpage = param.refpage || '0'; // 入口
  let refpageFeed = param.refpage || '0'; // feed 入口
  // feed 入口
  if (param.refpage) {
    Tool.setCookie('refpage', refpage);
    Tool.setCookie('entryname', to.name); // 入口页面名称
    Tool.setCookie('refpageFeed', refpageFeed);
  } else {
    refpage = Tool.getCookie('entryname') || '0'; // 违章内用。
  }
  // 从违章app里进入
  if (param.wza) { // app webview
    channel = param.wzq;
    cityId = param.wzc || Tool.getCookie('app_cityid') || 110100;
    // 渠道参数
    Tool.setCookie('channel', channel);
    // 城市ID
    Tool.setCookie('cityId', cityId);
  } else if (Tool.webApp.checkMainApp()) {
    // 主软件
    if (param.refpage) {
      refpageFeed = param.refpage || Tool.getCookie('refpageFeed') || '0';
      Tool.setCookie('refpageFeed', refpageFeed);
    } else {
      refpageFeed = Tool.getCookie('refpageFeed') || '0';
    }

    cityId = Number(Tool.getCookie('app_cityid')) || 110100;
    // 城市ID
    Tool.setCookie('cityId', cityId);
  } else { // 正常跳页
    if (!Tool.getCookie('refpage')) {
      Tool.setCookie('refpage', from.name || '0');
    }
    if (!Tool.getCookie('refpageFeed')) { // 不存在 种一个
      Tool.setCookie('refpageFeed', param.refpage || '0');
    }
    refpage = param.refpage || from.name || Tool.getCookie('entryname') || vm.refpage;
    Tool.setCookie('refpage', refpage);
  }
  refpageFeed = param.refpage || Tool.getCookie('refpageFeed') || 0;
  channel = vm.channel;
  cityId = vm.cityId;
  vm.routes = {
    to: to.name, // 当前页面名字
    from: from.name // 上一个页面名字
  };
  // 设置违章cookie
  if (param.wza) {
    if (param.wzg) {
      Tool.setCookie('wzg', param.wzg);
    }
    const UA = window.navigator.userAgent.toLowerCase();
    if (UA.match(/MicroMessenger/i) && UA.match(/MicroMessenger/i)[0] !== 'micromessenger') {
      Tool.setCookie('iswz', 1);
    }
    // 设备ID在cookie里不存在时， 从url上获取
    if (!Tool.getCookie('app_deviceid')) {
      const deviceid = param.wzd;
      Tool.setCookie('app_deviceid', deviceid);
    }
  }
  // 设置订单入口 key
  if (param.exl_pvid) {
    let oldExlPvid = Tool.getCookie('exl_pvid');
    if (oldExlPvid !== param.exl_pvid) {
      Tool.setCookie('exl_pvid', param.exl_pvid);
    }
  }
  // 所属活动 key
  if (param.exl_hdid) {
    let oldExlHdid = Tool.getCookie('exl_hdid');
    if (oldExlHdid !== param.exl_pvid) {
      Tool.setCookie('exl_hdid', param.exl_hdid);
    }
  }
  return {
    channel: channel,
    cityId: cityId || 110100,
    refpage: refpage,
    refpageFeed: refpageFeed
  };
};
