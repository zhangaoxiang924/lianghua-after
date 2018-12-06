/**
 * Author：tantingting
 * Time：2017/9/22
 * Description：Description
 */

import React, {Component} from 'react'
import {connect} from 'react-redux'
import { Input, Modal, Form, Upload, Icon, message } from 'antd'
import {addInitGameQuery} from '../../actions/useless/initGame.action'
// import defaultImgLarge from '../../public/img/default-large.png'
// import './img.scss'
const FormItem = Form.Item
const formItemLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 15}
}
// let imgUrl = ''
let url = '/image/upload'
let _url = `/club${url}`
class GameEdit extends Component {
    constructor (props) {
        super(props)
        // console.log(props)
        this.state = {
            'enabled': true,
            'isEdit': false,
            'file': null
            /* fileList: [{
                uid: -1,
                name: '',
                status: 'done',
                url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
            }] */
        }
    }
    handleCancel = () => this.setState({ previewVisible: false })
    /* beforeUpload = (file, fileList) => {
        this.setState({'file': file})
    } */
    beforeUpload = (file) => {
        const isImg = file.type === 'image/jpeg' || file.type === 'image/png'
        if (!isImg) {
            message.error('只能上传格式JPEG和PNG的文件!')
            return false
        }
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isLt2M) {
            message.error('图片必须小于2MB!')
            return false
        }
        this.setState({'file': file})
        return isImg && isLt2M
    }
    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true
        })
    }

    handleChange = (info) => {
        // console.log(info)
        const {setFileList, dispatch} = this.props
        let fileList = info.fileList
        let file = info.file
        let _fileList = fileList.slice(1)
        fileList.length < 2 ? setFileList(fileList) : setFileList(_fileList)
        this.setState({'enabled': false})
        if (file.status === 'done') {
            let res = file.response
            if (res.status === 200) {
                // imgUrl = res.data
                dispatch(addInitGameQuery({appIcon: res.data}))
                this.setState({'enabled': true})
            }
        }
    }

    // 提交
    submitForm = () => {
        const {form, submitEdit, query} = this.props
        form.validateFields((err, values) => {
            if (err) {
                return
            }
            if (!this.state.enabled) {
                message.error('图片正在上传中，请稍后。。。')
                return
            }
            // console.log(values)
            let _data = {
                ...values,
                appIcon: query.appIcon
            }
            submitEdit(_data)
        })
    }

    render () {
        const {isShow, type, onClose, query} = this.props
        const {getFieldDecorator} = this.props.form
        return <div className="img-show">
            <Modal title={type === 'edit' ? '游戏系列编辑' : '游戏系列添加'} visible={isShow} onOk={() => this.submitForm()} onCancel={() => onClose()} okText="确认" cancelText="取消">
                <Form>
                    <FormItem label="游戏系列名称" {...formItemLayout}>
                        {getFieldDecorator('' +
                            'appName', {
                            rules: [{
                                required: true, message: '请输入游戏系列名称！'
                            }],
                            initialValue: !query || !query.appName ? '' : query.appName
                        })(<Input placeholder="请输入游戏系列名称！" />)}
                    </FormItem>
                    <FormItem label="游戏系列ID" {...formItemLayout}>
                        {getFieldDecorator('appId', {
                            rules: [{
                                required: true, message: '请输入游戏系列ID！'
                            }, {
                                pattern: /^[0-9]*$/, message: '请输入正整数'
                            }],
                            initialValue: !query || !query.appId ? '' : query.appId
                        })(<Input disabled={type === 'edit'} placeholder="请输入游戏系列ID" />)}
                    </FormItem>
                    <FormItem label="游戏图标" {...formItemLayout}>
                        <div>（尺寸512*512，格式JPEG和PNG，大小2M以下)</div>
                        {getFieldDecorator('appIcon', {
                            initialValue: !query || !query.appIcon ? '' : query.appIcon
                        })(
                            <div className="clearfix">
                                <Upload
                                    name="uploadFile"
                                    action={_url}
                                    listType="picture-card"
                                    fileList={query.fileList}
                                    onPreview={this.handlePreview}
                                    onChange={(info) => this.handleChange(info)}
                                    beforeUpload={this.beforeUpload}
                                >
                                    <div>
                                        <Icon type="plus" />
                                        <div className="ant-upload-text">Upload</div>
                                    </div>
                                </Upload>
                                <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
                                    <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
                                </Modal>
                            </div>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        </div>
    }
}

const mapStateToProps = (state) => {
    // console.log(state)
    return {
        loginInfo: state.loginInfo
    }
}

export default connect(mapStateToProps)(Form.create()(GameEdit))
