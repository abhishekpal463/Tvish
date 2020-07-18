import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Modal,
  Form,
  Input,
  message
} from 'antd';
import {
  authError
} from '@/actions';
import goodService from '@/services/goodService';
import CategorySelector from '../../components/CategorySelector';

const FormItem = Form.Item

@connect(
  state => ({
    adminId: state.auth.admin.adminId,
    token: state.auth.admin.token
  }),
  dispatch => ({
    authError: (errorMessage) => dispatch(authError(errorMessage))
  })
)
@Form.create()
export default class UpdateGoodModal extends React.Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    handleCancel: PropTypes.func.isRequired,
    adminId: PropTypes.number.isRequired,
    token: PropTypes.string.isRequired,
    authError: PropTypes.func.isRequired
  }

  state = {
    imageChanged: false
  }

  handleCancel = () => {
    this.props.form.resetFields()
    this.props.handleCancel()
  }

  handleUpdate = (e) => {
    e.preventDefault()

    this.props.form.validateFields((err, values) => {
      console.log(values)
      if (err) {
        return ;
      }

      this.updateGood(values)
    })
  }

  updateGood = async (good) => {
    const {
      adminId,
      token,
      handleSubmit,
      authError
    } = this.props

    try {
      const res = await goodService.update(
        adminId,
        token,
        good
      )
      message.success("修改成功")
      handleSubmit()
      this.props.form.resetFields()
    } catch (err) {
      if (err.response === undefined) {
        const errorMessage = 'Server error, please try again later'
        authError(errorMessage)
        }
        if (err.response.status === 401) {
          const errorMessage = 'Your login has expired, please log in again'
        authError(errorMessage)
      }
      if (err.response.status === 400 || err.response.status === 404) {
        const errorMessage = err.response.data.message
        message.error(errorMessage)
      }
    }
  }

  render() {
    const {
      visible,
      handleCancel,
      form
    } = this.props

    const { getFieldDecorator } = form
    console.log(this.props.updateForm)
    let updateForm = this.props.updateForm || {}

    return (
      <Modal
        visible = {
          visible
        }
        title = "Update product"
        okText = "Update"
        cancelText = "Cancel"
        onCancel={this.handleCancel}
        onOk={this.handleUpdate}
      >
        <Form layout="vertical">
          < FormItem label = "productid:" >
            {getFieldDecorator('goodId', {
              initialValue: updateForm.goodId || ''
            })(
              <Input disabled />
            )}
          </FormItem>
          < FormItem label = "Commodity name:" > {
              getFieldDecorator('goodName', {
                  initialValue: updateForm.goodName || '',
                  rules: [{
                        isRequired: true,
                        message: 'Please enter the product name'
                      }, {
                        max: 20,
                        min: 1,
                        message: 'Product name cannot exceed 20 characters'
              }]
            })(
              <Input type="text" />
            )}
          </FormItem>
          < FormItem label = "Product category:" > {
              getFieldDecorator('categorySecondId', {
                  initialValue: updateForm.categorySecondId || '',
                  rules: [{
                    required: true,
                    message: 'Please select product category'
                  }]
            })(
              <CategorySelector />
            )}
          </FormItem>
          < FormItem label = "Current price:" > {
              getFieldDecorator('price', {
                  initialValue: '' + updateForm.price || '',
                  rules: [{
                        isRequired: true,
                        message: 'Please enter the product price'
                      }, {
                        max: 10,
                        min: 1,
                        message: 'Product price cannot exceed 10 digits'
              }]
            })(
              <Input type="number"/>
            )}
          </FormItem>
          < FormItem label = "Original price:" > {
              getFieldDecorator('originalPrice', {
                  initialValue: '' + updateForm.originalPrice || '',
                  rules: [{
                        isRequired: true,
                        message: 'Please enter the product price'
                      }, {
                        max: 10,
                        min: 1,
                        message: 'The original price of the product cannot exceed 10 digits'
              }]
            })(
              <Input type="number"/>
            )}
          </FormItem>
          < FormItem label = "Specifications:" > {
              getFieldDecorator('spec', {
                  initialValue: updateForm.spec || '',
                  rules: [{
                        isRequired: true,
                        message: 'Please enter product specifications'
              }]
            })(
              <Input />
            )}
          </FormItem>
          < FormItem label = "Origin:" > {
              getFieldDecorator('origin', {
                  initialValue: updateForm.origin || '',
                  rules: [{
                        isRequired: true,
                        message: 'Please enter the origin of the product'
              }]
            })(
              <Input />
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}
