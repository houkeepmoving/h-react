import * as Tool from 'tool';
import MD5 from 'blueimp-md5';

/**
 * @file 涉及订单接口 加密方式
 * 规则： // param_sign:md5(md5(usertoken+userid+"param_sign"+timestamp(当前时间戳)))
 *       // param_timestamp:当前时间戳
 *       // 盐值：*sUHaYMuwAWZ?UYImJG!78R%^IIgh?^DU&oPUIS
 * @author jingzhaoyang
 */
export const setSigns = (params) => {
  let timestamp = new Date().getTime();
  let _sign = '*sUHaYMuwAWZ?UYImJG!78R%^IIgh?^DU&oPUIS';
  let yczjData = '';
  let wzUserToken = '';
  let wzUserId = '';

  if (Tool.isBrowser) {
    let isWz = Tool.webApp.checkViolatApp() || Tool.getCookie('iswz');

    if (isWz) {
      yczjData = Tool.getCookie('lg_data') && JSON.parse(decodeURIComponent(Tool.getCookie('lg_data')));
    } else {
      if (Tool.getCookie('yczj_login_data')) {
        yczjData = JSON.parse(decodeURIComponent(decodeURIComponent(Tool.getCookie('yczj_login_data'))));
      }
    }
  } else {
    // 在服务端获取cookie
    const cookieObj = process.cookies || {};

    if (cookieObj['lg_data'] || cookieObj['app_key'] === 'wz_ios' || cookieObj['app_key'] === 'wz_android') {
      yczjData = JSON.parse(cookieObj['lg_data']);
    } else {
      if (cookieObj['yczj_login_data']) {
        yczjData = JSON.parse(decodeURIComponent(cookieObj['yczj_login_data']));
      }
    }
  }

  wzUserId = yczjData.userid || '';
  wzUserToken = yczjData.usertoken || '';
  let orderSign = MD5(MD5(wzUserToken + wzUserId + _sign + timestamp));

  if (params && params.obj) {
    if (params.isOrder) {
      // 设置参数
      params.obj['param_timestamp'] = timestamp;
      params.obj['param_sign'] = orderSign;
    }
    params.obj['wzUserId'] = wzUserId;
    params.obj['wzUserToken'] = wzUserToken;
  } else {
    return {
      orderSign: orderSign,
      timestamp: timestamp,
      wzUserId: wzUserId,
      wzUserToken: wzUserToken
    };
  }
};
