import {normalRequest} from './';
window.R = normalRequest;
normalRequest.cacheGet('/self/bitwise.html').then((data, res) => {
  console.log(res);
})
.catch(error => {
  console.log(error.response);
})
