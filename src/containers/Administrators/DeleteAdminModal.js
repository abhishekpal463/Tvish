import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import adminInfoService from '@/services/adminInfoService';
import {
  message,
  Modal,
  Spin
} from 'antd';
import {
  authError,
  fetchAdminList
} from '@/actions';

@connect(
  state => ({
    adminId: state.auth.admin.adminId,
    token: state.auth.admin.token
  }),
  dispatch => ({
    authError: (errorMessage) => authError(errorMessage),
    fetchAdmins: (adminId, token) => dispatch(fetchAdminList(adminId, token))
  })
)
export default class DeleteAdminModal extends React.Component {
  static propTypes = {
    adminId: PropTypes.number.isRequired,
    token: PropTypes.string.isRequired,
    visible: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    handleCancel: PropTypes.func.isRequired,
    value: PropTypes.object.isRequired
  }

  fetchAdmins = async () => {
    const {
      adminId,
      token,
      fetchAdmins
    } = this.props

    await fetchAdmins(adminId, token)
  }

  handleConfirm = async () => {
    const {
      adminId,
      token,
      value
    } = this.props
    const administratorId = value.administratorId

    try {
      await adminInfoService.remove(adminId, token, administratorId)
      message.success("successfully deleted")
      this.props.fetchAdmins(adminId, token)
      this.props.handleSubmit()
    } catch (err) {
      if (err.message === undefined) {
        const errorMessage = 'The server went wrong, please wait patiently thank you'
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
      this.props.handleCancel()
    }
  }

  render() {
    const {
      value
    } = this.props

    const nickName = value ? value.nickName : ''

    return (
      <Modal
        title = {
          `Delete administrator`
        }
        visible={this.props.visible}
        okText = "confirm"
        cancelText = "cancel"
        onOk={this.handleConfirm}
        onCancel={this.props.handleCancel}
      >
        <p>
          {
            nickName ? (
              'Confirm to delete the administrator:' + nickName
            ) : ''
          }
        </p>
      </Modal>
    )
  }
}
