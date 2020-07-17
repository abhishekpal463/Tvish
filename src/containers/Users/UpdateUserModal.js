import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {
  Button,
  message,
  Modal,
  Form,
  Input
} from 'antd';
import {
  authError,
  fetchUsers
} from '../../actions/index';

import userService from '../../services/userService';


const FormItem = Form.Item


@connect(
  state => ({
    adminId: state.auth.admin.adminId,
    token: state.auth.admin.token
  }),
  dispatch => ({
    authError: (errorMessage) => dispatch(authError(errorMessage)),
    fetchUsers: (adminId,token) => dispatch(fetchUsers(adminId,token))
  })
)

@Form.create()

export default class UpdateUserModal extends React.Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    handleCancel: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    value: PropTypes.object.isRequired
  }

  // 提交事件
  handleSubmit = (e) => {
    e.preventDefault()

    this.props.form.validateFields((err, values) => {
      console.log(values)
      if (err) {
        return;
      }

      // 调用本类更新方法
      this.updateUser(values);

    })
  }

  updateUser = async (user) => {
    const {
      adminId,
      token
    } = this.props

    try {
      //调用更新 api
      console.log("update user");
      const res = await userService.update(
        adminId,
        token,
        user
      )
      message.success('Successfully modified');
      this.props.fetchUsers(adminId,token);
      this.props.handleSubmit();
    } catch (err) {
      console.log("err");
      console.log(err);
      if (err.message === undefined) {
        const errorMessage = 'The server went wrong, please wait patiently, please wait patiently for one year, thank you'
        this.props.authError(errorMessage)
      }
      if (!err.response) {
        this.props.authError(err);
      }
      if (err.response.status === 401) {
        const errorMessage = 'Your login has expired, please log in again'
        this.props.authError(errorMessage)
      }
      // 修改不成功
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
      handleSubmit,
      form,
      value
    } = this.props

    const {getFieldDecorator} = form;//字段
    const userId = value ? value.userId : ''
    const userName = value ? value.userName : ''
    const nickName = value ? value.nickName : ''

    return (
      <Modal
        visible={visible}
        title = "Modify user information"
        okText = "modify"
        cancelText = "cancel"
        onCancel={handleCancel}
        onOk={this.handleSubmit}
      >
        <Form layout="vertical">
          <FormItem label="id">
            {getFieldDecorator('userId', {
              initialValue: userId
            })(
              <Input type="text" disabled/>
            )}
          </FormItem>
          < FormItem label = "user account" >
            {getFieldDecorator('userName', {
              rules: [{
                required: true,
                message: 'please enter account'
              }, {
                max: 100,
                min: 1,
                message: 'User account cannot exceed 100 characters'
              }],
              initialValue: userName
            })(
              <Input type="text"/>
            )}
          </FormItem>
          < FormItem label = "User's Nickname" >
            {getFieldDecorator('nickName', {
              rules: [{
                required: true,
                message: 'Please enter a nickname'
              }, {
                max: 100,
                min: 1,
                message: 'User nickname cannot exceed 100 characters'
              }],
              initialValue: nickName
            })(
              <Input type="text"/>
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }

}
