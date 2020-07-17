import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Button,
  message,
  Modal,
  Form,
  Radio,
  Input
} from 'antd';
import {
  authError,
  fetchAdminList
} from '@/actions/index';
import adminInfoService from '@/services/adminInfoService';

const FormItem = Form.Item
const RadioGroup = Radio.Group

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
@Form.create()
export default class UpdateAdminModal extends React.Component {
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

  updateCategory = async (admin) => {
    const {
      adminId,
      token
    } = this.props

    try {
      const res = await adminInfoService.update(
        adminId,
        token,
        admin
      )
      message.success('Successfully modified')
      this.props.fetchAdmins(adminId, token)
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
    const administratorId = value ? value.administratorId: ''
    const passWord = value ? value.passWord : ''
    const nickName = value ? value.nickName : ''
    const phone = value ? value.phone : ''
    const superLevel = value ? value.superLevel : ''

    return (
      <Modal
        visible={visible}
        title = "Modify administrator information"
        okText = "modify"
        cancelText = "cancel"
        onCancel={handleCancel}
        onOk={this.handleSubmit}
      >
        <Form layout="vertical">
          < FormItem label = "Admin id" >
            {getFieldDecorator('administratorId', {
              require: [{
                required: true,
                message: 'Please enter the administrator id'
              }],
              initialValue: administratorId
            })(
              <Input type="text" disabled/>
            )

            }
          </FormItem>
          < FormItem label = "password" >
            {getFieldDecorator('passWord', {
              rules: [{
                required: true,
                message: 'Please enter the password'
              }, {
                max: 30,
                min: 1,
                message: 'Password cannot exceed 30 characters'
              }],
              initialValue: passWord
            })(
              <Input type="text" />
            )}
          </FormItem>
          < FormItem label = "nickname" >
            {getFieldDecorator('nickName', {
              rules: [{
                required: true,
                message: 'Please enter a nickname'
              }, {
                max: 20,
                min: 1,
                message: 'Nickname cannot exceed 20 characters'
              }],
              initialValue: nickName
            })(
              <Input type="text" />
            )}
          </FormItem>
          < FormItem label = "mobile phone number" >
            {getFieldDecorator('phone', {
              rules: [{
                required: true,
                message: 'Please enter the phone number'
              }],
              initialValue: phone
            })(
              <Input type="number" />
            )}
          </FormItem>
          < FormItem label = "Are you a super administrator" >
            {getFieldDecorator('superLevel', {
              rules: [{
                required: true,
                message: 'Please select administrator rights'
              }],
              initialValue: superLevel
            })(
              <RadioGroup>
                <Radio value={true}>Yes</Radio>
                <Radio value={false}>No</Radio>
              </RadioGroup>
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}
