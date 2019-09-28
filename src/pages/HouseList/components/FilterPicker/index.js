import React, { Component } from 'react'

import { PickerView } from 'antd-mobile'

import FilterFooter from '../../../../components/FilterFooter'

export default class FilterPicker extends Component {
  // constructor(props) {
  //   super(props)
  //   console.log('FilterPicker 挂载')
  //   this.state = {
  //     // 默认选中值
  //     value: this.props.defaultValue
  //     // value: ['area', 'AREA|6524c161-1f81-d73c', 'AREA|de401dd0-362e-47a9']
  //   }
  // }

  state = {
    // 默认选中值
    value: this.props.defaultValue
    // value: ['area', 'AREA|6524c161-1f81-d73c', 'AREA|de401dd0-362e-47a9']
  }

  // componentDidUpdate(prevProps) {
  //   // prevProps 表示上一次的值
  //   // this.props 表示最新的值
  //   // console.log('FilterPicker 更新', this.props, prevProps)
  //   if (this.props.type !== prevProps.type) {
  //     this.setState({
  //       // 在菜单切换时，获取到最新的选中值，然后，更新 value 即可
  //       value: this.props.defaultValue
  //     })
  //   }
  // }

  componentWillUnmount() {
    console.log('FilterPicker 组件被卸载了')
  }

  // 获取选中值
  handleChange = value => {
    // console.log(value)
    this.setState({
      value
    })
  }

  render() {
    const { onCancel, onOk, data, cols } = this.props
    const { value } = this.state

    return (
      <>
        {/* 选择器组件： 受控组件的使用方式 */}
        <PickerView
          data={data}
          cols={cols}
          value={value}
          onChange={this.handleChange}
        />

        {/* 底部按钮 */}
        <FilterFooter onCancel={onCancel} onOk={() => onOk(value)} />
        {/* <FilterFooter onCancel={() => onCancel()} /> */}
      </>
    )
  }
}
