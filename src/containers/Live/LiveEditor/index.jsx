/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import { hashHistory } from 'react-router'
import { Form, Input, Button, message, Spin } from 'antd'
// import { Form, Input, Button, message, Icon, Upload, Modal, Spin } from 'antd'

import {axiosAjax} from '../../../public/index'

const FormItem = Form.Item
const { TextArea } = Input

class LiveEditor extends Component {
    constructor () {
        super()
        this.state = {
            updateOrNot: false,
            inputVisible: false,
            channelId: '1',
            inputValue: '',
            content: '',
            loading: true,
            tag: 1,
            icoVisible: false,
            cateId: '1',
            previewVisible: false,
            previewImage: '',
            icoTitle: '',
            description: '',
            fileList: [],
            coverImgUrl: '',
            url: ''
        }
    }

    componentWillMount () {
        this.setState({
            loading: false
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
                coverImgUrl: ''
            })
        }

        if (file.response) {
            if (file.response.code === 1 && file.status === 'done') {
                this.setState({
                    coverImgUrl: file.response.obj
                })
            }
            if (file.status === 'error') {
                message.error('网络错误，上传失败！')
                this.setState({
                    coverImgUrl: '',
                    fileList: []
                })
            }
        }
    }

    // 提交
    handleSubmit = (e) => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({
                    loading: true
                })
                // values.id = this.props.location.query.id || ''
                !this.state.updateOrNot && delete values.id
                axiosAjax('post', `${this.state.updateOrNot ? '/lives/update' : '/lives/add'}`, values, (res) => {
                    if (res.code === 1) {
                        message.success(this.state.updateOrNot ? '修改成功！' : '发表成功！')
                    } else {
                        message.error(res.msg)
                    }
                })
            }
        })
    }

    render () {
        // const {icoInfo} = this.props
        const { getFieldDecorator } = this.props.form
        const { flashInfo } = this.props
        const {content, updateOrNot} = this.state
        // const {content, previewVisible, previewImage, fileList, updateOrNot} = this.state
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 19, offset: 1 }
        }
        // const uploadButton = (
        //     <div>
        //         <Icon type="plus"/>
        //         <div className="ant-upload-text">上传图片</div>
        //     </div>
        // )
        return <div className="flash-send">
            <Spin spinning={this.state.loading} size="large">
                <Form onSubmit={this.handleSubmit}>
                    {/*
                    <FormItem {...formItemLayout} label="频道：">
                        {getFieldDecorator('channelId', {
                            initialValue: (updateOrNot && flashInfo) ? `${flashInfo.channelId}` : '1'
                        })(
                            <RadioGroup
                                options={flashIdOptions}
                                onChange={this.channelIdChange}
                                setFieldsValue={this.state.channelId}>
                            </RadioGroup>
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label="直播标识：">
                        {getFieldDecorator('tag', {
                            initialValue: (updateOrNot && flashInfo) ? flashInfo.tag : 1
                        })(
                            <RadioGroup
                                options={tagOptions}
                                onChange={this.tagChange}
                                setFieldsValue={tag}>
                            </RadioGroup>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="链接地址：">
                        {getFieldDecorator('url', {
                            initialValue: (updateOrNot && flashInfo) ? `${flashInfo.url ? flashInfo.url : ''}` : '',
                            rules: [{ type: 'url', message: '请输入正确的超链接地址！' }]
                        })(
                            <Input placeholder='直播中插入的超链接地址'/>
                        )}
                    </FormItem>
                    */}
                    <FormItem
                        {...formItemLayout}
                        label="文字："
                    >
                        {getFieldDecorator('content', {
                            initialValue: (updateOrNot && flashInfo) ? content : '',
                            rules: [{ required: true, message: '请输入直播内容！' }]
                        })(
                            <TextArea className="flash" placeholder="请输入直播内容"/>
                        )}
                    </FormItem>
                    {/*
                    <FormItem
                        {...formItemLayout}
                        label="图片: "
                        className='upload-div'
                    >
                        <div className="dropbox">
                            {getFieldDecorator('img', {
                                initialValue: (updateOrNot && icoInfo) ? fileList : ''
                            })(
                                <Upload
                                    action={`${URL}/pic/upload`}
                                    name='uploadFile'
                                    listType="picture-card"
                                    fileList={fileList}
                                    onPreview={this.handlePreview}
                                    onChange={this.handleChange}
                                >
                                    {fileList.length >= 1 ? null : uploadButton}
                                </Upload>
                            )}
                            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                <img alt="example" style={{width: '100%'}} src={previewImage}/>
                            </Modal>
                        </div>
                    </FormItem>
                     */}
                    <FormItem
                        wrapperCol={{ span: 12, offset: 5 }}
                    >
                        <Button type="primary" htmlType="submit" style={{marginRight: '10px'}}>发表</Button>
                        <Button type="primary" className="cancel" onClick={() => { hashHistory.goBack() }}>返回</Button>
                    </FormItem>
                </Form>
            </Spin>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        userInfo: state.flashInfo.userInfo,
        flashInfo: state.flashInfo.info
    }
}

export default connect(mapStateToProps)(Form.create()(LiveEditor))
