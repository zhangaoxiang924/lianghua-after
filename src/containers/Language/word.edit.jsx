/**
 * Author：tantingting
 * Time：2017/9/22
 * Description：Description
 */

import React, {Component} from 'react'
import {connect} from 'react-redux'
import { Input, Modal, Form } from 'antd'
// import defaultImgLarge from '../../public/img/default-large.png'
// import './img.scss'
const FormItem = Form.Item
const formItemLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 15}
}

class WordEdit extends Component {
    submitForm = (e) => {
        e.preventDefault()
        const {form, submitEdit, query} = this.props
        form.validateFields((err, values) => {
            if (err) {
                return
            }
            let sendData = {
                'i18nLang': query.lang,
                'i18nKey': values.code,
                'i18nValue': values.val
            }
            submitEdit(sendData)
            form.resetFields()
        })
    }

    render () {
        const {isShow, type, onClose, query, langs} = this.props
        const {getFieldDecorator} = this.props.form
        return <div className="img-show">
            <Modal title={type === 'edit' ? '词条编辑' : '单条添加'} visible={isShow} onOk={(e) => this.submitForm(e)} onCancel={() => onClose()} okText="确认" cancelText="取消">
                <Form>
                    <FormItem label="词条语种" {...formItemLayout}>
                        {getFieldDecorator('language')(<div>{!query || !query.lang ? '' : langs[query.lang]}</div>)}
                    </FormItem>
                    <FormItem label="词条key" {...formItemLayout}>
                        {getFieldDecorator('code', {
                            rules: [{
                                required: true, message: '请输入词条key！'
                            }],
                            initialValue: !query || !query.code ? '' : query.code
                        })(<Input disabled={type === 'edit'} placeholder="请输入词条key！必填" />)}
                    </FormItem>
                    <FormItem label=" 词条译文" {...formItemLayout}>
                        {getFieldDecorator('val', {
                            rules: [{
                                required: true, message: '请输入英文译文！'
                            }],
                            initialValue: !query || !query.val ? '' : query.val
                        })(<Input placeholder="请输入英文译文！必填" />)}
                    </FormItem>
                </Form>
            </Modal>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        loginInfo: state.loginInfo
    }
}

export default connect(mapStateToProps)(Form.create()(WordEdit))
