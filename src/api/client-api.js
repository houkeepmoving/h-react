import axios from 'axios';
// import router from '../router';
import jsonp from 'jsonp';

const timeout = 10000;
// axios.defaults.crossDomain = true;
axios.defaults.withCredentials = true;

// 请求拦截器
axios.interceptors.request.use(request => {
  request.timeout = 10000;
  return request;
}, error => {
  console.log(error);
  return Promise.reject({ message: '页面溜走了，请稍候重试' });
});

// 响应拦截器
axios.interceptors.response.use((response) => {
  if (response.status >= 500 && response.status <= 600) {
    // router.push({ name: 'error' });
  }
  return response;
}, (error) => {
  console.log(error);
  return Promise.reject({ message: '页面溜走了，请稍候重试' });
});

export default {
  get: function(target, params = {}) {
    return axios({
      url: target,
      method: 'get',
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      },
      timeout,
      withCredentials: true,
      params
    }).then(res => {
      return Promise.resolve(res.data);
    }).catch((error) => {
      return Promise.reject(error);
    });
  },
  post: function(target, params = {}) {
    return axios({
      url: target,
      method: 'post',
      data: JSON.stringify(params),
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json;charset=UTF-8'
      },
      withCredentials: true,
      timeout
    }).then(res => {
      return Promise.resolve(res.data);
    }).catch((error) => {
      return Promise.reject(error);
    });
  },
  jsonp: function(target, params) {
    return new Promise((resolve, reject) => {
      jsonp(target + '?' + params, null, function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
};
