const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(proxy('/orderapi', {
    target: 'https://chefuwu.autohome.com.cn',
    secure: false,
    changeOrigin: true
  }));
  app.use(proxy('/cus', {
    target: 'http://test.yczj.api.autohome.com.cn',
    secure: false,
    changeOrigin: true
  }));
  app.use(proxy('/v2', {
    target: 'http://test.yczj.api.autohome.com.cn',
    secure: false,
    changeOrigin: true
  }));
};