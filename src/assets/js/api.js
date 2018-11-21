import axios from 'axios';
const https = axios.create({
  baseURL: 'https'
});
https.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';


export function setHeader(token) {
  https.defaults.headers['VERIFYCODE'] = token;
}


export function api({url, data, form = false, method = 'post', onlyStatus = true}) {
  return new Promise ((resolve, reject) => {
    https({
      url,
      method,
      data,
      transformRequest: [function (data, headers) {
        let req = '';
        if (form) {
          for (let key in data) {
            req += `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}&`;
          };
        } else {
          headers.post['Content-Type'] = 'application/json';
          req = JSON.stringify(data);
        };
        return req;
      }],
    }).then(res => {
      if (onlyStatus) {
        if (res.data.res === 200) {
          resolve(res.data);
        } else {
          reject(res.data.msg);
        };
      } else {
        resolve(res.data);
      };
    }).catch(err => {
      reject('请求失败');
    });
  });
};