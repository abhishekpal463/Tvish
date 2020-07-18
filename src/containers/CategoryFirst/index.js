import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchCategories } from '../../actions';
import Panel from '../../components/Panel';
import AddCategoryModal from './AddCategoryModal';
import UpdateCategoryModal from './UpdateCategoryModal';
import DeleteCategoryModal from './DeleteCategoryModal';
import {
  Button,
  Divider,
  Layout,
  Breadcrumb,
  Table
} from 'antd';

@connect(
  state => ({
    adminId: state.auth.admin.adminId,
    token: state.auth.admin.token,
    categories: state.categories.first.categories,
    isFetching: state.categories.first.isFetching
  }),
  dispatch => ({
    getCategories: () => dispatch(fetchCategories())
  })
)
export default class CategoryFirst extends React.Component {
  static propTypes = {
    adminId: PropTypes.number.isRequired,
    token: PropTypes.string.isRequired,
    categories: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired
  }

  state = {
    addFormVisible: false,
    updateFormVisible: false,
    deleteModalVisible: false,
    deleteCategoryValue: {},
    updateFormValue: {}
  }

  componentDidMount() {
    this.props.getCategories()
  }

  handleUpdateSuccess = () => {
    this.setState({
      updateFormVisible: false
    })
  }

  handleAddSuccess = () => {
    this.setState({
      addFormVisible: false
    })
  }

  handelDeleteSuccess = () => {
    this.setState({
      deleteModalVisible: false
    })
  }

  handleAddFormOpen = () => {
    this.setState({
      addFormVisible: true
    })
  }

  handleUpdateOpen = (value) => {
    this.setState({
      updateFormVisible: true,
      updateFormValue: value
    })
  }

  handleDeleteOpen = (value) => {
    this.setState({
      deleteModalVisible: true,
      deleteCategoryValue: value
    })
  }

  handleClose = () => {
    this.setState({
      addFormVisible: false,
      updateFormVisible: false,
      deleteModalVisible: false
    })
  }

  setAddFormRef = (form) =>{
    this.addForm = form
  }

  setUpdateFormRef = (form) =>{
    this.updateForm = form
  }

  render() {
    const {
      isFetching,
      categories
    } = this.props

    const columns = [{
      title: 'id',
      dataIndex: 'categoryFirstId',
      key: 'categoryFirstId'
    }, {
      title: 'Category name',
      dataIndex: 'categoryName',
      key: 'categoryName'
    }, {
      title: 'Operation',
      key: 'action',
      render: (text, record) => (
        <span style={{width: '200px'}}>
          <Button
            type="primary"
            onClick={() => this.handleUpdateOpen(record)}
          >
            modify
          </Button>
          <Divider type="vertical"/>
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
              <Breadcrumb.Item > First - class product classification </Breadcrumb.Item> 
              </Breadcrumb>
               <h2 > First level commodity classification </h2>
                <p > Class 1 product category display, you can add new product categories, modify
                 product categories, and delete product categories </p>
            <Divider style={{marginTop: '10px', marginBottom: '30px'}} />
            <Button
              type="primary"
              onClick={this.handleAddFormOpen}
            >
              New category
            </Button>
          </Panel.Header>
          <Panel.Body type="light">
            <Table
              rowKey={record => record.categoryFirstId}
              dataSource={categories}
              columns={columns}
              loading={isFetching}
              bordered
            />
            <AddCategoryModal
              ref={this.setAddFormRef}
              visible={this.state.addFormVisible}
              handleSubmit={this.handleAddSuccess}
              handleCancel={this.handleClose}
            />
            <UpdateCategoryModal
              value={this.state.updateFormValue}
              ref={this.setUpdateFormRef}
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
