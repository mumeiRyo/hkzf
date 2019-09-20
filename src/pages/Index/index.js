import React, { Component } from 'react'
import { Carousel, Flex, Grid, WingBlank } from 'antd-mobile';

import axios from 'axios'

import './index.scss'


// 导入本地图片
import nav1 from '../../assets/images/nav-1.png'
import nav2 from '../../assets/images/nav-2.png'
import nav3 from '../../assets/images/nav-3.png'
import nav4 from '../../assets/images/nav-4.png'

const BMap = window.BMap
// 导航栏
const navList = [
  { imgSrc: nav1, title: '整租', path: '/home/list' },
  { imgSrc: nav2, title: '合租', path: '/home/list' },
  { imgSrc: nav3, title: '地图找房', path: '/map' },
  { imgSrc: nav4, title: '去出租', path: '/rent/add' }
]

export default class index extends Component {
  state = {
    swipers: [],
    imgHeight: 212,
    isShow: false,
    groups: [],
    news: [],
    cityname:'上海'
  }
  componentDidMount() {
    this.getSwipers()
    // console.log("1",this)
    this.getGroups()
    // 获取最新资讯
    this.getNews()

    const myCity = new BMap.LocalCity()
    myCity.get(async result => {
      console.log('IP定位获取到当前城市信息为：', result)
      // name 就是定位自动获取到的城市名称
      const { name } = result

      const res = await axios.get('http://localhost:8080/area/info', {
        params: {
          name
        }
      })

      console.log(res)
      this.setState({
        cityName: res.data.body.label
      })
    })
  }

  async getSwipers() {
    // console.log("2",this)
    const res = await axios.get('http://localhost:8080/home/swiper')
    // console.log("3", res);
    this.setState({
      swipers: res.data.body,
      isShow: true
    })
  }

  // 获取租房小组数据
  async getGroups() {
    const { data } = await axios.get('http://localhost:8080/home/groups?area=AREA%7C88cff55c-aaa4-e2e0')
    // console.log(res)
    this.setState({
      groups: data.body
    })
  }

  // 获取最新资讯
  async getNews() {
    const res = await axios.get('http://localhost:8080/home/news?area=AREA%7C88cff55c-aaa4-e2e0')
    this.setState({
      news: res.data.body
    })
  }

  // 渲染导航栏
  renderNavList() {
    // console.log("渲染导航组件",this)
    return navList.map(item => (
      <Flex.Item key={item.title} onClick={() => this.props.history.push(item.path)}>
        <img src={item.imgSrc} alt="" />
        <p>{item.title}</p>
      </Flex.Item>
    ))
  }

  // 渲染最新资讯
  renderNews() {
    return this.state.news.map(item => (
      <div className="news-item" key={item.id}>
        <div className="imgwrap">
          <img
            className="img"
            src={`http://localhost:8080${item.imgSrc}`}
            alt=""
          />
        </div>
        <Flex className="content" direction="column" justify="between">
          <h3 className="title">{item.title}</h3>
          <Flex className="info" justify="between">
            <span>{item.from}</span>
            <span>{item.date}</span>
          </Flex>
        </Flex>
      </div>
    ))
  }

  // 渲染轮播图
  renderCarousel() {
    return this.state.swipers.map(item => (
      <a
        key={item.id}
        href="http://www.alipay.com"
        style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
      >
        <img
          src={`http://localhost:8080${item.imgSrc}`}
          alt=""
          style={{ width: '100%', verticalAlign: 'top' }}
          onLoad={() => {
            // fire window resize event to change height
            // 为了改变图片的高度，触发window的resize事件
            window.dispatchEvent(new Event('resize'));
            this.setState({ imgHeight: 'auto' });
          }}
        />
      </a>
    ))
  }

  render() {
    return (
      <div className="index">
        <div className="carousel-wrap">
          {/* 顶部导航搜索栏 */}
          <Flex className="search-nav">
            {/* 左边 */}
            <Flex className="search-left">
              <div onClick={() => this.props.history.push("/citylist")}>
                <span>{this.state.cityname}</span>
                <i className="iconfont icon-arrow"></i>
              </div>
              <div className="form" onClick={() => this.props.history.push("/search")}>
                <i className="iconfont icon-seach"></i>
                <span>请输入小区或地址</span>
              </div>
            </Flex>
            <i className="iconfont icon-map" onClick={() => this.props.history.push('/map')}></i>
          </Flex>
          {this.state.isShow && (
            <Carousel
              autoplay
              infinite
            >
              {this.renderCarousel()}
            </Carousel>
          )}
          <Flex id="nav">
            {this.renderNavList()}
          </Flex>
          {/* 租房小组 */}
          <div className="groups">
            <Flex className="groups-title" justify="between">
              <h3>租房小组</h3>
              <span>更多</span>
            </Flex>
            {/* rendeItem 属性：用来 自定义 每一个单元格中的结构 */}
            <Grid
              data={this.state.groups}
              columnNum={2}
              square={false}
              activeStyle
              hasLine={false}
              renderItem={item => (
                <Flex className="grid-item" justify="between">
                  <div className="desc">
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                  <img src={`http://localhost:8080${item.imgSrc}`} alt="" />
                </Flex>
              )}
            />
          </div>
          {/* 最新资讯 */}
          <div className="news">
            <h3 className="group-title">最新资讯</h3>
            <WingBlank size="md">{this.renderNews()}</WingBlank>
          </div>
        </div>
      </div>
    );
  }
}
