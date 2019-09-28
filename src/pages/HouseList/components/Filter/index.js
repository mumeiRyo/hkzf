import React, { Component } from 'react'

// 导入三个子组件
import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'

import { API } from '../../../../utils'

import styles from './index.module.css'

// 标题高亮状态对象
// 键： 表示每个标题的 type （类型）
// 值： 布尔值，如果为true表示高亮；为false，表示不亮
const titleSelectedStatus = {
  area: false,
  mode: false,
  price: false,
  more: false
}

export default class Filter extends Component {
  state = {
    // 标题高亮状态对象
    titleSelectedStatus,
    // 展示对话框的类型，如果为 空字符串，表示不展示任何一个对话框
    openType: '',
    // 所有的筛选条件数据
    filtersData: {},
    // 每个标题对应的选中条件对象
    selectedValues: {
      area: ['area', 'null'], // 选中值 ['subway', 'null'] 或 ['subway', '5号线', 'null'] 或 ['area', 'adsfasdfasdf', 'null']
      mode: ['null'], // 选中值 ['false']
      price: ['null'], // 选中值 ['PRICE|2000']
      more: []
    }
  }

  componentDidMount() {
    this.getFiltersData()
  }

  // 获取所有筛选条件数据
  async getFiltersData() {
    const res = await API.get('http://localhost:8080/houses/condition', {
      params: {
        id: 'AREA|88cff55c-aaa4-e2e0'
      }
    })

    this.setState({
      filtersData: res.data.body
    })
  }

  // 标题被点击时触发的回调函数
  changeTitle = type => {
    // console.log('父组件 Filter 中获取到子组件传递过来的类型为:', type)
    /* 
      ① 在标题点击事件 onTitleClick 方法中，获取到两个状态：标题选中状态对象和筛选条件的选中值对象。
      ② 根据当前标题选中状态对象，获取到一个新的标题选中状态对象（newTitleSelectedStatus）。
      ③ 使用 Object.keys() 方法，遍历标题选中状态对象。
      ④ 先判断是否为当前标题，如果是，直接让该标题选中状态为 true（高亮）。
      ⑤ 否则，分别判断每个标题的选中值是否与默认值相同。
      ⑥ 如果不同，则设置该标题的选中状态为 true。
      ⑦ 如果相同，则设置该标题的选中状态为 false。
      ⑧ 更新状态 titleSelectedStatus 的值为：newTitleSelectedStatus。
    */
    // 选中状态对象：titleSelectedStatus => { area: true, mode: false }
    // 选中值对象：  selectedValues => { are: ['area', 'null'], mode: ['null'] }
    const { titleSelectedStatus, selectedValues } = this.state
    const newTitleSelectedStatus = { ...titleSelectedStatus }

    // Object.keys(titleSelectedStatus) => ['area', 'mode', ...]
    Object.keys(titleSelectedStatus).forEach(key => {
      // 当前菜单的选中值
      const selected = selectedValues[key]

      if (type === key) {
        // 当前被点击的菜单
        newTitleSelectedStatus[key] = true
      } else if (
        key === 'area' &&
        (selected.length === 3 || selected[0] !== 'area')
      ) {
        // 区域
        newTitleSelectedStatus.area = true
      } else if (key === 'mode' && selected[0] !== 'null') {
        // 方式
        // newTitleSelectedStatus[key] = true
        newTitleSelectedStatus.mode = true
      } else if (key === 'price' && selected[0] !== 'null') {
        // 租金
        newTitleSelectedStatus.price = true
      } else if (key === 'more') {
        // 更多筛选条件，等到该组件功能完成后，再补充
      } else {
        newTitleSelectedStatus[key] = false
      }
    })

    this.setState({
      titleSelectedStatus: newTitleSelectedStatus,

      // 点击哪个标题，就让 打开对话框 的类型为这个标题的类型
      openType: type
    })
  }

  // 点击确定按钮，隐藏对话框以及遮罩层
  // 参数 value： 表示当前的选中值
  onOk = value => {
    // console.log('当前选中值为：', value, this.state.openType)
    // openType 表示当前打开对话框的类型
    const { openType, titleSelectedStatus } = this.state
    const newTitleSelectedStatus = { ...titleSelectedStatus }

    if (openType === 'area' && (value.length === 3 || value[0] !== 'area')) {
      // 区域
      newTitleSelectedStatus.area = true
    } else if (openType === 'mode' && value[0] !== 'null') {
      // 方式
      newTitleSelectedStatus.mode = true
    } else if (openType === 'price' && value[0] !== 'null') {
      // 租金
      newTitleSelectedStatus.price = true
    } else if (openType === 'more') {
      // 更多筛选条件，等到该组件功能完成后，再补充
    } else {
      newTitleSelectedStatus[openType] = false
    }

    this.setState({
      openType: '',

      titleSelectedStatus: newTitleSelectedStatus,

      selectedValues: {
        ...this.state.selectedValues,
        [openType]: value
      }
    })
  }

  // 点击取消按钮或遮罩层，隐藏对话框以及遮罩层
  onCancel = () => {
    const { openType, selectedValues, titleSelectedStatus } = this.state
    const newTitleSelectedStatus = { ...titleSelectedStatus }
    // 选中值
    const selected = selectedValues[openType]

    if (
      openType === 'area' &&
      (selected.length === 3 || selected[0] !== 'area')
    ) {
      // 区域
      newTitleSelectedStatus.area = true
    } else if (openType === 'mode' && selected[0] !== 'null') {
      // 方式
      newTitleSelectedStatus.mode = true
    } else if (openType === 'price' && selected[0] !== 'null') {
      // 租金
      newTitleSelectedStatus.price = true
    } else if (openType === 'more') {
      // 更多筛选条件，等到该组件功能完成后，再补充
    } else {
      newTitleSelectedStatus[openType] = false
    }

    this.setState({
      titleSelectedStatus: newTitleSelectedStatus,
      openType: ''
    })
  }

  // 渲染前面三个菜单对应的组件
  renderFilterPicker() {
    const {
      openType,
      filtersData: { rentType, price, area, subway },
      selectedValues
    } = this.state

    if (openType !== 'area' && openType !== 'mode' && openType !== 'price')
      return null

    // data 表示数据源
    // cols 表示列数
    let data,
      cols = 1
    // defaultValue 表示默认选中值
    const defaultValue = selectedValues[openType]

    // 因为前面三个菜单都对应到这个同一个组件，所以，需要根据菜单的类型来获取到对应的数据
    switch (openType) {
      case 'area':
        data = [area, subway]
        cols = 3
        break
      case 'mode':
        data = rentType
        break
      case 'price':
        data = price
        break
      default:
        // 手动抛出异常
        throw new Error('openType is Error~')
    }

    return (
      <FilterPicker
        key={openType}
        onCancel={this.onCancel}
        onOk={this.onOk}
        data={data}
        cols={cols}
        defaultValue={defaultValue}
        type={openType}
      />
    )

    // return openType === 'area' ||
    //   openType === 'mode' ||
    //   openType === 'price' ? (
    //   <FilterPicker onCancel={this.onCancel} onOk={this.onOk} />
    // ) : null
  }

  render() {
    const { titleSelectedStatus, openType } = this.state

    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        {openType === 'area' || openType === 'mode' || openType === 'price' ? (
          <div className={styles.mask} onClick={this.onCancel} />
        ) : null}

        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle
            titleSelectedStatus={titleSelectedStatus}
            onClick={this.changeTitle}
          />

          {/* 前三个菜单对应的内容： */}
          {this.renderFilterPicker()}

          {/* 最后一个菜单对应的内容： */}
          {/* <FilterMore /> */}
        </div>
      </div>
    )
  }
}
