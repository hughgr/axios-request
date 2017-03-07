import {normalRequest} from './index.js';
import './test.css';
//import moment from 'moment';
//var moment = require('moment');
window.R = normalRequest;

function showData () {
//    console.log(moment().format('LLLL'));
    import('moment').then(moment => {
      console.log(moment().format('LLLL'));
    })
}

normalRequest.delete('/self/bitwise.html', {name:'cc'}).then((data, res) => {
  console.log(data);
})
.catch(error => {
  console.log(error.response);
})

console.info(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'production') {
  showData();
}
