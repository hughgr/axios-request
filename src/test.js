import {normalRequest} from './';

normalRequest.get('/self/bitwise.html1').then((data, res) => {
  console.log(res);
})
.catch(error => {
  console.log(error.response);
})
