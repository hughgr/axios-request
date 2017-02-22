// import 'babel-polyfill';
require('es6-promise/auto');
import axios from 'axios';

function factory (config = {}) {
  if (config.toString() === '[object Object]') {
    var defaluts = {
      toast: _nope
    }
    _simpleMix(config, defaluts); 
    var ins = axios.create(config); 
    ins.toast =  config.toast;
    return _init(ins);
  }
  else if (config.constructor === Function) {
    return config.call(null, axios);
  }
}
function _nope () {}
function _simpleMix(dest, src) {
  for (var key in src) {
    //only handle object 
    if (src[key].constructor === Object) {
      dest[key] = {};
      _simpleMix(dest[key], src[key]);
    } else {
      dest[key] = src[key];
    }
  }
  return dest;
}
function _init (http) {
  return _buildInterceptor(http);
}
function _buildInterceptor (http) {
  http.interceptors.request.use((config = {}) => {
    var defaluts = {
      params: {},
      hideLoading: false
    }
    _simpleMix(config, defaluts);
    config.params.ts = new Date().getTime();
    if (config.hideLoading) http.toast('xhrShow');
    return config;
  });
  
  http.interceptors.response.use(res => {
    //耦合代码
    $.toastIsRuning = false;
    var config = res.config;
    if (!config.hideLoading) {
      var timer = setTimeout(() => {
        //请求成功之后，toastIsRuning已经被置成false,如果500ms之后，toastIsRunning被置为了true，则说明toast又弹了出来，此时不应该执行
        !config.hideLoading && !$.toastIsRuning && http.toast('xhrHide');
      }, 500);
    }
    return Promise.resolve(res.data, res);
  }, error => {
    http.toast('error');
    console.error(error);
    return Promise.reject(error);
  });
  return http;
}

var normalRequest = factory({
  baseURL: '/',
  timeout: 2000,
  headers: {
    'Content-Type':'application/json; charset=UTF-8'
  }
});

export {factory, normalRequest};
