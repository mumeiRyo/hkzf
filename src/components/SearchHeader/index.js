import React from 'react'

import { Flex } from 'antd-mobile'

import { withRouter } from 'react-router-dom'

import PropTypes from 'prop-types'

import classnames from 'classnames'

import styles from './index.module.scss'

function SearchHeader({ cityName, history, className }) {
  return (
    <Flex className={classnames(styles.searchNav, className)}>
      {/* 左边 */}
      <Flex className={styles.searchLeft}>
        <div onClick={() => history.push('/citylist')}>
          <span>{cityName}</span>
          <i className="iconfont icon-arrow" />
        </div>
        <div className={styles.form} onClick={() => history.push('/search')}>
          <i className="iconfont icon-seach" />
          <span>请输入小区或地址</span>
        </div>
      </Flex>
      {/* 右边 */}
      <i className="iconfont icon-map" onClick={() => history.push('/map')} />
    </Flex>
  )
}

// 属性校验
SearchHeader.propTypes = {
  cityName: PropTypes.string.isRequired
}

export default withRouter(SearchHeader)
