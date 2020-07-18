import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import {
  Form,
  Input,
  Button,
  Checkbox,
  Spin,
  message
} from 'antd';
import Copyright from '../components/Copyright';
import {
  Redirect
} from 'react-router-dom';
import PropTypes from 'prop-types';
import logo from '../assets/images/logo.png';
import * as storage from '../utils/storage';
import {
  USERNAME,
  PASSWORD,
  WEBSITE_NAME
} from '../constants';

const FormItem = Form.Item;

@connect(
  (state) => ({
    error: state.auth.error,
    isAuthenticated: state.auth.isAuthenticated,
    isFetching: state.auth.isFetching
  }),
  actions
)

@Form.create()
export default class Login extends React.Component {
  state = {
    token: '',
    adminId: '',
    username: '',
    password: ''
  }

  static propTypes = {
    error: PropTypes.string.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    isFetching: PropTypes.bool.isRequired
  }

  componentWillMount() {
    if (this.props.location.state) {
      message.warning(this.props.location.state.message)
    }

    const username = storage.getStorage(USERNAME)
    const password = storage.getStorage(PASSWORD)

    this.setState({
      username,
      password
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()

    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        // await this.props.signin(values.username, values.password)

        if (this.props.error) {
          message.error(this.props.error)
        } else {
          message.success('Landed successfully')
        }

        if (values.remember === true) {
          storage.setStorage(USERNAME, values.username)
          storage.setStorage(PASSWORD, values.password)
        } else {
          storage.removeStorage(USERNAME, values.username)
          storage.removeStorage(PASSWORD, values.password)
        }
      }
    })
  }

  render() {
    const {
      isAuthenticated,
      isFetching,
      form
    } = this.props

    const {
      getFieldDecorator
    } = form

    const {
      username,
      password
    } = this.state

    return  (isAuthenticated) ? (
        <Redirect
          to={{
            pathname: '/dashboard',
            form: {
              from: this.props.location
            }
          }}
        />
      ) : (
        <div className="page page-login vertical-align">
          <div className="page-content vertical-align-middle">
            <div className="brand">
              <img src={logo} alt="..."/>
              <h2 className="brand-text">
                {WEBSITE_NAME}
              </h2>
            </div>
            < p > Please use your account password to log in to the system </p>
            <Form
              style={{textAlign: 'left'}}
              onSubmit={this.handleSubmit}
            >
              <FormItem>
                {
                  getFieldDecorator('username', {
                    initialValue: username,
                    rules: [{
                    required: true,
                    message: 'Please enter your account!'
                    }]
                    })( <Input placeholder = "account"
                    />
                  )
                }
              </FormItem>
              <FormItem>
                {
                  getFieldDecorator('password', {
                    initialValue: password,
                    rules: [{
                      required: true,
                      message: 'Please enter password!'
                    }]
                  })(
                    <Input
                      type="password"
                      placeholder = "password"
                    />
                  )
                }
              </FormItem>
              <FormItem>
                {
                  getFieldDecorator('remember', {
                    valuePropName: 'checked',
                    initialValue: true
                  })(
                    < Checkbox style = {
                      {
                        color: '#fff'
                      }
                    } > Remember password </Checkbox>
                  )
                }
                <a className="login-form-forgot">
                  forget password ?
                </a>
                <Button
                  className="btn-login"
                  type="primary"
                  htmlType="submit"
                >
                  {
                    isFetching ? (
                      <Spin />
                    ) : ''
                  }
                  log in
                </Button>
              </FormItem>
            </Form>
            <p>
            You have not registered yet ? please < a href = "" > registered </a>
            </p>
            <Copyright className="page-copyright-inverse" />
          </div>
        </div>
      )
  }
}
