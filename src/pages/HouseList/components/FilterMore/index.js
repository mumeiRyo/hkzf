import React, { Component } from 'react'

import FilterFooter from '../../../../components/FilterFooter'

import styles from './index.module.css'

import classnames from 'classnames'

export default class FilterMore extends Component {
  state = {
    selectedValues: this.props.defaultValue
  }

  handleClick = value => {
    // console.log(value)
    const { selectedValues } = this.state

    let newSelectedValues
    if (selectedValues.indexOf(value) <= -1) {
      newSelectedValues = [ ...selectedValues, value ]
    } else {
      newSelectedValues = selectedValues.filter(item => item !== value)
    }

    this.setState({
      selectedValues: newSelectedValues
    })
  }
  // 渲染标签
  renderFilters(data) {
    // 高亮类名： styles.tagActive
    return (
      data.map(item => {
        const isSelected = this.state.selectedValues.indexOf(item.value) > -1
        
        return (
          <span
            key={item.value}
            onClick={() => this.handleClick(item.value)}
            className={classnames(styles.tag, { [styles.tagActive]: isSelected})}>
              {item.label}
            </span>
        )
      })
    )
  }

  render() {
    console.log(this.props)
    const {
      data: { roomType, oriented, floor, characteristic },
      onOk,
      onCancel
    } = this.props

    const { selectedValues } = this.state

    return (
      <div className={styles.root}>
        {/* 遮罩层 */}
        <div className={styles.mask} onClick={onCancel} />

        {/* 条件内容 */}
        <div className={styles.tags}>
          <dl className={styles.dl}>
            <dt className={styles.dt}>户型</dt>
            <dd className={styles.dd}>{this.renderFilters(roomType)}</dd>

            <dt className={styles.dt}>朝向</dt>
            <dd className={styles.dd}>{this.renderFilters(oriented)}</dd>

            <dt className={styles.dt}>楼层</dt>
            <dd className={styles.dd}>{this.renderFilters(floor)}</dd>

            <dt className={styles.dt}>房屋亮点</dt>
            <dd className={styles.dd}>{this.renderFilters(characteristic)}</dd>
          </dl>
        </div>

        {/* 底部按钮 */}
        <FilterFooter 
        cancelText='清除'
        onCancel={() => this.setState({
          selectedValues: []
        })}
        onOk={() => onOk(selectedValues)}
        className={styles.footer} />
      </div>
    )
  }
}
