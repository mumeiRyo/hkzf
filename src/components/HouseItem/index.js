import React from 'react'

import classnames from 'classnames'

import styles from './index.module.scss'

import PropTypes from 'prop-types'


function HouseItem({ houseImg, title, desc, tags, price, onClick, style }) {
  return (
    <div className={styles.house} onClick={onClick} style={style}>
      <div className={styles.imgWrap}>
        <img
          className={styles.img}
          src={`http://localhost:8080${houseImg}`}
          alt=""
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>
          {title}
        </h3>
        <div className={styles.desc}>{desc}</div>
        <div>
          {tags.map((tag, index) => {
            const tagClass = index > 2 ? 'tag3' : `tag${index + 1}`

            return (
              <span key={index} className={classnames(styles.tag, styles[tagClass])}>
                {tag}
              </span>
            )
          })}
        </div>
        <div className={styles.price}>
          <span className={styles.priceNum}>{price}</span> 元/月
        </div>
      </div>
    </div>
  )
}

HouseItem.propTypes = {
  houseImg: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  tags: PropTypes.array.isRequired,
  price: PropTypes.number.isRequired,
  onClick: PropTypes.func,
  style: PropTypes.object
}

export default HouseItem
