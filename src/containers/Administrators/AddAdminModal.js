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
} from '../../actions';
import adminInfoService from '../../services/adminInfoService';

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
export default class AddAdminModal extends React.Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    handleCancel: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    authError: PropTypes.func.isRequired,
    fetchAdmins: PropTypes.func.isRequired
  }

  fetchAdmins = async () => {
    const {
      adminId,
      token,
      fetchAdmins
    } = this.props

    await fetchAdmins(adminId, token)
  }

  handleSubmit = (e) => {
    e.preventDefault()

    this.props.form.validateFields((err, values) => {
      if (err) {
        return ;
      }

      this.postAdmin(values.userName, values.passWord, values.nickName, values.phone, values.superLevel)
    })
  }

  postAdmin = async (userName, passWord, nickName, phone, superLevel) => {
    const {
      adminId,
      token
    } = this.props

    try {
      const res = await adminInfoService.create(
        adminId,
        token,
        {
          userName,
          passWord,
          nickName,
          phone,
          superLevel
        }
      )
      message.success('New administrator added successfully')
      this.props.fetchAdmins(adminId, token)
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
        title = "Add administrator"
        okText = "Add to"
        cancelText = "cancel"
        onCancel={handleCancel}
        onOk={this.handleSubmit}
      >
        <Form layout="vertical">
          < FormItem label = "username" >
            {getFieldDecorator('userName', {
              rules: [{
                required: true,
                message: 'please enter user name'
              }, {
                max: 30,
                min: 1,
                message: 'User name cannot exceed 30 characters'
              }]
            })(
              <Input type="text" />
            )}
          </FormItem>
          < FormItem label = "password" >
            {getFieldDecorator('passWord', {
              rules: [{
                required: true,
                message: 'Please enter password'
              }, {
                max: 30,
                min: 1,
                message: 'Password cannot exceed 30 characters'
              }]
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
              }]
            })(
              <Input type="text" />
            )}
          </FormItem>
          < FormItem label = "mobile phone number" >
            {getFieldDecorator('phone', {
              rules: [{
                required: true,
                message: 'Please enter the phone number'
              }, {
                max: 12,
                min: 1,
                message: 'Mobile phone number cannot exceed 12 characters'
              }]
            })(
              <Input type="number" />
            )}
          </FormItem>
          < FormItem label = "Is super administrator" >
            {getFieldDecorator('superLevel', {
              rules: [{
                required: true,
                message: 'Please select administrator rights'
              }],
              initialValue: false
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
