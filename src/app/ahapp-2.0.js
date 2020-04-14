;(function() {
  var ua = navigator.userAgent;
  var isIOS = ua.indexOf('_iphone') > -1 || ua.indexOf('iPhone') > -1 || ua.indexOf('iPad') > -1;
  var isAndroid = ua.indexOf('_android') > -1 || ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1;

  var METHOD_ON_JS_BRIDGE_READY = 'ON_JS_BRIDGE_READY';
  var METHOD_GET_JS_BIND_METHOD_NAMES = 'GET_JS_BIND_METHOD_NAMES';
  var METHOD_GET_NATIVE_BIND_METHOD_NAMES = 'GET_NATIVE_BIND_METHOD_NAMES';

  var BRIDGE_PROTOCOL_URL = '';
  if (isIOS) {
    BRIDGE_PROTOCOL_URL = 'ahjb://_AUTOHOME_JAVASCRIPT_BRIDGE_'; // iOS
  }
    // var BRIDGE_PROTOCOL_URL = 'ahjb://_AUTOHOME_JAVASCRIPT_BRIDGE_'; // iOS

  var iframeTrigger; // iOS
  var AJI = window._AUTOHOME_JAVASCRIPT_INTERFACE_; // Android
  var commandQueue = [];
  var mapMethod = {};
  var mapCallback = {};
  var callbackNum = 0;

    /**
     *  调用Native方法
     *
     *  @param methodName   方法名
     *  @param methodArgs   方法参数
     *  @param callback     回调方法
     */
  function invoke(methodName, methodArgs, callback) {
    var command = _createCommand(methodName, methodArgs, callback, null, null);
    _sendCommand(command);
  }

    /**
     *  JS绑定方法, 提供给Native调用
     *
     *  @param name    方法名
     *  @param method  方法实现
     */
  function bindMethod(name, method) {
    mapMethod[name] = method;
  }

    /**
     *  解除JS绑定方法
     *
     *  @param name 方法名
     */
  function unbindMethod(name) {
    delete mapMethod[name];
  }

    /**
     *  获取所有JS绑定的方法名
     */
  function getJsBindMethodNames() {
    var methodNames = [];
    for (var methodName in mapMethod) {
      methodNames.push(methodName);
    }
    return methodNames;
  }

    /**
     * 获取所有Native绑定的方法名
     *
     * @param callback 返回的数据回调方法
     */
  function getNativeBindMethodNames(callback) {
    invoke(METHOD_GET_NATIVE_BIND_METHOD_NAMES, null, callback);
  }

    /**
     *  检查Native待处理命令(Android)
     */
  function _checkNativeCommand() {
    var strCommands = AJI.getNativeCommands();
    if (strCommands) {
      // eslint-disable-next-line
      var commands = eval(strCommands);
      for (var i = 0; i < commands.length; i++) {
        _handleCommand(commands[i]);
      }
    }
  }

    /**
     * 初始化
     */
  function _init() {
        // 初始化自带的绑定
    _initBindMethods();

        // deprecated, 被事件通知取代
    if (typeof onBridgeReady === 'function') {
      // eslint-disable-next-line
      onBridgeReady();
    }

        // 通知Native桥接完成
    invoke(METHOD_ON_JS_BRIDGE_READY, 'v2', null);

        // 通知JS桥接完成(事件&方法)
    var event = document.createEvent('HTMLEvents');
    event.initEvent(METHOD_ON_JS_BRIDGE_READY, false, true);
    document.dispatchEvent(event);
  }
    /**
     * 初始化自带的绑定方法
     */
  function _initBindMethods() {
        // 获取JS所有绑定的方法
    bindMethod(METHOD_GET_JS_BIND_METHOD_NAMES, function(args, callback) {
      callback(getJsBindMethodNames());
    });
  }

    /**
     *  发送JS命令
     *
     *  @param command 命令
     */
  function _sendCommand(command) {
    // iOS 触发Native检查命令队列
    if (isIOS) {
      if (!iframeTrigger) {
        iframeTrigger = document.createElement('iframe');
        iframeTrigger.style.display = 'none';
        document.documentElement.appendChild(iframeTrigger);
      }
      commandQueue.push(command);
      iframeTrigger.src = BRIDGE_PROTOCOL_URL;
    } else if (isAndroid) { // Android 直接发送命令队列
      commandQueue.push(command);
      var jsonCommands = JSON.stringify(commandQueue);
      commandQueue = [];
      AJI.receiveCommands(jsonCommands);
    }
  }

    /**
     *  Native获取JS待处理的命令组(iOS)
     */
  function _getJsCommands() {
    var jsonCommands = JSON.stringify(commandQueue);
    commandQueue = [];
    return jsonCommands;
  }

    /**
     *  接收Native发送的字符串命令组(iOS)
     *
     *  @param strCommands 字符串命令组
     */
  function _receiveCommands(strCommands) {
    // eslint-disable-next-line
    var commands = eval(strCommands);
    for (var i = 0; i < commands.length; i++) {
      _handleCommand(commands[i]);
    }
  }

    /**
     *  处理命令
     *
     *  @param command 命令
     */
  function _handleCommand(command) {
    setTimeout(function() {
      if (!command) return;
      // 执行命令
      if (command.methodName) {
        var method = mapMethod[command.methodName];
        if (method) {
          var result = method(command.methodArgs, function(result) {
            if (command.callbackId) {
              var returnCommand = _createCommand(null, null, null, command.callbackId, result);
              _sendCommand(returnCommand);
            }
          });
          // 兼容使用return返回结果
          if (result) {
            if (command.callbackId) {
              var returnCommand = _createCommand(null, null, null, command.callbackId, result);
              _sendCommand(returnCommand);
            }
          }
        }
      } else if (command.returnCallbackId) { // 回调命令
        var callback = mapCallback[command.returnCallbackId];
        if (callback) {
          callback(command.returnCallbackData);
          delete mapCallback[command.returnCallbackId];
        }
      }
    });
  }

    /**
     *  创建命令
     *
     *  @param methodName           方法名
     *  @param methodArgs           方法参数
     *  @param callback             回调方法
     *  @param returnCallbackId     返回的回调方法ID
     *  @param returnCallbackData   返回的回调方法数据
     */
  function _createCommand(methodName, methodArgs, callback, returnCallbackId, returnCallbackData) {
    var command = {};
    if (methodName) command.methodName = methodName;
    if (methodArgs) command.methodArgs = methodArgs;
    if (callback) {
      callbackNum++;
      var callbackId = 'js_callback_' + callbackNum;
      mapCallback[callbackId] = callback;
      command.callbackId = callbackId;
    }
    if (returnCallbackId) command.returnCallbackId = returnCallbackId;
    if (returnCallbackData) command.returnCallbackData = returnCallbackData;
    return command;
  }

  window.AHJavascriptBridge = {
    invoke: invoke,
    bindMethod: bindMethod,
    unbindMethod: unbindMethod,
    getJsBindMethodNames: getJsBindMethodNames,
    getNativeBindMethodNames: getNativeBindMethodNames,
    _checkNativeCommand: _checkNativeCommand, // iOS
    _getJsCommands: _getJsCommands, // Android
    _receiveCommands: _receiveCommands // Android
  };

  window.AHJavascriptBridgeInit = _init; // 由于ios回退时，不会再次加载js，故自执行方法不能执行。此处代码供客户端调用，
  _init();
})();

;(function() {
    // 具体方法
  var ua = navigator.userAgent;
  // eslint-disable-next-line
  var isIOS = ua.indexOf('_iphone') > -1 || ua.indexOf('iPhone') > -1 || ua.indexOf('iPad') > -1 || ua.indexOf('Mac') > -1;
  // eslint-disable-next-line
  var isAndroid = ua.indexOf('_android') > -1 || ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1 || ua.indexOf('Linux') > -1;
  var bindMethodArray = null; // 方法数组
  var noMethodStr = '{returncode:1,message:"该方法暂不支持",result:{}}';

  var SetTokenObj = {
    isRunConfig: false, // 是否运行config方法
    isSet: false, // 是否执行设置token
    token: '',  // app token
    appid: '' // app appid
  };
  // eslint-disable-next-line
  if (typeof AHAPPCONFIG !== 'undefined') {
    // eslint-disable-next-line
    SetTokenObj.token = AHAPPCONFIG.token; // app token
    // eslint-disable-next-line
    SetTokenObj.appid = AHAPPCONFIG.appid; // app appid
  }
  document.addEventListener('ON_JS_BRIDGE_READY',
        function() {
          // eslint-disable-next-line
          AHJavascriptBridge.getNativeBindMethodNames(function(res) {
            bindMethodArray = JSON.stringify(res);
          });
          start('config', null, true); // 启动方法
        }, false);
  // eslint-disable-next-line
  function empFun() {} // 空方法

  function removeObjMethod(obj) { // 去除传递过来参数的 success 和 fail 方法
    var newObj = {};
    var isCopy = true;
    for (var key in obj) {
      isCopy = !(typeof obj[key] === 'function' && (key === 'success' || key === 'fail'));
      if (isCopy) {
        newObj[key] = obj[key];
      }
    }
    return newObj;
  }

  function setAHAPPToken(tokenObj) {
    SetTokenObj.isRunConfig = false; // 设置token完毕后，需要重新执行config方法
    SetTokenObj.isSet = true;
    SetTokenObj.token = tokenObj.token; // app token
    SetTokenObj.appid = tokenObj.appid; // app appid
  }
  function start(type, o, isfirst) { // 开始方法
    if (!bindMethodArray) { // 方法数组不存在  由于历史原因此处进行二次判断
      // eslint-disable-next-line
      ahappLog('bindMethodArray值不存在');
      return;
    }

    if (bindMethodArray.indexOf(type) > -1 && !SetTokenObj.isRunConfig) { // 如果存在config并且config未成功执行
      run('config', { // 执行config
        appkey: SetTokenObj.token,
        appid: SetTokenObj.appid,
        success: function(result) {
          SetTokenObj.isRunConfig = true;
          if (!isfirst) {
            run(type, o); // 方法执行
          }
          console.log('配置启动成功');
        },
        fail: function(result) {
          console.log(result, '失败了');
          SetTokenObj.isRunConfig = false;
          console.log('配置启动失败');
        }
      });
    }
  }

  function run(type, o) { // 方法执行
    var paramToApp = removeObjMethod(o); // 传递给客户端的参数
    if (bindMethodArray.indexOf(type) > -1) { // 判断执行的方法是否存在
      // eslint-disable-next-line
      AHJavascriptBridge.invoke(type, paramToApp,
        function(res) {
          _callbackHtml(o, res);
        });
    } else {
      // eslint-disable-next-line
      ahappLog('可执行的类型为：' + bindMethodArray);
      _callbackHtml(o, noMethodStr);
    }
  }
    /*
    1、方法数组是否存在
    2、config是否存在
    3、执行方法
    */
  function invokeNative(type, o) { // 调用方法 type:方法类型 o:参数
    if (bindMethodArray) { // 方法数组存在
      if (bindMethodArray.indexOf('config') > -1 && !SetTokenObj.isRunConfig) { // 如果存在config并且config未成功执行
        start(type, o, false); //
        return; // 结束该方法的执行
      }
      run(type, o);
      return;
    }
      // 方法数组不存在
    // eslint-disable-next-line
    AHJavascriptBridge.getNativeBindMethodNames(function(res) {
      bindMethodArray = JSON.stringify(res);
      if (bindMethodArray.indexOf('config') > -1 && !SetTokenObj.isRunConfig) { // 如果存在config并且config未成功执行
        start(type, o, false); // 重新启动配置
        return; // 结束该方法的执行
      }
      run(type, o);
    });
  }

    // H5 为右上角原生分享按钮设置分享内容
  function setNativeShareInfo(o) {
    // eslint-disable-next-line
    AHJavascriptBridge.bindMethod('getshareinfo',
            function(args, callback) {
              var json = {'platform': o.platform, 'url': o.url, 'title': o.title, 'content': o.content, 'imgurl': o.imgurl};
              callback(json);
            });
  }

  function setNativeShareFinish(o) {
    // eslint-disable-next-line
    AHJavascriptBridge.bindMethod('nativesharefinish',
            function(args, callback) {
              _callbackHtml(o, args);
            });
  }

    // H5 为右上角原生城市按钮设置城市选择完毕后的回调
  function setChooseCityFinish(o) {
    // eslint-disable-next-line
    AHJavascriptBridge.bindMethod('choosecityfinish',
            function(args, callback) {
              _callbackHtml(o, args);
            });
  }

  function _callbackHtml(o, resultJson) {
    if (resultJson.returncode === 0 || resultJson.returncode === '0') {
      o.success(resultJson);
    } else {
      o.fail(resultJson);
    }
  }

  window.AHAPP = {
    invokeNative: invokeNative,
    setAHAPPToken: setAHAPPToken,
    setNativeShareInfo: setNativeShareInfo,
    setNativeShareFinish: setNativeShareFinish,
    setChooseCityFinish: setChooseCityFinish
  };
})();
