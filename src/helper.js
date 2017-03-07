var util = {
  cache (key, value) {
    try {
      if (arguments.length === 2) {
        return localStorage.setItem(key, JSON.stringify(value));
      } else {
        return JSON.parse(localStorage.getItem(key));
      }
    } catch (e) {
      console.error('do not support JSON.parse');
    }
  },
  simpleMix (dest, src) {
    for (var key in src) {
      //only handle object 
      if (src[key].constructor === Object) {
        dest[key] = {};
        this.simpleMix(dest[key], src[key]);
      } else {
        dest[key] = src[key];
      }
    }
    return dest;
  },
  partMix (dest, src) {
    //Do NOT support nested src 
    for (var key in src) {
      //0, false and other
      if (!dest[key]) {
        dest[key] = src[key];
      }
    }
    return dest;
  },
  proxy (callback, context) {
    return (...args) => {
      return callback.apply(context, args);
    }
  },
  stringify (obj) {
    return JSON.stringify(obj);
  },
  safeGetData (data, path) {
    var list = path.split('.');
    var result = data;
    while (list.length > 0) {
      var key = list.shift();
      if (result[key] !== undefined) {
        result = result[key];
      } else {
        result = undefined;
        return;
      }
    }
    return result;
  }
}
export default util;
