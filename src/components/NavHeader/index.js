import React from 'react'

import { NavBar, Icon } from 'antd-mobile'
// 导入高阶组件
import { withRouter } from "react-router-dom"
// 添加属性校验
import PropTypes from 'prop-types'

import classnames from 'classnames'

function NavHeader(props) {
  return (
    <NavBar
      classID={classnames("nav-bar", props.className)}
      mode="light"
      icon={<Icon type="left" onClick={() => props.history.go(-1)} />}
      onLeftClick={() => console.log('onLeftClick')}
    >{props.children}</NavBar>
  )
}

NavHeader.propTypes = {
  children: PropTypes.string.isRequired,
  className: PropTypes.string
}
// // 给组件添加属性校验
// NavHeader.propTypes = {
//   // children 为字符串，并且是必填项
//   children: PropTypes.string.isRequired,
//   className: PropTypes.string
// }

export default withRouter(NavHeader)