import axios from 'axios';
import { notification } from 'antd';

// axios.defaults.timeout = 5000;

// let pending = [] //声明一个数组用于存储每个ajax请求的取消函数和ajax标识
// let cancelToken = axios.CancelToken
// let removePending = (config, f) => {
//     let flagUrl = config.url + '&' + config.method
//     if (pending.indexOf(flagUrl) !== -1) { //当当前请求在数组中存在时执行函数体
//         if(f) {
//             console.log('执行取消操作')
//             f()//执行取消操作
//         } else {
//             pending.splice(pending.indexOf(flagUrl), 1)// 把这条记录从数组中移除
//         }
//     } else {
//         f&&pending.push(flagUrl)
//     }
// }

// //添加请求拦截器
// axios.interceptors.request.use(config => {
//   return config
// }, error => {
//   return Promise.reject(error);
// });


// 响应拦截器
axios.interceptors.response.use((response) => {

  // removePending(response.config)// 在一个ajax响应后再执行一下取消操作，把已经完成的请求从pending中移除
  let notificationType = {
    1001: 'success',
    1002: 'success',
    2002: 'error',
    2004: 'error',
    2005: 'warning',
    // 4001: 'success',
    4002: 'error',
    4005: 'error',
  }
  let data = response.data
  //提示框
  if (!!data) {
    let description = data.data || data.msg
    notificationType[data.status] && notification[notificationType[data.status]]({
      message: data.status,
      description,
    }, 6)
  }
  if (data.length == 0) {
    let url = response.config.url.split('/').reverse()[0]
    switch (url) {
      case "getCategoryGoods":
      case "getWeightLog":
      case "searchGoods":
      case "getDeletelog":
      case "oenCashbox":
      case "getTBlist":
        break
      default:
        notification.warning({
          message: '提示',
          description: '网络断开或阻塞，部分功能暂不可用',
        })
        break
    }

  }
  return response;
}, (error) => {
  switch (error.response.status) {
    case 400:
      error.message = '请求错误'
      break

    case 401:
      error.message = '未授权，请登录'
      break

    case 403:
      error.message = '拒绝访问'
      break

    case 404:
      error.message = '请求地址出错'
      break

    case 408:
      error.message = '请求超时'
      break

    case 500:
      error.message = '服务器内部错误'
      break

    case 501:
      error.message = '服务未实现'
      break

    case 502:
      error.message = '网关错误'
      break

    case 503:
      error.message = '服务不可用'
      break

    case 504:
      error.message = '网关超时'
      break

    case 505:
      error.message = 'HTTP版本不受支持'
      break

    default:
  }

  if (localStorage.getItem('isupdate')) {

  } else {
    notification.error({
      message: error.response.status,
      description: error.message,
    }, 6)
  }

  return Promise.reject(error);
});

// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
/**
 * 公用get请求
 * @param url       接口地址
 * @param msg       接口异常提示
 * @param headers   接口所需header配置
 */

export const get = ({ url, params, msg = '接口异常', headers }) =>
  axios.get(url, params, headers).then(res => res).catch(error => {
    console.log(error)
  });

/**
 * 公用post请求
 * @param url       接口地址
 * @param data      接口参数
 * @param msg       接口异常提示
 * @param headers   接口所需header配置
 */

export const post = ({ url, data, msg = '接口异常', headers }) =>
  axios.post(url, data, headers).then(res => res).catch(error => {
    console.log(error)
  })

