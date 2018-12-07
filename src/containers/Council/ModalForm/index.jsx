import React, {Component} from 'react'
import { Modal, Form, Input, message, Icon, Upload } from 'antd'
import {URL, getSig} from '../../../public/index'
const FormItem = Form.Item

class CollectionCreateForm extends Component {
    constructor (props) {
        super(props)
        this.state = {
            previewVisible: false,
            previewImage: '',
            fileList: [],
            url: '',
            description: '',
            loading: true,
            userType: '1'
        }
    }

    // 上传图片
    handleCancel = () => this.setState({previewVisible: false})

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true
        })
    }

    handleChange = ({file, fileList}) => {
        this.setState({
            fileList: fileList
        })

        if (file.status === 'removed') {
            this.setState({
                url: ''
            })
        }

        if (file.response) {
            if (file.response.code === 1 && file.status === 'done') {
                this.setState({
                    url: file.response.obj
                })
                this.props.getImgData(file.response.obj)
            }
            if (file.status === 'error') {
                message.error('网络错误，上传失败！')
                this.setState({
                    url: '',
                    fileList: []
                })
            }
        }
    }

    render () {
        const { visible, onCancel, onCreate, form, loading } = this.props
        const { getFieldDecorator } = form
        const formItemLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 18, offset: 1}
        }
        const uploadButton = (
            <div>
                <Icon type="plus"/>
                <div className="ant-upload-text">上传图片</div>
            </div>
        )
        return (
            <Modal
                visible={visible}
                title="新增委员"
                okText="确定"
                onCancel={onCancel}
                onOk={onCreate}
                confirmLoading={loading}
            >
                <Form>
                    <FormItem
                        {...formItemLayout}
                        label="姓名">
                        {getFieldDecorator('name', {
                            initialValue: '',
                            rules: [{ required: true, message: '请输入委员姓名！' }]
                        })(
                            <Input />
                        )}
                    </FormItem>
                    {/*
                    <FormItem
                        {...formItemLayout}
                        className="collection-create-form_last-form-item"
                        label="委员类型"
                    >
                        {getFieldDecorator('type', {
                            initialValue: '0'
                        })(
                            <Radio.Group>
                                <Radio value="0">个人</Radio>
                                <Radio value="1">机构</Radio>
                            </Radio.Group>
                        )}
                    </FormItem>
                    */}
                    <FormItem
                        {...formItemLayout}
                        label="头像"
                        className='upload-div'
                    >
                        <div className="dropbox">
                            {getFieldDecorator('url', {
                                initialValue: '',
                                rules: [{required: true, message: '请上传委员头像！'}]
                            })(
                                <Upload
                                    headers={{'Sign-Param': getSig()}}
                                    action={`${URL}/upload/picture`}
                                    name='uploadFile'
                                    data={{type: 'news'}}
                                    listType="picture-card"
                                    fileList={this.state.fileList}
                                    onPreview={this.handlePreview}
                                    onChange={this.handleChange}
                                >
                                    {this.state.fileList.length >= 1 ? null : uploadButton}
                                </Upload>
                            )}
                            <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
                                <img alt="example" style={{width: '100%'}} src={this.state.previewImage}/>
                            </Modal>
                            <span className="cover-img-tip" style={{display: 'inline-block', marginTop: '70px', position: 'absolute'}}>用于直播页面头像展示, 长宽比例: <font style={{color: 'red'}}>1 : 1</font></span>
                        </div>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="委员简介">
                        {getFieldDecorator('description', {
                            initialValue: ''
                        })(<Input rows={4} type="textarea" />)}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="排序权重">
                        {getFieldDecorator('weight', {
                            initialValue: '0',
                            rules: [{ required: false, message: '请输入排序权重！' }]
                        })(
                            <Input placeholder="权重越大排序越靠前"/>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

export default Form.create()(CollectionCreateForm)
