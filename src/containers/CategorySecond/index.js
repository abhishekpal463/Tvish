import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Panel from '@/components/Panel';
import {
  Button,
  Layout,
  Breadcrumb,
  Divider,
  Table,
  Form
} from 'antd';
import { fetchAllCategorySecond } from '../../actions';
import AddCategoryModal from './AddCategoryModal';
import UpdateCategoryModal from './UpdateCategoryModal';
import DeleteCategoryModal from './DeleteCategoryModal';

@connect(
  state => ({
    categorySeconds: state.categories.second.categories,
    isFetching: state.categories.second.isFetching
  }),
  dispatch => ({
    loadCategories: () => dispatch(fetchAllCategorySecond())
  })
)
export default class Adv extends React.Component {
  state = {
    filteredInfo: null,
    sortedInfo: null,
    addFormVisible: false,
    updateFormVisible: false,
    updateFormValue: {},
    deleteCategoryValue: {},
    deleteModalVisible: false
  }

  componentDidMount() {
    this.props.loadCategories()
  }

  handleAddFormOpen = () => {
    this.setState({
      addFormVisible: true
    })
  }

  handleClose = () => {
    this.setState({
      addFormVisible: false,
      updateFormVisible: false,
      deleteModalVisible: false
    })
  }

  handleAddFormSuccess = () => {
    this.setState({
      addFormVisible: false
    })
  }

  handleUpdateFormOpen = (category) => {
    this.setState({
      updateFormValue: category,
      updateFormVisible: true
    })
  }

  handleUpdateSuccess = () => {
    this.setState({
      updateFormVisible: false
    })
  }

  handleDeleteOpen = (category) => {
    this.setState({
      deleteCategoryValue: category,
      deleteModalVisible: true
    })
  }

  handelDeleteSuccess = () => {
    this.setState({
      deleteModalVisible: false
    })
  }

  handleChange = (pagination, filters, sorter) => {
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter
    })
  }

  render() {
    const { categorySeconds } = this.props
    let {
      filteredInfo,
      sortedInfo
    } = this.state

    filteredInfo = filteredInfo || {}
    sortedInfo = sortedInfo || {}

    const columns =[{
      title: 'id',
      dataIndex: 'categorySecondId',
      key: 'categorySecondId',
      sorter: (a, b) => a.categorySecondId- b.categorySecondId,
      sortOrder: sortedInfo.columnKey === 'categorySecondId' && sortedInfo.order
    }, {
      title: 'Belonging to the first-level name',
      dataIndex: 'categoryFirstName',
      key: 'categoryFirstName'
    }, {
      title: 'Category name',
      dataIndex: 'categoryName',
      key: 'categoryName'
    }, {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (text, record) => ( <img className = "advs-table-img"
        alt = ".."
        src = {
          text
        }
        />
      )
    }, {
      title: 'Operation',
      key: 'action',
      render: (text, record) => (
        <span>
          <Button
            type="primary"
            onClick={() => this.handleUpdateFormOpen(record)}
          >
            modify
          </Button>
          <Divider type="vertical" />
          <Button
            type="danger"
            onClick={() => this.handleDeleteOpen(record)}
          >
            delete
          </Button>
        </span>
      )
    }]

    return (
      <Layout.Content>
        <Panel minus>
          <Panel.Header type="light">
            <Breadcrumb>
              < Breadcrumb.Item > Homepage </Breadcrumb.Item> 
              <Breadcrumb.Item > Secondary commodity classification </Breadcrumb.Item> 
              </Breadcrumb> 
              <h2 > Secondary product classification </h2> 
              <p > Secondary product classification display, you can add new classifications, modify classifications, and delete classifications. </p>
               <Divider style = {
                  {
                    marginTop: '10px',
                    marginBottom: '30px'
                  }
                }
              /> 
              <Button
              type = "primary"
              onClick = {
                  this.handleAddFormOpen
                } >
                New category
            </Button>
          </Panel.Header>
          <Panel.Body type="light">
            <Table
              rowKey={record => record.categorySecondId}
              dataSource={categorySeconds}
              columns={columns}
              bordered
              onChange={this.handleChange}
            />
            <AddCategoryModal
              visible={this.state.addFormVisible}
              handleSubmit={this.handleAddFormSuccess}
              handleCancel={this.handleClose}
            />
            <UpdateCategoryModal
              value={this.state.updateFormValue}
              visible={this.state.updateFormVisible}
              handleSubmit={this.handleUpdateSuccess}
              handleCancel={this.handleClose}
            />
            <DeleteCategoryModal
              value={this.state.deleteCategoryValue}
              visible={this.state.deleteModalVisible}
              handleSubmit={this.handelDeleteSuccess}
              handleCancel={this.handleClose}
            />
          </Panel.Body>
        </Panel>
      </Layout.Content>
    )
  }
}
