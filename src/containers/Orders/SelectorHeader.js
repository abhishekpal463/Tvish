import React from 'react';
import PropTypes from 'prop-types';
import Panel from '@/components/Panel';
import {
  Breadcrumb,
  Form,
  Row,
  Col,
  Button,
  Select,
  DatePicker,
  Divider,
  Input
} from 'antd';
import { ORDER_WAIT, ORDER_DISPATCHING, ORDER_FINISH, ORDER_REFUNDING } from '../../constants';

const FormItem = Form.Item
const Option = Select.Option

@Form.create()
export default class SelectorHeader extends React.Component {
  static propTypes = {
    handleSelectorChange: PropTypes.func.isRequired
  }

  handleSubmit = (e) => {
    e.preventDefault()

    this.props.form.validateFields((err, values) => {
      if (err) {
        return ;
      }

      if (values.categoryId === 'all') {
        values.categoryId = null
      }

      if (values.status === 'all') {
        values.status = null
      }

      this.props.handleSelectorChange(values)
    })
  }

  handleReset = () => {
    this.props.form.setFieldsValue({
      goodId: undefined,
      goodName: '',
      categoryId: 'all',
      status: 'all'
    })
  }

  onDateChange = (date, dateString) => {
    console.log(date, dateString);
  }

  handleStatusChange = (value) => {
    this.props.form.setFieldsValue({
      status: value
    })
  }

  render() {
    const {
      form
    } = this.props

    const { getFieldDecorator } = form

    return (
      <Panel.Header type="light">
        <Breadcrumb>
          < Breadcrumb.Item > Homepage </Breadcrumb.Item>
           < Breadcrumb.Item > Order management </Breadcrumb.Item>
            < Breadcrumb.Item > Order inquiry </Breadcrumb.Item>
             </Breadcrumb>
              <h2 > Order inquiry </h2>
               <p > Display all order information, combine to query order information </p>
        <Divider style={{marginTop: '10px', marginBottom: '30px'}} />
        <Form className="form-search" onSubmit={this.handleSubmit}>
          <Row gutter={24}>
            <Col span={4}>
              <FormItem label="id">
                {getFieldDecorator('orderId')(
                  <Input type="number" />
                )}
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem
                className="form-flex-wrapper"
                label = "User name"
              >
                {getFieldDecorator('userName', {
                  initialValue: ""
                })(
                  <Input type="text" />
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              < FormItem label = "time:" >
                {getFieldDecorator('createTime', {
                  initialValue: ''
                })(
                  <DatePicker.RangePicker style={{marginLeft: '10px'}}/>
                )}
              </FormItem>
            </Col>
            <Col span={4}>
              < FormItem label = "Order Status:" >
                {getFieldDecorator('status', {
                  initialValue: 'all'
                })(
                  <Select style={{width: '110px'}}
                    onChange={this.handleStatusChange}>
                    <Option value = "all" > All </Option> 
                    <Option value = {ORDER_WAIT}> To be shipped </Option>
                    <Option value = {ORDER_DISPATCHING} > Distribution </Option> 
                    <Option value = {ORDER_FINISH} > Completed </Option>
                    <Option value = {ORDER_REFUNDING} > Refunding </Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={4} style={{textAlign: 'right'}}>
              <Button
                type="primary"
                htmlType="submit"
              >
                search
                for
              </Button>
              <Divider type="vertical"/>
              < Button type = "dashed"
              onClick = {
                this.handleReset
              } > Reset </Button>
            </Col>
          </Row>
        </Form>
      </Panel.Header>
    )
  }
}
