import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import advService from '@/services/advService';
import {
  message,
  Modal,
  Spin
} from 'antd';
import {
  authError,
  getAllAdvs
} from '@/actions';

@connect(
  state => ({
    adminId: state.auth.admin.adminId,
    token: state.auth.admin.token
  }),
  dispatch => ({
    authError: (errorMessage) => dispatch(authError(errorMessage)),
    fetchAdvs: () => dispatch(getAllAdvs())
  })
)
export default class DeleteAdvModal extends React.Component {
  static propTypes = {
    adminId: PropTypes.number.isRequired,
    token: PropTypes.string.isRequired,
    visible: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    handleCancel: PropTypes.func.isRequired,
    value: PropTypes.object.isRequired
  }

  handleConfirm = async () => {
    const {
      adminId,
      token,
      value
    } = this.props
    const advSwiperId = value.advSwiperId

    try {
      await advService.remove(adminId, token, advSwiperId)
      message.success("successfully deleted")
      this.props.fetchAdvs()
      this.props.handleSubmit()
    } catch (err) {
      if (err.response === undefined) {
        const errorMessage = 'The server went wrong, please wait patiently, please wait patiently for one year, thank you'
        this.props.authError(errorMessage)
      }
      if (err.response.status === 401) {
        const errorMessage = 'Your login has expired, please log in again'
        this.props.authError(errorMessage)
      }
      // 删除不成功
      if (err.response.status === 400 || err.response.status === 404) {
        const errorMessage = err.response.data.message
        message.error(errorMessage)
      }
      this.props.fetchAdvs()
      this.props.handleCancel()
    }
  }

  render() {
    const {
      value
    } = this.props

    const name = value ? value.name : ''

    return (
      <Modal
        title = {
          `Delete ads`
        }
        visible={this.props.visible}
        okText = "confirm"
        cancelText = "cancel"
        onOk={this.handleConfirm}
        onCancel={this.props.handleCancel}
      >
        <p>
          {
            name ? (
            'Confirm that you want to delete the ad:' + name
            ) : ''
          }
        </p>
      </Modal>
    )
  }
}
