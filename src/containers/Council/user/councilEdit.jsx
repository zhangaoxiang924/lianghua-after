import React, {Component} from 'react'
import { connect } from 'react-redux'
import {hashHistory} from 'react-router'
import { Modal, Form, Input, message, Icon, Upload, Button, Spin } from 'antd'
import {URL, axiosAjax, getSig} from '../../../public/index'
const FormItem = Form.Item

class CouncilEdit extends Component {
    constructor (props) {
        super(props)
        this.state = {
            previewVisible: false,
            previewImage: '',
            fileList: [],
            url: '',
            description: '',
            loading: true,
            category: '1'
        }
    }

    componentWillMount () {
        const {selectContent} = this.props
        let img = selectContent.imageUrl
        this.setState({
            updateOrNot: true,
            fileList: [{
                uid: 0,
                name: 'xxx.png',
                status: 'done',
                url: img
            }],
            description: selectContent.description || '',
            url: img,
            loading: false,
            category: selectContent.category,
            name: selectContent.name
        })
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

    // 提交
    handleSubmit = (e) => {
        e.preventDefault()
        this.props.form.setFieldsValue({
            url: this.state.url
        })
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({
                    loading: true
                })
                values.id = this.props.selectContent.id
                axiosAjax('post', '/juror/update', values, (res) => {
                    if (res.code === 1) {
                        message.success('修改成功')
                        hashHistory.push('/council-list')
                    } else {
                        message.error(res.msg)
                    }
                })
            }
        })
    }

    render () {
        const {form, selectContent} = this.props
        const { getFieldDecorator } = form
        const formItemLayout = {
            labelCol: {span: 2},
            wrapperCol: {span: 15, offset: 1}
        }
        const uploadButton = (
            <div>
                <Icon type="plus"/>
                <div className="ant-upload-text">上传图片</div>
            </div>
        )
        return (
            <Form onSubmit={this.handleSubmit}>
                <Spin spinning={this.state.loading} size='large'>
                    <FormItem
                        {...formItemLayout}
                        label="姓名">
                        {getFieldDecorator('name', {
                            initialValue: selectContent.name ? selectContent.name : '',
                            rules: [{ required: true, message: '请输入合作伙伴名！' }]
                        })(
                            <Input />
                        )}
                    </FormItem>
                    {/*
                    <FormItem
                        {...formItemLayout}
                        className=""
                        label="类型"
                    >
                        {getFieldDecorator('category', {
                            initialValue: selectContent.category ? `${selectContent.category}` : '0'
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
                                initialValue: (selectContent && selectContent.imageUrl) ? this.state.fileList : '',
                                rules: [{required: true, message: '请上传合作伙伴头像！'}]
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
                            <span className="cover-img-tip" style={{display: 'inline-block', marginTop: '70px'}}>用于合作伙伴头像展示, 长宽比例: <font style={{color: 'red'}}>1 : 1</font></span>
                        </div>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="描述">
                        {getFieldDecorator('description', {
                            initialValue: (selectContent && selectContent.description) ? selectContent.description : ''
                        })(<Input rows={4} type="textarea" />)}
                    </FormItem>
                    <FormItem
                        wrapperCol={{span: 12, offset: 2}}
                    >
                        <Button
                            type="primary" data-status='1' htmlType="submit"
                            style={{marginRight: '10px'}}>保存</Button>
                        <Button
                            type="primary" className="cancel"
                            onClick={() => {
                                hashHistory.goBack()
                            }}>取消</Button>
                    </FormItem>
                </Spin>
            </Form>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        selectContent: state.councilInfo.selectedData
    }
}

export default connect(mapStateToProps)(Form.create()(CouncilEdit))
