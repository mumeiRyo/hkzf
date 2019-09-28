import React, { Component } from 'react'

import { getCurrentCity, API } from '../../utils'

import NavHeader from '../../components/NavHeader'

import { Toast } from 'antd-mobile'

import styles from './index.module.scss'

import "./index.scss"

// import Axios from 'axios'

import classnames from 'classnames'
// navigator.geolocation.getCurrentPosition((position) => {
//   // position 当前定位的位置信息
//   // 能够获取到 经纬度 信息
//   console.log(position)
// })

// 注意： React 脚手架中要求全局变量需要使用 window 来访问
const BMap = window.BMap

// 覆盖物样式
const labelStyle = {
  cursor: 'pointer',
  border: '0px solid rgb(255, 0, 0)',
  padding: '0px',
  whiteSpace: 'nowrap',
  fontSize: '12px',
  color: 'rgb(255, 255, 255)',
  textAlign: 'center'
}
export default class Map extends Component {
  state = {
    isShowHouseList: false,
    list: []
  }
  async componentDidMount() {
    // 1 创建百度地图的实例对象
    const map = new BMap.Map('container')
    this.map = map
    const { label, value } = await getCurrentCity()
    console.log({ label, value });
    // 3 初始化地图，并且设置地图缩放级别
    const myGeo = new BMap.Geocoder()
    // 将地址解析结果显示在地图上,并调整地图视野
    myGeo.getPoint(label, async point => {
      map.centerAndZoom(point, 11)

      // 添加控件
      map.addControl(new BMap.NavigationControl())
      map.addControl(new BMap.ScaleControl())
      // map.addOverlay(new BMap.Marker(point));

      // 渲染覆盖物的入口
      // 作用：
      //  1 根据 id 获取房源数据
      //  2 调用 getTypeAndZoom() 方法来获取到要渲染的覆盖物类型以及下一级缩放级别


      this.renderOverlays(value)

    }, label)
  }

  // 封装覆盖物的方法
  async renderOverlays(id) {
    Toast.loading('加载中', 0)
    const res = await API.get('/area/map', {
      params: {
        id
      }
    })
    Toast.hide()

    const { type, level } = this.getTypeAndZoom()
    res.data.body.forEach(item => {
      this.createOverlays(type, level, item)
    })

  }

  // 获取覆盖物类型一级下一级缩放级别
  getTypeAndZoom() {
    const zoom = this.map.getZoom()

    let type, nextLevel

    if (zoom === 11 || zoom === 13) {
      // 区或镇
      type = 'circle'
      nextLevel = zoom + 2
    } else if (zoom === 15) {
      type = 'react'
    }
    return {
      type,
      level: nextLevel
    }
  }

  // 接收数据, 根据覆盖物的类型决定调用哪个方法来创建对应的覆盖物
  createOverlays(type, level, data) {
    const {
      coord: { latitude, longitude },
      label,
      count,
      value
    } = data
    const point = new BMap.Point(longitude, latitude)

    if (type === 'circle') {
      this.createCircle(point, label, count, value, level)
    } else {
      this.createRect(point, label, count, value)
    }

  }

  createCircle(point, areaName, count, id, level) {
    // 创建文本覆盖物
    const opts = {
      // 指定文本标注所在的地理位置
      position: point,
      //设置文本偏移量
      offset: new BMap.Size(-35, -35)
    }

    // 创建文本标注对象
    // 因为通过 setContent 方法设置过内容了，所以，第一个参数中字符串内容就无效了
    const label = new BMap.Label('', opts)

    label.setContent(`
      <div class="bubble">
        <p class="name">${areaName}</p>
        <p>${count}套</p>
      </div>
    `)
    // 文本标注的样式
    label.setStyle(labelStyle)
    // 给 label 覆盖物绑定单击事件
    label.addEventListener('click', () => {
      // console.log('覆盖物被点击了', id)
      // 放大地图
      this.map.centerAndZoom(point, level)
      // 清除地图中所有的覆盖物
      setTimeout(() => {
        this.map.clearOverlays()
      }, 0)

      // 获取当前区下所有镇的数据，渲染覆盖物在地图中
      this.renderOverlays(id)
    })

    // 将覆盖物添加到地图中
    this.map.addOverlay(label)
  }
  // 创建小区覆盖物
  createRect(point, areaName, count, id) {
    // 创建文本覆盖物
    const opts = {
      // 指定文本标注所在的地理位置
      position: point,
      //设置文本偏移量
      offset: new BMap.Size(-50, -28)
    }
    // 创建文本标注对象
    // 因为通过 setContent 方法设置过内容了，所以，第一个参数中字符串内容就无效了
    const label = new BMap.Label('', opts)

    // 设置 HTML 内容
    // 注意：这个方法接收的参数是原生的HTML不是 JSX！！！
    label.setContent(`
      <div class="rect">
        <span class="housename">${areaName}</span>
        <span class="housenum">${count}套</span>
        <i class="arrow"></i>
      </div>
    `)

    // 文本标注的样式
    label.setStyle(labelStyle)

    // 给 label 覆盖物绑定单击事件
    // debugger
    label.addEventListener('click', e => {
      console.log(e)
      const { clientX, clientY } = e.changedTouches[0]
      const x = window.innerWidth / 2 - clientX
      const y = (window.innerHeight - 330 - 45) / 2 +45 - clientY
      this.map.panBy(x, y)

      // console.log('小区被点击了', id)
      // 发送请求获取小区数据
      Toast.loading('加载中', 0)

      this.getHouseList(id)
    })

    // 将覆盖物添加到地图中
    this.map.addOverlay(label)
  }

  // 获取小区下的房源列表数据
  async getHouseList(id) {
    const res = await API.get('/houses', {
      params: {
        cityId: id
      }
    })

    Toast.hide()

    this.setState({
      list: res.data.body.list,
      isShowHouseList: true
    })
    // Axios
    //   .get('http://localhost:8080/houses', {
    //     params: {
    //       cityId: id
    //     }
    //   })
    //   .then(res => {
    //     // console.log('小区下的房源数据：', res)

    //     this.setState({
    //       list: res.data.body.list,
    //       isShowHouseList: true
    //     })
    //   })
  }

  // 渲染房源列表
  renderHouseList() {
    const { list } = this.state
    // console.log(list)
    return list.map(v => (
      <div className={styles.houseItems} key={v.houseCode}>
        <div className={styles.house}>
          <div className={styles.imgWrap}>
            <img
              className={styles.img}
              src={`http://localhost:8080${v.houseImg}`}
              alt=""
            />
          </div>
          <div className={styles.content}>
            <h3 className={styles.title}>
              {v.title}
            </h3>
            <div className={styles.desc}>{v.desc}</div>
            <div>
              {v.tags.map((tag, index) => {
                const tagClass = index > 2 ? 'tag3' : `tag${index + 1}`

                return (
                  <span key={index} className={classnames(styles.tag, styles[tagClass])}>
                    {tag}
                  </span>
                )
              })}
            </div>
            <div className={styles.price}>
              <span className={styles.priceNum}>{v.price}</span> 元/月
                </div>
          </div>
        </div>
      </div>
    ))
  }

  render() {
    const { isShowHouseList } = this.state
    return (
      <div className="map">
        {/* 顶部导航栏 */}
        <NavHeader className="map-header">地图找房</NavHeader>
        {/* 地图容器 */}
        <div id="container" />
        {/* // 房屋列表结构 */}
        <div className={classnames(styles.houseList, {
          [styles.show]: isShowHouseList
        })}>
          <div className={styles.titleWrap}>
            <h1 className={styles.listTitle}>房屋列表</h1>
            <a className={styles.titleMore} href="/house/list">
              更多房源
            </a>
          </div>
          <>
            {this.renderHouseList()}
          </>
        </div>
      </div>
    )
  }
}