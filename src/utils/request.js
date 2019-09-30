import axios from 'axios'
import { getToken } from './auth.js'
import router, { resetRouter } from './../router'
import store from './../store'
import Message from 'element-ui'
import {
  removeToken
} from './auth'
import { setToken } from './auth';
// create类似于我们常看到的new Object一样
const service = axios.create({
  baseURL: '', // baseurl为什么是''呢？看我下面的解释
  // withCredentials: true,

  timeout: 200000
})

// 请求拦截
service.interceptors.request.use(
  config => {
    // console.log('hello, this is requrst before.')
    // console.log(config)
    // if (store.getters.token) {
    // let each request carry token
    // ['X-Token'] is a custom headers key
    // please modify it according to the actual situation
    // config.headers['X-Token'] = getToken()
    // config.headers.Authorization = getToken() 123 456
    config.headers['Authorization'] = getToken()
    // }
    return config
  },
  error => {
    // console.log(error)
    return Promise.reject(error)
  }
)

// 响应拦截
service.interceptors.response.use(

  response => {


    if (response.data.code === '0000') {

      const authorization = response.headers.authorization;  //令牌
      store.commit('user/SET_TOKEN', authorization) //请求用户信息
      setToken(authorization) // 存到cookie里面
      return response
    } else if (response.data.code == 2000 ) {
      // alert(111)
      console.error(response)
      console.error('token过期')
      localStorage.removeItem('pp_userId')
      localStorage.removeItem('pp_merchant_center_code')
      store.commit('user/SET_TOKEN', '')
      store.commit('user/SET_ROLES', [])
      store.commit('user/SET_USERID', '')
      store.commit('user/SET_AVATAR', '')
      store.commit('user/SET_NAME', '')
      store.commit('suer/SET_MERCHANT_CENTER_CODE','')
      Message.error('token过期')
      removeToken()
      resetRouter()
      router.push(`/login`)
    } else {

      return response;
      // console.error(response)
      // console.error('数据异常')
      // localStorage.removeItem('pp_userId')
      // store.commit('user/SET_TOKEN', '')
      // store.commit('user/SET_ROLES', [])
      // store.commit('user/SET_USERID', '')
      // store.commit('user/SET_AVATAR', '')
      // store.commit('user/SET_NAME', '')
      // Message.error('数据异常')
      // removeToken()
      // resetRouter()
      // router.push(`/login`)
    }
  },
  error => {
    // console.log('err' + error)
    // console.log(error.response)
    //目前的token过期 以接口错误的时候 抛出来了，这里拦截
    if(error.response.data.code == 2000){

      Message.MessageBox.alert('登录超时请重新登录', '确定登出', {
        confirmButtonText: '重新登录',
        center:true,
        type: 'warning'
      }).then(() => {

        localStorage.removeItem('pp_userId')
        localStorage.removeItem('pp_merchant_center_code')
        store.commit('user/SET_TOKEN', '')
        store.commit('user/SET_ROLES', [])
        store.commit('user/SET_USERID', '')
        store.commit('user/SET_AVATAR', '')
        store.commit('user/SET_NAME', '')
        store.commit('user/SET_MERCHANT_CENTER_CODE','')
        // Message.error('token过期')
        removeToken()
        resetRouter()
        router.push(`/login`)
        //location.reload()
      })
    }
    return Promise.reject(error)
  }
)

export default service
