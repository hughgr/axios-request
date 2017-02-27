import {normalRequest} from './';
window.R = normalRequest;
normalRequest.delete('/self/bitwise.html', {name:'cc'}).then((data, res) => {
  console.log(res);
})
.catch(error => {
  console.log(error.response);
})
