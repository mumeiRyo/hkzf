import React, { Component } from "react"

import { TabBar } from "antd-mobile"
import { Route } from "react-router-dom"

import "./index.css"

import Index from '../Index'
import HouseList from '../HouseList'
import News from '../News'
import Profile from '../Profile'

const tabBarItems = [
  { title: '首页', icon: 'icon-ind', path: '/home' },
  { title: '找房', icon: 'icon-findHouse', path: '/home/list' },
  { title: '资讯', icon: 'icon-infom', path: '/home/news' },
  { title: '我的', icon: 'icon-my', path: '/home/profile' }
]

export default class Home extends Component {
  state = {
    selectedTab: this.props.location.pathname
  }
  // 渲染tabBar 

  componentDidUpdate(prevProps) {
    // console.log(prevProps, this.props)
    const { pathname } = this.props.location
    if ( prevProps.location.pathname !== pathname ) {
      this.setState({
        selectedTab: pathname
      })
    }
    
  }

  renderTabBar() {
    return tabBarItems.map(x => (
      <TabBar.Item
        title={x.title}
        key={x.path}
        icon={<i className={`iconfont ${x.icon}`}></i>}
        selectedIcon={<i className={`iconfont ${x.icon}`}></i>}
        selected={this.state.selectedTab === x.path}
        onPress={() => {
          this.setState({
            selectedTab: x.path
          })
          this.props.history.push(x.path)
        }}
        data-seed="logId"
      >
      </TabBar.Item>
    ))
  }

  render() {
    return (
      <div className="home" >
        {/* 配置子路由 */}
        <Route exact path="/home" component={Index}></Route>
        <Route path="/home/list" component={HouseList}></Route>
        <Route path="/home/news" component={News}></Route>
        <Route path="/home/profile" component={Profile}></Route>
        <div className="tabbar">
          <TabBar
            tintColor="#21b97a"
          >
            {this.renderTabBar()}
          </TabBar>
          
        </div>
      </div>
    )
  }
}
