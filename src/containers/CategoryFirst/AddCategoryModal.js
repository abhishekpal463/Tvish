import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Button,
  message,
  Modal,
  Form,
  Input
} from 'antd';
import {
  authError,
  fetchCategories
} from '../../actions';
import categoryFirstService from '../../services/categoryFirstService';

const FormItem = Form.Item

@connect(
  state => ({
    adminId: state.auth.admin.adminId,
    token: state.auth.admin.token
  }),
  dispatch => ({
    authError: (errorMessage) => authError(errorMessage),
    fetchCategories: () => dispatch(fetchCategories())
  })
)
@Form.create()
export default class AddCategoryModal extends React.Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    handleCancel: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    authError: PropTypes.func.isRequired,
    fetchCategories: PropTypes.func.isRequired
  }

  handleSubmit = (e) => {
    e.preventDefault()

    this.props.form.validateFields((err, values) => {
      console.log(values)
      if (err) {
        return ;
      }

      this.postCategory(values.categoryName)
    })
  }

  postCategory = async (categoryName) => {
    const {
      adminId,
      token
    } = this.props

    try {
      const res = await categoryFirstService.create(
        adminId,
        token,
        categoryName
      )
      message.success('Added new category successfully')
      this.props.fetchCategories()
      this.props.handleSubmit()
    } catch (err) {
      if (err.message === undefined) {
        const errorMessage = 'The server went wrong, please wait patiently, thank you'
        this.props.authError(errorMessage)
      }
      if (err.response.status === 401) {
        const errorMessage = 'Your login has expired, please log in again'
        this.props.authError(errorMessage)
      }
      // 添加不成功
      if (err.response.status === 400) {
        const errorMessage = err.response.data.message
        message.error(errorMessage)
      }
    }
  }

  render() {
    const {
      visible,
      handleCancel,
      handleSubmit,
      form
    } = this.props

    const { getFieldDecorator } = form

    return (
      <Modal
        visible={visible}
        title = "New category"
        okText = "Save"
        cancelText = "Cancel"
        onCancel={handleCancel}
        onOk={this.handleSubmit}
      >
        <Form layout="vertical">
          < FormItem label = "Category Name" >
            {getFieldDecorator('categoryName', {
              rules: [{
             required: true,
               message: 'Please enter the category name'
             }, {
               max: 10,
               min: 1,
               message: 'Product name cannot exceed 10 characters'
              }]
            })(
              <Input type="text" />
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}
