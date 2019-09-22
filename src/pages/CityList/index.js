import React, { Component, createRef } from 'react'

import { NavBar, Icon } from 'antd-mobile';

import { List, AutoSizer } from 'react-virtualized'
import axios from 'axios'

import './index.scss'
import 'react-virtualized/styles.css';
import { getCurrentCity } from '../../utils';

import NavHeader from '../../components/NavHeader'



const formatCityList = data => {
  const cityList = {}
  // 遍历data接口返回的数据
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
// 渲染列表 数据源
// const list = Array.from(new Array(100)).map((x, i) => {
//   return `这是第${i}个元素`
// })

// function rowRenderer({ key, index, isScrolling, isVisible, style }) {
//   return (
//     <div
//       key={key}
//       style={style}
//     >
//       {list[index]} - {index} - {isScrolling + ''} => {isVisible + ''}
//     </div>
//   )
// }

// 格式化城市分类
const formatCityCategory = letter => {
  switch (letter) {
    case "#":
      return '当前定位' 
    case "hot":
      return '热门城市'
    default:
      return letter.toUpperCase()
  }
  // switch (letter) {
  //   case '#':
  //     return '当前定位'
  //   case 'hot':
  //     return '热门城市'
  //   default:
  //     return letter.toUpperCase()
  // }
}

// 创建城市列表中分类的高度和城市名称高度的常量
const CITY_INDEX_HEIGTH = 36
const CITY_NAME_HEIGTH = 50

//---------------------------------------------------------------------

export default class CityList extends Component {
  state = {
    // 城市分类列表数据
    cityList: {},
    // 城市索引列表数据
    cityIndex: [],
    // 高亮索引
    activeIndex: 0
  }

  // 创建List 组件的ref 
  listRef = createRef()

  componentDidMount() {
    this.getCityList()
    // this.listRef.current.measureAllRows()
  }
  async getCityList() {
    const res = await axios.get('http://localhost:8080/area/city', {
      params: {
        level: 1
      }
    })
    // console.log(res)
    const { cityList, cityIndex } = formatCityList(res.data.body)
    // const city = getCurrentCity(data => {
    //   console.log(data)
    // })

    // 获取热门城市数据
    const hotRes = await axios.get('http://localhost:8080/area/hot')
    // console.log(hotRes)
    cityList["hot"] = hotRes.data.body
    cityIndex.unshift("hot")

    // console.log(cityIndex)




    const { label, value } = await getCurrentCity()

    cityList['#'] = [{ label, value }]
    cityIndex.unshift('#')
    console.log('hkjhk', cityList, cityIndex);

    this.setState({
      cityList,
      cityIndex,
    },
    () => {
      this.listRef.current.measureAllRows()
    }
    )
    console.log(this.state);
  }

  rowRenderer = ({ key, index, style }) => {
    const { cityList, cityIndex } = this.state
    console.log(cityList, cityIndex)
    const letter = cityIndex[index]
    const cities = cityList[letter]
    return (
      <div
        key={key}
        style={style}
        className="city"
      >
        <div className="title">{formatCityCategory(letter)}</div>
        {cities.map(item => (
          <div key={item.value} className="name">
            {item.label}
          </div>
        ))}
      </div>
    )
  }


  // 渲染索引列表数据
  renderCityIndex() {
    const { cityIndex, activeIndex} = this.state
    return cityIndex.map((v, i) => (
      <li key={i} className="city-index-item"
        onClick={() => {
          this.listRef.current.scrollToRow(i)
        }}
      >
        <span className={activeIndex === i ? "index-active" : ''}>
          {v === 'hot' ? "热" : v.toUpperCase()}
        </span>
      </li>
    ))
  }

  // 计算每一行的高度
  // 计算公式: 标题高度 + 城市名称的高度 + 数量
  calcRowHeight = ({ index }) => {
    const { cityList, cityIndex } = this.state
    // 获取每一行的分类（字母索引）
    const letter = cityIndex[index]
    // 获取到每个分类的城市列表
    const length = cityList[letter].length

    return CITY_INDEX_HEIGTH + CITY_NAME_HEIGTH * length
  }

  // list 组件滚动
  onRowsRendered = ({ startIndex }) => {
    // startIndex 表示 可视区内渲染行的起始索引号
    // console.log(startIndex)
    if (startIndex !== this.state.activeIndex) {
      this.setState({
        activeIndex: startIndex
      })
    }
  }


  render() {
    const { cityIndex } = this.state
    return (
      <div className="citylist">
        <NavHeader>城市选择</NavHeader>
        <AutoSizer>
          {({ height, width }) => (
            <List
            ref={this.listRef}
              width={width}
              height={height - 45}
              rowCount={cityIndex.length}
              rowHeight={this.calcRowHeight}
              rowRenderer={this.rowRenderer}
              onRowsRendered={this.onRowsRendered}
              scrollToAlignment="start" // 设置对齐方式为顶部对齐, 保证这一行出现页面顶部
            />
          )}
        </AutoSizer>

        {/* 右侧索引列表数据 */}
        <ul className="city-index">{this.renderCityIndex()}</ul>
      </div>
    )
  }
}