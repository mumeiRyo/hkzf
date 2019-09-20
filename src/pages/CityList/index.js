import React, { Component } from 'react'

import { NavBar, Icon } from 'antd-mobile';

import { List, AutoSizer } from 'react-virtualized'
import axios from 'axios'

import './index.scss'
import 'react-virtualized/styles.css';
import { getCurrentCity } from '../../utils';


const formatCityList = data => {
  const cityList = {}
  data.forEach((x, index) => {
    
    const firstChar = x.short[0]

    if (cityList[firstChar]) {
      cityList[firstChar].push(x)
    } else {
      cityList[firstChar] = [x]
    }
  })

  const cityIndex = Object.keys(cityList).sort()

  return {
    cityList,
    cityIndex
  }
}
// 数据源
const list = Array.from(new Array(100)).map((x, i) => {
  return `这是第${i}个元素`
})

function rowRenderer({ key, index, isScrolling, isVisible, style }) {
  return (
    <div
      key={key}
      style={style}
    >
      {list[index]} - {index} - {isScrolling + ''} => {isVisible + ''}
    </div>
  )
}

export default class CityList extends Component {
  state = {
    cityList: {},
    cityIndex: []
  }
  componentDidMount() {
    this.getCityList()
  }
  async getCityList () {
    const res = await axios.get('http://localhost:8080/area/city', {
      params: {
        level: 1
      }
    })
    // console.log(res)
    const { cityList, cityIndex } = formatCityList(res.data.body)
    console.log( cityList, cityIndex )
    // const city = getCurrentCity(data => {
    //   console.log(data)
    // })
    const { label, value } = await getCurrentCity()
    cityList['#'] = [{ label, value }]
    cityIndex.unshift('#')
    // console.log( cityList, cityIndex );
    this.setState({
      cityList,
      cityIndex
    })
  }

  render() {
    return (
      <div className="citylist">
        <NavBar
          id="nav-bar"
          mode="light"
          icon={<Icon type="left" onClick={() => this.props.history.go(-1)} />}
          onLeftClick={() => console.log('onLeftClick')}
        >城市选择</NavBar>
        <AutoSizer>
          {({ height, width }) => (
            <List
              width={width}
              height={height - 45}
              rowCount={list.length}
              rowHeight={20}
              rowRenderer={rowRenderer}
            />
          )}
        </AutoSizer>,
      </div>
    )
  }
}