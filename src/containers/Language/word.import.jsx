/**
 * Author：tantingting
 * Time：2017/9/22
 * Description：Description
 */

import React, {Component} from 'react'
// import {connect} from 'react-redux'
import { Upload, Modal, Form, Button, Icon, message } from 'antd'
// import {axiosFormData} from '../../public/index'
const FormItem = Form.Item
const formItemLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 15}
}
let url = '/i18n/import'
let _url = `/club${url}`
const props = {
    name: 'file',
    action: _url,
    multiple: true
}
class WordImport extends Component {
    constructor () {
        super()
        this.state = {
            'file': null,
            fileList: []
        }
    }
    upLoadChange (info) {
        // console.log(info)
        const {submitFile} = this.props
        let file = info.file
        let fileList = info.fileList
        let _fileList = fileList.slice(1)
        fileList.length < 2 ? this.setState({fileList}) : this.setState({fileList: _fileList})
        if (file.status === 'done') {
            submitFile(file.response)
            this.setState({fileList: []})
            /* if (file.response.status === 200) {
                message.success('文件上传成功')
            } else {
                message.error('文件上传失败')
            } */
            // console.log(`${info.file.name} file uploaded successfully`)
        } else if (info.file.status === 'error') {
            message.error('文件上传失败')
            // console.log(`${info.file.name} file upload failed.`)
        }
    }

    /* upload (info) {
        console.log(info)
        let formData = new FormData()
        formData.append('file', info.file)
        axiosFormData('post', '/i18n/import', formData, (res) => {
            console.log(res)
        })
    } */
    /* submitForm = () => {
        const {form, submitFile} = this.props
        form.validateFields((err, values) => {
            if (err) {
                return
            }
            console.log(values)
            submitFile()
            // form.resetFields()
        })
    } */

    render () {
        const {isShow, onClose} = this.props
        const {getFieldDecorator} = this.props.form
        return <div className="img-show">
            <Modal title='批量导入' visible={isShow} onOk={() => onClose()} onCancel={() => onClose()} okText="确认" cancelText="取消">
                <Form>
                    <FormItem label="词条语种" {...formItemLayout}>
                        {getFieldDecorator('language')(<div>简体中文</div>)}
                    </FormItem>
                    <FormItem className="upload-item" label="导入文件" {...formItemLayout}>
                        {getFieldDecorator('File', {
                            rules: [{
                                required: true, message: '请选择要导入的文件！'
                            }],
                            initialValue: ''
                        })(
                            <Upload {...props} onChange={(info) => this.upLoadChange(info)} fileList={this.state.fileList}>
                                <Button>
                                    <Icon type="upload" />上传文件
                                </Button>
                            </Upload>
                        )}
                    </FormItem>
                    {/* <FormItem label=" 词条译文" {...formItemLayout}>   customRequest={(info) => this.upload(info)}
                        {getFieldDecorator('word_value', {
                            rules: [{
                                required: true, message: '请输入英文译文！'
                            }],
                            initialValue: !query || !query.word_value ? '' : query.word_value
                        })(<Input placeholder="请输入英文译文！必填" />)}
                    </FormItem> */}
                </Form>
            </Modal>
        </div>
    }
}

export default Form.create()(WordImport)
/* const mapStateToProps = (state) => {
    return {
        loginInfo: state.loginInfo
    }
}

export default connect(mapStateToProps)(Form.create()(WordImport)) */
