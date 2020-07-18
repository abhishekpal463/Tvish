import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Layout,
  Icon,
  Badge,
  Menu,
  Switch
} from 'antd'
import SidebarLogo from '@/components/SidebarLogo';

const {
  Sider
} = Layout
const {
  Item,
  SubMenu
} = Menu

@connect(
  state => ({
    adminId: state.auth.admin.adminId,
    wait: state.orders.wait,
    dispatching: state.orders.dispatching,
    refunding: state.orders.refunding
  })
)
export default class Sidebar extends React.Component {
  static propTypes = {
    collapsed: PropTypes.bool.isRequired,
    permission: PropTypes.bool.isRequired
  }

  state = {
    current: '0',
    theme : 'dark'
  }

  handleClick = (e) => {
    const key = e.key
    this.setState({
      current: key
    })
  }

    changeTheme = value => {
      this.setState({
        theme: value ? 'dark' : 'light',
      });
    };

  render() {
    const {
      adminId,
      permission,
      wait,
      dispatching,
      refunding,
      collapsed
    } = this.props

    return (
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style = {
            {
              background: `${(this.state.theme==='dark')?'#263238':'#fff'}`
              }
              }
      >
        <SidebarLogo theme={this.state.theme} />
        < Switch
        checked = {
          this.state.theme === 'dark'
        }
        onChange = {
          this.changeTheme
        }
        checkedChildren = "Dark"
        unCheckedChildren = "Light" /
          >
        <Menu
          theme = {
            this.state.theme
          }
          mode="inline"
          defaultSelectedKeys={["0"]}
          onClick={this.handleClick}
        >
          <Item key="0">
            <Link to="/dashboard">
              <Icon type="dashboard" />
              <span>dashboard</span>
            </Link>
          </Item>
          <Item key="1">
            <Link to="users">
              <Icon type="user" />
              <span>User</span>
            </Link>
          </Item>
          <Item key="2">
            <Link to="/goods">
              <Icon type="table" />
              <span>Goods</span>
            </Link>
          </Item>
          < SubMenu title = {
              <Fragment>< Icon type = "tags-o" / > <span > Category </span></Fragment>}>
            <Item key="3">
              <Link to="/category/first">
                <span>First</span>
              </Link>
            </Item>
            <Item key="4">
              <Link to="/category/second">
                <span>Second</span>
              </Link>
            </Item>
          </SubMenu>
          <SubMenu title={<Fragment><Icon type="profile" /><span>Profile</span></Fragment>}>
            <Item key="5">
              <Link to="/orders">
                <span>Orders</span>
              </Link>
            </Item>
            <Item key="6">
              {/* <Badge count={wait + dispatching}> */}
                <Link to="/order/dispatch">
                  <span>Dispatch&nbsp;&nbsp;</span>
                </Link>
              
            </Item>
            <Item key="7">
              {/* <Badge count={refunding}> */}
                <Link to="/order/refund">
                  <span>Refund&nbsp;&nbsp;</span>
                </Link>
              {/* </Badge> */}
            </Item>
          </SubMenu>
          <Item key="8">
            <Link to="/advertisments">
              <Icon type="switcher" />
              <span>Advertisments</span>
            </Link>
          </Item>
          {
            adminId === 100 ? (
              <Item key="9">
                <Link to="/admins">
                  <Icon type="solution" />
                  <span>Admin</span>
                </Link>
              </Item>
            ) : null
          }
        </Menu>
      </Sider>
    )
  }
}
