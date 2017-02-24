// import 'babel-polyfill';
require('es6-promise/auto');
import axios from 'axios';
import util from './helper.js'
/*
 * factory method to create http request client 
*/
function factory (config = {}) {
  if (config.toString() === '[object Object]') {
    var defaluts = {
      toast: _nope
    }
    config = util.simpleMix(defaluts, config); 
    var ins = axios.create(config); 
    ins.toast =  config.toast;
    return _init(ins);
  }
  else if (config.constructor === Function) {
    return config.call(null, axios);
  }
}

/*
 * empty function
 */
function _nope () {}

function _init (http) {
  return _transAxios(_buildInterceptor(http));
}

/**
 * add & adapte some axios methods
 */
function _transAxios (http) {
  var [oldGet, oldDelete] = [http.get, http.delete];

  http.cache = {};

  //only handle the right param!
  //use es5 so this refer to http
  var _getCache = util.proxy(function (namespace, key) {
    if (namespace && key) {
      try {
        return this.cache[namespace][key]; 
      } catch (e) {
        console.info(e);
        return null;
      }
    } else {
      return this.cache[key];
    }
  }, http)

  //only handle the right param!
  var _setCache = util.proxy(function (namespace, key, data) {
    if (namespace && key) {
      this.cache[namespace] = this.cache[namespace] || {};
      return this.cache[namespace][key] = data;
    } else {
      return this.cache[key] = data;
    }
  }, http)

  /**
   * trans get method
  */
  http.get = (url = '', data = {}, config = {}) => {
    if (data) {
      config.params = data;
    }
    return oldGet(url, config);
  }

  /**
   * trans delete method
  */
  http.delete = (url = '', data = {}, config = {}) => {
    if (data) {
      config.params = data;
    }
    return oldDelete(url, config);
  }

  /**
   * add cacheGet method
   * use http.cache as cache pool
   */
  http.cacheGet = (url, data ,config = {}) => {
    var key = data ? url + util.stringify(data) : url;
    var defaluts = {
      forceUpdate: false,
      cacheNamespace: ''
    } 
    config = util.simpleMix(defaluts, config);
    var cacheObj = _getCache(config.cacheNamespace, key);
    if (cacheObj && !config.forceUpdate) {
      return new Promise((resolve, reject) => {
        resolve(cacheObj);
      });
    } else {
      return http.get(url, data, config).then(data => {
        return _setCache(config.cacheNamespace, key, data);
     });
    }
  }
  /**
   * strongCacheGet use localstorage as cache pool
   */
  http.strongCacheGet = (url, data, config) => {
    var key = data ? url + util.stringify(data) : url;
    return http.cacheGet(url, data, config).then(data => {
      util.cache(key, data);
      return data;
    });
  }

  return http;
}

/**
 * build custom interceptor, include request & response
 */
function _buildInterceptor (http) {
  http.customInterceptors = {
    request: _nope,
    response: _nope
  };
  http.customInterceptors.request = http.interceptors.request.use((config = {}) => {
    var defaluts = {
      params: {},
      hideLoading: false
    }
    config = util.simpleMix(defaluts, config);
    config.params.ts = new Date().getTime();
    if (config.hideLoading) http.toast('xhrShow');
    return config;
  });
  
  http.customInterceptors.response = http.interceptors.response.use(res => {
    //耦合代码
    $.toastIsRuning = false;
    var config = res.config;
    if (!config.hideLoading) {
      var timer = setTimeout(() => {
        //请求成功之后，toastIsRuning已经被置成false,如果500ms之后，toastIsRunning被置为了true，则说明toast又弹了出来，此时不应该执行hide操作
        !config.hideLoading && !$.toastIsRuning && http.toast('xhrHide');
      }, 500);
    }
    return Promise.resolve(res.data);
  }, error => {
    console.error(error);
    var msg = error.response.data.message;
    msg ? http.toast(msg): http.toast('服务器异常');
    return Promise.reject(error.response);
  })
  return http;
}

/**
 * finally, create normalRequest
 */
var normalRequest = factory({
  baseURL: '/',
  timeout: 2000,
  headers: {
    "Content-type": "application/json; charset=UTF-8"
  }
});

export {factory, normalRequest};
