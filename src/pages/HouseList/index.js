import React, { Component } from 'react'

import { Flex } from 'antd-mobile'

import SearchHeader from '../../components/SearchHeader'

// 导入筛选条件组件
import Filter from './components/Filter'

import styles from './index.module.scss'

export default class HouseList extends Component {
  render() {
    return (
      <div className={styles.root}>
        {/* 搜索导航栏 */}
        <Flex className={styles.houseNav}>
          <i className="iconfont icon-back" />
          <SearchHeader className={styles.search} cityName="上海" />
        </Flex>

        {/* 条件筛选栏组件 */}
        <Filter />
      </div>
    )
  }
}
