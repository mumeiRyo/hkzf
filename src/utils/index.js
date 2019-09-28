import { BASE_URL } from './url'
import { API } from './api'

const BMap = window.BMap

// 创建获取当前定位城市数据的函数
// const getCurrentCity = callback => {
//   const myCity = new BMap.LocalCity()
//   myCity.get(async result => {
//     // console.log('IP定位获取到当前城市信息为：', result)
//     // name 就是定位自动获取到的城市名称
//     const { name } = result
//     const res = await axios.get('http://localhost:8080/area/info', {
//       params: {
//         name
//       }
//     })

//     const { label, value } = res.data.body
//     // 调用回调函数，把当前数据传递出去
//     callback && callback({ label, value })
//     console.log('2 当前城市为：', res)

//     // 注意：此处的 return 是当前回调函数的返回值，
//     //  并不是外层函数 getCurrentCity 的返回值
//     // return {
//     //   label,
//     //   value
//     // }
//   })
// }

// promise
const getCurrentCity = () => {

  const myCity = JSON.parse(localStorage.getItem('hkzf_city'))
  console.log(myCity)
  
  if (!myCity) {
    return new Promise(resolve => {
      const myCity = new BMap.LocalCity()

      myCity.get(async result => {
        const { name } = result
        const res = await API.get('/area/info', {
          params: {
            name
          }
        })

        const { label, value } = res.data.body
        // 异步操作成功,调用resolve(), 将数据作为 resolve 的参数来传递
        resolve({ label, value })

        localStorage.setItem('hkzf_city', JSON.stringify({ label, value }))
      })
    })
  } else {
    return Promise.resolve(myCity)
  }

}

export { getCurrentCity, BASE_URL, API }