import axios from "axios"
import config from "./axios-config/config"
import store from "@Store"
import * as api from "./api"
import { mySessionStorageClear } from '@Utils/my-storages'
import { noLoginCode, noAuthCode } from '@Constants'

// 设置一个全局变量，标记当前开启了几个ajax
let openAjaxNum = 0

const service = axios.create(config)
/*
 * 全局拦截器的设置
 */
// 添加请求拦截器
service.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    // 启动全局的loading
    store.Loading.changeLoading(true)
    openAjaxNum += 1
    return config;
  },
  error => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
service.interceptors.response.use((response) => {
  // 关闭全局的loading
  openAjaxNum -= 1
  // 判断全部的请求都回来了，才关闭
  if (openAjaxNum === 0) {
    store.Loading.changeLoading(false)
  }
  // store.Loading.changeLoading(false)
  // console.log(openAjaxNum)

  if (response && response.data && response.data.code === noLoginCode) {
    // const str = JSON.stringify(response.data)
    // alert('后端给前端399了,具体信息是-------' + str)
    mySessionStorageClear()
    window.location = response.data.data
  }
  else if (response && response.data && response.data.code === noAuthCode) {
    // const str = JSON.stringify(response.data)
    // alert('后端给前端377了,具体信息是-------' + str)
    mySessionStorageClear()
    return response.data || {}
  }
  else {
    return response.data || {}
  }

}, (error) => {
  // 对响应错误做点什么
  // console.log('响应失败拦截器:', error)
  return Promise.reject(error)
})

// 默认清除params或者data中的undefined，null,和‘’
// 如果需要保留'',则在params中或者data中传入 allowEmptyString=true
const removeUndefinedAndNullAndEmptyString = (options) => {
  options = options || {}
  if (options.allowEmptyString) {
    for (const key in options) {
      if (options[key] === null || options[key] === undefined) {
        delete options[key]
      }
    }
  } else {
    for (const key in options) {
      if (options[key] === null || options[key] === '' || options[key] === undefined) {
        delete options[key]
      }
    }
  }
  return options
}

const httpInstance = {
  get(url, params, config) {
    params = removeUndefinedAndNullAndEmptyString(params)
    return service.get(url, { params, ...config });
  },
  post(url, data, config) {
    data = removeUndefinedAndNullAndEmptyString(data)
    return service.post(url, data, config);
  },
  put(url, data, config) {
    data = removeUndefinedAndNullAndEmptyString(data)
    return service.put(url, data, config);
  },
  delete(url, params, config) {
    params = removeUndefinedAndNullAndEmptyString(params)
    return service.delete(url, { params, ...config });
  }
};

export default api;
export { httpInstance as http };
