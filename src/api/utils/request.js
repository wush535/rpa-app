import axios from 'axios'
import { Notification, MessageBox, Message, Loading } from 'element-ui'
import qs from 'qs';
import { saveAs } from 'file-saver'

import store from './store';

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';

// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: "http://127.0.0.1:6858/",
  // 超时
  timeout: 100000
})

// request拦截器
service.interceptors.request.use(config => {
  // 是否需要防止数据重复提交
  const isRepeatSubmit = (config.headers || {}).repeatSubmit === false

  // get请求映射params参数
  if (config.method === 'get' && config.params) {
    let url = config.url + '?' + config.params;
    config.params = {};
    config.url = url;
  }
  
  if (!isRepeatSubmit && (config.method === 'post' || config.method === 'put')) {
    const requestObj = {
      url: config.url,
      data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
      time: new Date().getTime()
    }
    const sessionObj = localStorage.getItem('sessionObj')
    if (sessionObj === undefined || sessionObj === null || sessionObj === '') {
      localStorage.setItem('sessionObj', requestObj)
    } else {
      const s_url = sessionObj.url;                  // 请求地址
      const s_data = sessionObj.data;                // 请求数据
      const s_time = sessionObj.time;                // 请求时间
      const interval = 1000;                         // 间隔时间(ms)，小于此时间视为重复提交
      if (s_data === requestObj.data && requestObj.time - s_time < interval && s_url === requestObj.url) {
        const message = '数据正在处理，请勿重复提交';
        //console.warn(`[${s_url}]: ` + message)
        return Promise.reject(new Error(message))
      } else {
       localStorage.setItem('sessionObj', requestObj)
      }
    }
  }
   const isLoading = (JSON.stringify(config.isLoading) == undefined 
				|| JSON.stringify(config.isLoading) == null
				|| JSON.stringify(config.isLoading) == "")?true:config.isLoading;
	
   config.isLoading = undefined;
   /* console.log((JSON.stringify(config.isLoading) == undefined
				|| JSON.stringify(config.isLoading) == null 
				|| JSON.stringify(config.isLoading) == "")+"====="+config.isLoading+"=========="+isLoading) */
   if(isLoading){
		if(store.state.neddloding == 0){
				store.commit('openLoading')      
		 }
		 store.commit('show') 
		 //console.log(config.url+"======="+store.state.neddloding)
   }
   
	
  return config
}, error => {
    //console.log(error)
    Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(res => {
    // 未设置状态码则默认成功状态
    const code = res.code || 200;
    //console.log("res========"+JSON.stringify(res.data))
    // 获取错误信息
    const msg = "操作错误！" || res.msg
    // 二进制数据则直接返回
    if(res.request.responseType ===  'blob' || res.request.responseType ===  'arraybuffer'){
      return res.data
    }

	//console.log(store.state.neddloding)
	store.commit('hide') //每完成一次请求减一
	if(store.state.neddloding <= 0){ //等于0关闭loding
		//console.log(""+store.state.neddloding)
		store.commit('closeLoading')
	}

    if (code === 500) {
      Message({
        message: msg,
        type: 'error'
      })
      return Promise.reject(new Error(msg))
    } else if (code !== 200) {
      Notification.error({
        title: msg
      })
      return Promise.reject('error')
    } else {
      return res.data
    }
  },
  error => {
    //console.log('err' + error)
    let { message } = error;
    if (message == "Network Error") {
      message = "后端接口连接异常";
    }
    else if (message.includes("timeout")) {
      message = "系统接口请求超时";
    }
    else if (message.includes("Request failed with status code")) {
      message = "系统接口" + message.substr(message.length - 3) + "异常";
    }
    Message({
      message: message,
      type: 'error',
      duration: 5 * 1000
    })
	//console.log(store.state.neddloding)
	store.commit('hide') //每完成一次请求减一
	if(store.state.neddloding <= 0){ //等于0关闭loding
		//console.log(store.state.neddloding)
		store.commit('closeLoading')
	}
	
    return Promise.reject(error)
  }
)

// 通用下载方法
export function download(myurl, params, filename) {
	const loading = Loading.service({ text: "正在下载数据，请稍候",  spinner: "el-icon-loading",  background: "rgba(0, 0, 0, 0.7)", })
	const para = qs.stringify(params);
	console.log("para===="+para)
	service({url:myurl,
		method: 'post',
		responseType: 'blob',
		data: para,
		headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
	  }).then((res) => {
		//console.log("111111111111111111111111111");
		const blob = new Blob([res])
		saveAs(blob, filename)
		//console.log("22222222222222222222222222");
		loading.close();
		//console.log(store.state.neddloding)
		store.commit('hide') //每完成一次请求减一
		if(store.state.neddloding == 0){ //等于0关闭loding
			//console.log(store.state.neddloding)
			store.commit('closeLoading')
		}
  }).catch((r) => {
    //console.error(r)
	//console.log(store.state.neddloding)
	store.commit('hide') //每完成一次请求减一
	if(store.state.neddloding == 0){ //等于0关闭loding
		//console.log(store.state.neddloding)
		store.commit('closeLoading')
	}
    Message.error('下载文件出现错误，请联系管理员！')
    loading.close();
  })
}


export default service
