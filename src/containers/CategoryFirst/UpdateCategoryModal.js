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
} from '@/actions/index';
import categoryFirstService from '@/services/categoryFirstService';

const FormItem = Form.Item

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
@Form.create()
export default class UpdateCategoryModal extends React.Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    handleCancel: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    value: PropTypes.object.isRequired
  }

  handleSubmit = (e) => {
    e.preventDefault()

    this.props.form.validateFields((err, values) => {
      console.log(values)
      if (err) {
        return ;
      }

      this.updateCategory(values)
    })
  }

  updateCategory = async (category) => {
    const {
      adminId,
      token
    } = this.props

    try {
      const res = await categoryFirstService.update(
        adminId,
        token,
        category
      )
      message.success('Successfully modified')
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
      // 修改不成功
      if (err.response.status === 400 ||err.response.status === 404) {
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
      form,
      value
    } = this.props

    const { getFieldDecorator } = form
    const categoryFirstId = value ? value.categoryFirstId : ''
    const categoryName = value ? value.categoryName : ''

    return (
      <Modal
        visible={visible}
       title = "Edit category information"
       okText = "Modify"
       cancelText = "Cancel"
        onCancel={handleCancel}
        onOk={this.handleSubmit}
      >
        <Form layout="vertical">
          <FormItem label="id">
            {getFieldDecorator('categoryFirstId', {
              initialValue: categoryFirstId
            })(
              <Input type="text" disabled />
            )}
          </FormItem>
          < FormItem label = "Category Name" >
            {getFieldDecorator('categoryName', {
              rules: [{
                    required: true,
                    message: 'Please enter the category name'
                  }, {
                    max: 10,
                    min: 1,
                    message: 'Product name cannot exceed 10 characters'
              }],
              initialValue: categoryName
            })(
              <Input type="text" />
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}
