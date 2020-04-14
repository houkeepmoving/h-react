export const BaiduMap = () => {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined') {
      window.init = () => {
        resolve(window.BMap);
      };

      let script = document.createElement('script');

      script.type = 'text/javascript';
      script.async = true;
      script.src = '//api.map.baidu.com/api?v=3.0&s=1&ak=kTPXBr7VXv7vaheBEHjiVsYK&callback=init';
      script.onerror = reject;
      document.head.appendChild(script);
    }
  });
};
