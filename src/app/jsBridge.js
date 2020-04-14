/**
 * @file 通用JsBridge配置文件
 */

// eslint-disable-next-line
// import ahappBridge2 from './ahapp-2.0.js';
import * as Tool from '../tool';

function callbackHtml(o, resultJson) {
  if (resultJson.returncode.toString() === '0') {
    o.success(resultJson);
  } else {
    o.fail(resultJson);
  }
}

// jsBridge 1.0
window.jsBridge = {
  // 调用相机、相册选择图片
  chooseImg: (o) => {
    window.AHJavascriptBridge.invoke('chooseimg', {
      'sourcetype': o.sourcetype
    }, function(res) {
      callbackHtml(o, res);
    });
  },
  // 上传图片
  uploadImg: (o) => {
    window.AHJavascriptBridge.invoke('uploadimg', {
      'imgindex': o.imgindex,
      'imgid': o.imgid,
      'source': o.source
    }, function(res) {
      callbackHtml(o, res);
    });
  },
  // h5 关闭当前浏览器
  closeWebView: (o) => {
    window.AHJavascriptBridge.invoke('pop', {}, function(res) {
      callbackHtml(o, res);
    });
  },
  // 上传图片v2
  uploadImgV2: (o) => {
    window.AHJavascriptBridge.invoke('uploadimgv2', {
      'imgid': o.imgid,
      'imgquality': o.imgquality,
      'imgwidth': o.imgwidth,
      'imgheight': o.imgheight
    }, function(res) {
      callbackHtml(o, res);
    });
  },
  // 打开原生登陆
  openLogin: (o) => {
    // 嵌入主软件
    if (Tool.webApp.checkMainApp()) {
      window.AHJavascriptBridge.invoke('login', {}, function(res) {
        callbackHtml(o, res);
      });
    }
  },
  // 违章优惠养车tab点击刷新
  ycTabClick: (o) => {
    window.AHJavascriptBridge.bindMethod('yctabclick', function(args, callback) {
      callbackHtml(o, args);
    });
  },
  // 获取违章客户端登录信息
  getUserInfo: (o) => {
    if (Tool.webApp.checkViolatApp() || Tool.getCookie('iswz')) {
      window.AHJavascriptBridge.invoke('getuserinfo', {}, function(res) {
        callbackHtml(o, res);
      });
    }
  },
  // 主软件 打开原生选车控件
  selectAutoHomeCar: (o) => {
    if (Tool.webApp.checkMainApp()) {
      window.AHJavascriptBridge.invoke('nativepageasyncresult', {
        url: 'autohome://selectcar',
        // 一个页面H5可能有好几个打开原生页按钮，H5传给APP一个数，当APP操作完毕后会将该数返回，让H5区分是哪个按钮启动后返回的。
        requestcode: 10000
      }, function(res) {
        callbackHtml(o, res);
      });
    }
  },
  // 主软 H5分享
  openShare: (o) => {
    if (Tool.webApp.checkMainApp()) {
      window.AHJavascriptBridge.invoke('h5share', {
        'platform': o.platform,
        'url': o.url,
        'title': o.title,
        'content': o.content,
        'imgurl': o.imgurl
      },
      function(res) {
        callbackHtml(o, res);
      });
    }
  },
  // 主软 设置App原生页右上角按钮和页面标题
  setActionBarInfo: (o) => {
    window.AHJavascriptBridge.invoke('actionbarinfo', {
      title: o.title,
      addmenulist: o.addmenulist,
      stablemenulist: o.stablemenulist
    }, (res) => {
      callbackHtml(o, res);
    });
  },
  // 主软 右上角原生分享按钮获取分享信息
  setNativeShareInfo: (o) => {
    window.AHJavascriptBridge.bindMethod('getshareinfo', (args, callback) => {
      callback({
        platform: o.platform,
        url: o.url,
        title: o.title,
        content: o.content,
        imgurl: o.imgurl
      });
    });
  },
  // 主软 右上角原生分享后回调h5
  setNativeShareFinish: (o) => {
    window.AHJavascriptBridge.bindMethod('nativesharefinish', (args, callback) => {
      callbackHtml(o, args);
    });
  },
  // 主软 右上角原生选择城市后回调H5
  setChooseCityFinish: (o) => {
    window.AHJavascriptBridge.bindMethod('choosecityfinish', (args, callback) => {
      callbackHtml(o, args);
    });
  }
};

// jsBridge 2.0
window.jsBridgeV2 = {
  actionbarinfoTitle: (o) => {
    window.AHAPP.invokeNative('actionbarinfo', {
      title: o.title,
      addmenulist: o.addmenulist || [],
      stablemenulist: o.stablemenulist || [],
      success: function(result) {
        typeof o.success === 'function' && o.success(result);
      },
      fail: function(result) {
        typeof o.fail === 'function' && o.fail(result);
      }
    });
  },
  // 设置头部颜色 如果有问题直接电话主软那边儿吧
  // http://wiki.corpautohome.com/pages/viewpage.action?pageId=85073323
  navigationcolorstyle: (o) => {
    window.AHAPP.invokeNative('navigationcolorstyle', {
      titleBgImageUrl: o.titleBgImageUrl || "http://x.autoimg.cn/cfw/yc/cus/products/src/images/trans-title-1.png", // 背景图
      titleImageUrl: o.titleImageUrl || '', // 标题图
      titlecolor: o.titlecolor,
      closeImageStyle: o.closeImageStyle,
      statusBarStyle: o.statusBarStyle,
      success: function(result) {
        console.log(result, '设置title颜色success---');
        typeof o.success === 'function' && o.success(result);
      },
      fail: function(result) {
        console.log(result, '设置title颜色fail---');
        typeof o.fail === 'function' && o.fail(result);
      }
    });
  },
  // 主软件，点评 视频录制 + 编辑 + 上传
  ahsmartvideo: (o) => {
    if (Tool.webApp.checkCarcommentApp()) { // 点评
      window.AHAPP.invokeNative('ahsmartvideo', {
        function: o.function || '',
        videopath: o.videopath || '',
        imagepath: o.imagepath || '',
        title: o.title || '',
        canChangeDuration: o.canChangeDuration || '',
        uninstall_rec_More: false,
        uninstall_edit_Beauty: true,
        uninstall_rec_prop: true,
        uninstall_edit_paster: true,
        uninstall_rec_Beauty: true,
        uninstall_rec_Flash: false,
        uninstall_rec_Speed: false,
        uninstall_rec_Count: false,
        defaultTab: 1,
        targetpage: o.targetpage || '',
        success: function(result) {
          typeof o.success === 'function' && o.success(result);
        },
        fail: function(result) {
          typeof o.fail === 'function' && o.fail(result);
        }
      });
    } else { // 主软
      window.AHAPP.invokeNative('ahsmartvideo', {
        function: o.function || '',
        videopath: o.videopath || '',
        imagepath: o.imagepath || '',
        title: o.title || '',
        canChangeDuration: o.canChangeDuration || '',
        success: function(result) {
          typeof o.success === 'function' && o.success(result);
        },
        fail: function(result) {
          typeof o.fail === 'function' && o.fail(result);
        }
      });
    }
  },
  // 主软件 解决主软安卓内H5页面的banner和android原生的ViewPager的滑动冲突问题
  getTouchConflictareaInfo: (o) => {
    window.AHAPP.invokeNative('gettouchconflictareainfo', {
      array: o.array,
      success: (result) => {
        typeof o.success === 'function' && o.success(result);
      },
      fail: (result) => {
        typeof o.fail === 'function' && o.fail(result);
      }
    });
  },
  // 主软件 获取经纬度 V2
  nativeLocationV2: (o) => {
    window.AHAPP.invokeNative('nativelocationv2', {
      success: (result) => {
        typeof o.success === 'function' && o.success(result);
      },
      fail: (result) => {
        typeof o.fail === 'function' && o.fail(result);
      }
    });
  },
  // 主软件 实时获取定位信息
  realtimelocation: (o) => {
    window.AHAPP.invokeNative('realtimelocation', {
      success: (result) => {
        typeof o.success === 'function' && o.success(result);
      },
      fail: (result) => {
        typeof o.fail === 'function' && o.fail(result);
      }
    });
  },
  // 选择城市与定位城市不一致时进行同步
  getSyncCity: (o) => {
    window.AHAPP.invokeNative('getSyncCity', {
      success: (result) => {
        typeof o.success === 'function' && o.success(result);
      },
      fail: (result) => {
        typeof o.fail === 'function' && o.fail(result);
      }
    });
  },
  // 选择城市与定位城市不一致时进行同步
  getlocationinfo: (o) => {
    window.AHAPP.invokeNative('getlocationinfo', {
      success: (result) => {
        typeof o.success === 'function' && o.success(result);
      },
      fail: (result) => {
        typeof o.fail === 'function' && o.fail(result);
      }
    });
  },
   // H5设置Native当前选择城市
  updatecity: (o) => {
    window.AHAPP.invokeNative('updatecity', {
      cityid: o.cityid,
      success: (result) => {
        typeof o.success === 'function' && o.success(result);
      },
      fail: (result) => {
        typeof o.fail === 'function' && o.fail(result);
      }
    });
  },
  // 主软件 拨打电话
  tel: (o) => {
    window.AHAPP.invokeNative('tel', {
      tel: o.tel,
      success: (result) => {
        typeof o.success === 'function' && o.success(result);
      },
      fail: (result) => {
        typeof o.fail === 'function' && o.fail(result);
      }
    });
  },
  // 主软件 查看大图
  bigimg: (o) => {
    window.AHAPP.invokeNative('bigimg', {
      'currentindex': o.currentindex,
      'image': o.image,
      success: (result) => {
        typeof o.success === 'function' && o.success(result);
      },
      fail: (result) => {
        typeof o.fail === 'function' && o.fail(result);
      }
    });
  },
  // 主软件 获取联系人列表
  getContactList: (o) => {
    window.AHAPP.invokeNative('getcontactlist', {
      success: (result) => {
        typeof o.success === 'function' && o.success(result);
      },
      fail: (result) => {
        typeof o.fail === 'function' && o.fail(result);
      }
    });
  },
  // 主软件 打开APP原生页面
  openNativePage: (o) => {
    window.AHAPP.invokeNative('nativepage', {
      'url': o.url,
      success: (result) => {
        typeof o.success === 'function' && o.success(result);
      },
      fail: (result) => {
        typeof o.fail === 'function' && o.fail(result);
      }
    });
  },
  // 主软件 打开APP原生页面（异步回调）
  openNativePageAsyncResult: (o) => {
    window.AHAPP.invokeNative('nativepageasyncresult', {
      'url': o.url,
      'requestcode': o.requestCode,
      success: (result) => {
        typeof o.success === 'function' && o.success(result);
      },
      fail: (result) => {
        typeof o.fail === 'function' && o.fail(result);
      }
    });
  }
};

