import React, { Component } from 'react'

import NavHeader from '../../components/NavHeader'
import "./index.scss"

// navigator.geolocation.getCurrentPosition((position) => {
//   // position 当前定位的位置信息
//   // 能够获取到 经纬度 信息
//   console.log(position)
// })

// 注意： React 脚手架中要求全局变量需要使用 window 来访问
const BMap = window.BMap

export default class Map extends Component {
  componentDidMount() {
    // 1 创建百度地图的实例对象
    const map = new BMap.Map('container')
    // 2 创建坐标实例对象
    const point = new BMap.Point(121.61877564427125, 31.04049891339984)
    // 3 初始化地图，并且设置地图缩放级别
    map.centerAndZoom(point, 15)
  }

  render() {
    return (
      <div className="map">
        {/* 地图容器 */}
      <NavHeader className="map-header"></NavHeader>
      <div id="container" />
      </div>
    )
  }
}