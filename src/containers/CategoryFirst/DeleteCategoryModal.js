import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import categoryFirstService from '@/services/categoryFirstService';
import {
  message,
  Modal,
  Spin
} from 'antd';
import {
  authError,
  fetchCategories
} from '@/actions';

@connect(
  state => ({
    adminId: state.auth.admin.adminId,
    token: state.auth.admin.token
  }),
  dispatch => ({
    authError: (errorMessage) => dispatch(authError(errorMessage)),
    fetchCategories: () => dispatch(fetchCategories())
  })
)
export default class DeleteCategoryModal extends React.Component {
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
    const categoryFirstId = value.categoryFirstId

    try {
      await categoryFirstService.remove(adminId, token, categoryFirstId)
      message.success("successfully deleted")
      this.props.fetchCategories()
      this.props.handleSubmit()
    } catch (err) {
      if (err.message === undefined) {
        const errorMessage = 'The server went wrong, please wait patiently,thank you'
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
      this.props.fetchCategories()
      this.props.handleCancel()
    }
  }

  render() {
    const {
      value
    } = this.props

    const categoryName = value ? value.categoryName : ''

    return (
      <Modal
       title = {
         `Delete Category`
       }
       visible = {
         this.props.visible
       }
       okText = "Confirm"
       cancelText = "Cancel"
        onOk={this.handleConfirm}
        onCancel={this.props.handleCancel}
      >
        <p>
          {
            categoryName ? (
             'Confirm to delete classification information:' + categoryName
            ) : ''
          }
        </p>
      </Modal>
    )
  }
}
