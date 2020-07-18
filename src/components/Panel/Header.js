import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

function Header(props) {
  const {
    children,
    classname,
    type,
    prefixCls,
    ...otherProps
  } = props

  const classes = classNames(
    classname,
    `${prefixCls}-header`,
    {
      [`${prefixCls}-light`]: type === 'light'
    }
  )

  return (
    <header className={classes} {...otherProps}>
      {children}
    </header>
  )
}

Header.defaultProps = {
  prefixCls: 'panel'
}

Header.propTypes = {
  type: PropTypes.string,
  className: PropTypes.string
}

export default Header;
