import * as Tool from 'tool';
import * as Map from 'tool/map';
import Api from '../api';
/**
 * @file 解析违章经纬度
 * @author jingchaoyang
 */
export const analysisLatLng = ({ store, isWz }) => {
  let param = store.state.route.query;
  let longitude = '';
  let latitude = '';
  let isWxProgram = Tool.webApp.isWxProgram();
  // 从违章app第一次进入首页时
  if (param.wza) {
    if (param.wzlng && param.wzlat) {
      longitude = decodeURI(param.wzlng);
      latitude = decodeURI(param.wzlat);
      // 解密经纬度
      store.dispatch('getPostion', {
        encryptedType: 'DES',
        encryptedTextArr: [longitude, latitude]
      }).then((res) => {
        longitude = res[1].result[0];
        latitude = res[1].result[1];
        Tool.setCookie2('yczj_longitude', res[1].result[0]);
        Tool.setCookie2('yczj_latitude', res[1].result[1]);
      });
    }
  } else if (Tool.webApp.checkMainApp()) {
    // 嵌入主软件时获取经纬度
    if (Tool.isBrowser) {
      Api.getAutoLocationToken().then((res) => {
        if (res.returncode === 0) {
          // eslint-disable-next-line
          require('jsBridge');
          window.AHAPP.setAHAPPToken({
            token: res.result.token,
            appid: window.location.host === 'yczj.m.autohome.com.cn' ? '405413756' : '405413756'
          });
          window.jsBridgeV2.nativeLocationV2({
            success: function(result) {
              console.log('定位公共方法success', result);
              var resultLocal = result.result;
              longitude = resultLocal.longitude;
              latitude = resultLocal.latitude;
              Tool.setCookie2('yczj_longitude', longitude);
              Tool.setCookie2('yczj_latitude', latitude);
            },
            fail: function(result) {
              console.log('定位公共方法error', result);
              console.log(JSON.stringify(result));
            }
          });
        } else {
          return Promise.reject(res);
        }
      }).catch((err) => {
        console.log('定位授权异常：', err);
      });
    }
  } else {
    if (!isWz && !isWxProgram) {
      // 获取经纬度成功 采用百度经纬度
      Map.BaiduMap().then((BMap) => {
        let geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function(res) {
          if (this.getStatus() === 0) {
            longitude = res.point.lng;
            latitude = res.point.lat;
            Tool.setCookie2('yczj_longitude', longitude);
            Tool.setCookie2('yczj_latitude', latitude);
          }
        });
      });
    }
  }
  let yclng = param.lng || longitude;
  let yclat = param.lat || latitude;
  return {
    yclng: yclng, // 优先取url的经纬度，取不到自己定位
    yclat: yclat
  };
};
