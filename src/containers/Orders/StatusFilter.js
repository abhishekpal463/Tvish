import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

function StatusFilter(props) {
  const {
    status,
    prefixCls,
    className
  } = props

  let content = ''
 if (status === 0) {
   content = 'Unshipped'
 } else if (status === 1) {
   content = 'Delivery'
 } else if (status === 2) {
   content = 'Completed'
 } else if (status === 3) {
   content = 'Refund in progress'
 } else if (status === -1) {
   content = 'Refund successful'
 } else {
   content = 'Refund failed'
 }

  const classes = classNames(
    className,
    {
      [`${prefixCls}-success`]: status === 2,
      [`${prefixCls}-error`]: status === 3,
      [`${prefixCls}-warning`]: status === 0,
      [`${prefixCls}`]: status === 1
    }
  )

  return (
    <span className={classes}>
      {content}
    </span>
  )
}

StatusFilter.propTypes = {
  status: PropTypes.number.isRequired
}

StatusFilter.defaultProps = {
  prefixCls: 'status'
}

export default StatusFilter
