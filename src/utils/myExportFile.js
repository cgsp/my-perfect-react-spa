import axios from "axios"
import config from "@Service/axios-config/config"
import store from "@Store"
import { mySessionStorageClear } from '@Utils/my-storages'
import { noLoginCode, noAuthCode } from '@Constants'
import jsDownload from 'js-file-download'
import { message } from 'antd'


const service = axios.create(config)
/*
 * 全局拦截器的设置
 */
// 添加请求拦截器
service.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    // 启动全局的loading
    store.Loading.changeDownPercentLoading(true, 0)
    return config;
  },
  error => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
service.interceptors.response.use((response) => {
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
    return response
  }
  else {
    return response
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


let downIngCallBack = null
export const myExportFile = (url, paramsObj) => {
  if (!url) {
    message.error('请输入导出url')
    return
  }

  paramsObj = paramsObj || {}

  httpInstance.get(url, paramsObj,
    // 响应的数据格式 json / blob /document /arraybuffer / text / stream
    {
      responseType: 'blob',
      onDownloadProgress(progressEvent) {
        downIngCallBack(progressEvent)
      }
    }
  ).then(res => {
    // console.log(res)
    // 这里res.data是返回的blob对象
    // console.log(res.headers['content-disposition'])
    const fileNameString = res.headers['content-disposition'] || 'file=导出文件'
    let filename = fileNameString.split('=')[1]
    filename = decodeURI(filename)
    jsDownload(res.data, filename)
  })
}

// 处理导出进度条的函数
let timer = null
downIngCallBack = (progressEvent) => {
  let percentCompleted
  // console.log(progressEvent)
  if (progressEvent.lengthComputable) {
    percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
    if (percentCompleted === 100) {
      store.Loading.changeDownPercentLoading(true, 100)
      if (timer) {
        clearTimeout(timer)
      }
      // 为了一个迟缓的效果
      timer = setTimeout(() => {
        store.Loading.changeDownPercentLoading(false, 100)
      }, 250);
    } else {
      store.Loading.changeDownPercentLoading(true, percentCompleted)
    }
  } else {
    store.Loading.changeDownPercentLoading(false, 100)
    message.error('文件有误，或文件长度不可计算')
  }
  // console.log(percentCompleted)
}























// res = res.data
// var blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' });
    // var blob = new Blob([res.data], { type: 'application/vnd.ms-excel' }); // application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
    // var downloadElement = document.createElement('a');
    // var href = window.URL.createObjectURL(blob); // 创建下载的链接
    // downloadElement.href = href;
    // downloadElement.download = '商务渠道.xlsx'; // 下载后文件名
    // document.body.appendChild(downloadElement);
    // downloadElement.click(); // 点击下载
    // document.body.removeChild(downloadElement); // 下载完成移除元素
    // window.URL.revokeObjectURL(href); // 释放掉blob对象 
    // download(res.data, 'Detail_Blast.xls')


