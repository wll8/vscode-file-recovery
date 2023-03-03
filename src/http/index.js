import config from '@/config.js'
import util from '@/util/index.js'
import axios from 'axios'

const api = axios.create({
  timeout: 10000, // 请求超时
  baseURL: config.baseApi,
})

// request拦截器
api.interceptors.request.use(
  (options) => {
    options.baseURL = config.baseApi
    return options
  },
  (error) => {
    Promise.reject(error)
  }
)
// response拦截器
api.interceptors.response.use(
  (response) => {
    const data = response.data
    if (util.isType(data, `blob`)) {
      return response
    } else if (data.data === undefined) {
      return data
    } else {
      return response.data.data
    }
  },
  (error) => {
    return Promise.reject(error)
  }
)

const install = (Vue) => {
  Vue.prototype.$http = api
}

export { api }

export default {
  install,
}
