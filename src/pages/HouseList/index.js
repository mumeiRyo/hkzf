import React, { Component } from 'react'

import { Flex } from 'antd-mobile'

import { List, AutoSizer, WindowScroller, InfiniteLoader } from 'react-virtualized'

import SearchHeader from '../../components/SearchHeader'
import HouseItem from '../../components/HouseItem'

import { API, getCurrentCity } from '../../utils'

// 导入筛选条件组件
import Filter from './components/Filter'

import styles from './index.module.scss'

export default class HouseList extends Component {

  state = {
    // 总条数
    count: 0,
    list: [],
    cityName: '上海'
  }

  // 生命周期钩子函数componentDidMount, 挂载阶段执行
  async componentDidMount() {
    const { value, label } = await getCurrentCity()
    this.cityId = value

    this.setState({
      cityName: label
    })

    this.searchHouseList()
  }

  // 接收到 Filter 组件中获取到的所有筛选条件数据
  onFilter = filters => {
    this.filters = filters
    // console.log(filters)
    this.searchHouseList()
  }

  async searchHouseList() {
    const res = await API.get('/houses', {
      params: {
        ...this.filters,
        cityId: this.cityId,
        start: 1,
        end: 20
      }
    })

    // console.log(res.data)
    const { list, count } = res.data.body

    this.setState({
      list,
      count
    })
  }

  rowRenderer = ({ key, index, style }) => {
    const { list } = this.state
    const item = list[index]

    if (!item) {
      // 数据加载中
      return (
        <div key={key} style={style}>
          <p className={styles.loading} />
        </div>
      )
    }

    return <HouseItem key={key} {...item} style={style} />
  }

  // isRowLoaded用来判断是否加载完每一行
  isRowLoaded = ({ index }) => {
    return !!this.state.list[index]
  }

  // loadMoreRows用来加载更多数据
  loadMoreRows = ({ startIndex, stopIndex }) => {
    return new Promise(async resolve => {
      const res = await API.get('/houses', {
        params: {
          ...this.filters,
          cityId: this.cityId,
          start: startIndex,
          end: stopIndex
        }
      })

      console.log(res)
      // 数据加载完成后, 完成该 Promise
      resolve()

      const { list, count } = res.data.body
      this.setState({
        // 追加数据, 而不是覆盖数据
        list: [...this.state.list, ...list],
        count
      })
    })
  }


  render() {
    const { cityName, count } = this.state
    return (
      <div className={styles.root}>
        {/* 搜索导航栏 */}
        <Flex className={styles.houseNav}>
          <i className="iconfont icon-back" />
          <SearchHeader className={styles.search} cityName={cityName} />
        </Flex>

        {/* 条件筛选栏组件 */}
        <Filter onFilter={this.onFilter} />

        {/* 房源列表 */}
        <InfiniteLoader
          rowCount={count}
          isRowLoaded={this.isRowLoaded}
          loadMoreRows={this.loadMoreRows}
        >
          {({ onRowsRendered, registerChild }) => (
            <WindowScroller>
              {({ height, isScrolling, scrollTop }) => (
                <AutoSizer>
                  {({ width }) => (
                    <List
                      onRowsRendered={onRowsRendered}
                      ref={registerChild}
                      autoHeight
                      height={height - 45}
                      isScrolling={isScrolling}
                      scrollTop={scrollTop}
                      width={width}
                      rowCount={count}
                      rowHeight={120}
                      rowRenderer={this.rowRenderer}
                    />
                  )}
                </AutoSizer>
              )}
            </WindowScroller>
          )}
        </InfiniteLoader>
      </div>
    )
  }
}
