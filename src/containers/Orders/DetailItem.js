import React from 'react';
import PropTypes from 'prop-types';
import {
  Row,
  Col
} from 'antd';

function DetailItem(props) {
  const {
    detail
  } = props

  return (
    <Row>
      <Col span={7}>
        Numbering: {
          detail.goodId
        }
      </Col>
      <Col span={7}>
        name: {
          detail.good.goodName
        }
      </Col>
      <Col span={7}>
        Quantity： {
          detail.count
        }
      </Col>
      {/* <Col span={6}></Col> */}
    </Row>
  )
}

DetailItem.propTypes = {
  detail: PropTypes.shape({
    goodId: PropTypes.number.isRequired,
    good: PropTypes.shape({
      goodName: PropTypes.string.isRequired
    }),
    count: PropTypes.number.isRequired
  }).isRequired
}

export default DetailItem
