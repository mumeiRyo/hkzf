// import axios from 'axios'

// import { BASE_URL } from './url'

// const API = axios.create({
//   baseURL: BASE_URL
// })

// export { API }
import axios from 'axios'

import { BASE_URL } from './url'

const API = axios.create({
  baseURL: BASE_URL
})
console.log(API)
// 添加基础路由
// axios.defaults.baseURL = 'http://localhost:8080'

// console.log(process.env, process.env.REACT_APP_URL)

// if (process.env.NODE_ENV === 'development') {
//   // 针对于开发环境做处理
// }

// axios.create 方法会创建一个新的axios实例
// 此处的 API 就相当于默认导入的 axios
// const API = axios.create({
//   baseURL: BASE_URL

//   // process  是 NodeJS 中提供的一个用来提供与NodeJS进程相关信息的对象
//   // process.env 获取到环境变量对象
//   // REACT_APP_URL 属性是 React 脚手架在运行的时候，就会读取 .env.development 中配置的环境变量
//   //  读取到以后，就会把它添加到 process.env 这个对象中
//   // baseURL: process.env.REACT_APP_URL

//   // 开发期间的接口地址
//   // baseURL: 'http://localhost:8080'

//   // 线上环境的接口地址
//   // baseURL: 'http://api.itcast.cn'
// })

// API 配置 拦截器

export { API }
