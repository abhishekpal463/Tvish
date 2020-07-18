import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Button,
  Icon,
  Upload,
  message,
  Modal,
  Form,
  Input
} from 'antd';
import {
  authError,
  fetchAllCategorySecond
} from '@/actions/index';
import categorySecondService from '@/services/categorySecondService';
import CategorySelector from '../../components/CategorySelector';

const FormItem = Form.Item

@connect(
  state => ({
    adminId: state.auth.admin.adminId,
    token: state.auth.admin.token
  }),
  dispatch => ({
    authError: (errorMessage) => dispatch(authError(errorMessage)),
    fetchCategories: () => dispatch(fetchAllCategorySecond())
  })
)
@Form.create()
export default class UpdateCategoryModal extends React.Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    handleCancel: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    value: PropTypes.object.isRequired
  }

  state = {
    fileList: [],
    previewImage: '',
    previewVisible: false
  }

  handleSubmit = (e) => {
    e.preventDefault()

    this.props.form.validateFields((err, values) => {
      if (err) {
        return ;
      }

      if (values.image) {
        this.updateCategory(
          values.categorySecondId,
          values.categoryFirstId,
          values.categoryName,
          values.image.fileList[0].originFileObj
        )
      } else {
        this.updateCategory(
          values.categorySecondId,
          values.categoryFirstId,
          values.categoryName,
          null
        )
      }

    })
  }

  handlePictureChange = ({ fileList }) => {
    this.setState({
      fileList
    })
  }

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    })
  }

  handleRemove = (file) => {
    this.setState({
      fileList: []
    })
  }

  handleCancel = () => {
    this.setState({
      previewVisible: false
    })
  }

  updateCategory = async (categorySecondId, categoryFirstId, categoryName, imageFile) => {
    const {
      adminId,
      token
    } = this.props

    try {
      const res = await categorySecondService.update(
        adminId,
        token,
        {
          categorySecondId,
          categoryFirstId,
          categoryName,
          imageFile
        }
      )
      message.success('Modified successfully')
      this.props.fetchCategories()
      this.props.handleSubmit()
      }
      catch (err) {
        if (err.message === undefined) {
          const errorMessage = 'The server has made an error, please be patient, please wait patiently for a year, thank you'
          this.props.authError(errorMessage)
        }
        if (err.response.status === 401) {
          const errorMessage = 'Your login has expired, please log in again'
          this.props.authError(errorMessage)
        }
        // The modification was unsuccessful
      if (err.response.status === 400 ||err.response.status === 404) {
        const errorMessage = err.response.data.message
        message.error(errorMessage)
      }
    }
  }

  renderUploadBtn = () => {
    return (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    )
  }

  render() {
    const {
      visible,
      handleCancel,
      handleSubmit,
      form,
      value
    } = this.props

    const {
      fileList,
      previewImage,
      previewVisible
    } = this.state

    const { getFieldDecorator } = form
    const categorySecondId = value ? value.categorySecondId : ''
    const categoryName = value ? value.categoryName : ''
    const categoryFirstId = value ? value.categoryFirstId : ''

    return (
      <Modal
        visible={visible}
        title = "Edit category information"
        okText = "Modify"
        cancelText = "Cancel"
        onCancel={handleCancel}
        onOk={this.handleSubmit}
      >
        <Form layout="vertical">
          <FormItem label="id">
            {getFieldDecorator('categorySecondId', {
              initialValue: categorySecondId
            })(
              <Input type="text" disabled />
            )}
          </FormItem>
          < FormItem label = "category name" > {
              getFieldDecorator('categoryName', {
                  rules: [{
                    required: true,
                    message: 'Please enter the category name'
                  }, {
                    max: 10,
                    min: 1,
                    message: 'Product name cannot exceed 10 characters'
                  }],
              initialValue: categoryName
            })(
              <Input type="text" />
            )}
          </FormItem>
          < FormItem label = "First level classification" > {
              getFieldDecorator('categoryFirstId', {
                  initialValue: categoryFirstId,
                  rules: [{
                        required: true,
                        message: 'Please select the first level category'
              }]
            })(
              <CategorySelector
                allItem={false}
                level="first"
              />
            )}
          </FormItem>
          < FormItem label = "Edit picture" >
            {
              getFieldDecorator('image')(
                <Upload
                  action="http://192.168.191.1:8080/api/v1/fileUpload"
                  listType="picture-card"
                  fileList={fileList}
                  onRemove={this.handleRemove}
                  onPreview={this.handlePreview}
                  // onPreview={this.handlePreview}
                  // beforeUpload={this.beforeUpload}
                  onChange={this.handlePictureChange}
                >
                  {fileList.length >= 1 ? null : this.renderUploadBtn()}
                </Upload>
              )
            }
          </FormItem>
          <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </Form>
      </Modal>
    )
  }
}
