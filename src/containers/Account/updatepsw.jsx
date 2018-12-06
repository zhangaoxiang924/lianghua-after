import React, { Component } from 'react'
import { Modal, Form, Input } from 'antd'
const FormItem = Form.Item
const formItemLayout = {
    labelCol: {
        xs: { span: 2 },
        sm: { span: 4 }
    },
    wrapperCol: {
        xs: { span: 4 },
        sm: { span: 16 }
    }
}

class CollectionCreateForm extends Component {
    constructor () {
        super()
        this.state = {
            passwordModal: false,
            confirmDirty: false
        }
    }

    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true })
        }
        callback()
    }

    handleConfirmBlur = (e) => {
        const value = e.target.value
        this.setState({ confirmDirty: this.state.confirmDirty || !!value })
    }

    compareToFirstPassword = (rule, value, fn) => {
        const form = this.props.form
        if (value && value !== form.getFieldValue('password')) {
            fn('两次密码输入不一致!')
        } else {
            fn()
        }
    }

    render () {
        const { visible, onCancel, onCreate, form } = this.props
        const { getFieldDecorator } = form
        return (
            <Modal
                visible={visible}
                okText="确定"
                onCancel={onCancel}
                onOk={onCreate}
                title="修改密码"
            >
                <Form>
                    <FormItem {...formItemLayout} label="新密码">
                        {getFieldDecorator('password', {
                            rules: [{
                                required: true, message: '请输入密码!'
                            }, {
                                validator: this.validateToNextPassword
                            }],
                            initialValue: ''
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="确认密码">
                        {getFieldDecorator('confirm', {
                            rules: [{
                                required: true, message: '请确认密码!'
                            }, {
                                validator: this.compareToFirstPassword
                            }],
                            initialValue: ''
                        })(
                            <Input type="password" onBlur={this.handleConfirmBlur} />
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}
export default Form.create()(CollectionCreateForm)
