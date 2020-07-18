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
  Divider,
  Input
} from 'antd';
import CategorySelector from '@/components/CategorySelector';

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
      console.log(values)

      if (err) {
        return ;
      }

      if (values.categorySecondId === 'all') {
        values.categorySecondId = null
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
      categorySecondId: 'all',
      status: 'all'
    })
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
      <Panel.Header style={{backgroundColor: '#fff'}}>
        <Breadcrumb>
          < Breadcrumb.Item > Homepage </Breadcrumb.Item> 
          </Breadcrumb> <h2 > Product list </h2> < p > Warehouse product information display, you can
             add new products, edit products, store products, and
          export products. </p>
        <Divider style={{marginTop: '10px', marginBottom: '30px'}} />
        <Form className="form-search" onSubmit={this.handleSubmit}>
          <Row gutter={24}>
            <Col span={4}>
              <FormItem label="id">
                {getFieldDecorator('goodId')(
                  <Input type="number" />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                className = "form-flex-wrapper"
                label = "Product name"
              >
                {getFieldDecorator('goodName', {
                  initialValue: ""
                })(
                  <Input type="text" />
                )}
              </FormItem>
            </Col>
            <Col span={5}>
              < FormItem label = "Classification:" >
                {getFieldDecorator('categorySecondId', {
                  initialValue: 'all'
                })(
                  <CategorySelector
                    allItem
                    level="second"
                  />
                )}
              </FormItem>
            </Col>
            <Col span={4}>
              < FormItem label = "Product status:" >
                {getFieldDecorator('status', {
                  initialValue: 'all'
                })(
                  <Select
                    onChange={this.handleStatusChange}
                  >
                   < Option value = "all" > All </Option>
                    <Option value = "1" > On sale </Option> 
                     <Option value = "0" > Off the shelf
                      </Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={5} style={{textAlign: 'right'}}>
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
