/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, {Component} from 'react'
import {Input, Button, Form, Icon} from 'antd'
import './post.scss'
const FormItem = Form.Item
const formItemLayout = {
    labelCol: {span: 5},
    wrapperCol: {span: 17}
}

class PostSendLogin extends Component {
    login (e) {
        e.preventDefault()
        const {click} = this.props
        this.props.form.validateFields((err, values) => {
            if (!err) {
                click(values)
            }
        })
    }
    render () {
        const {info} = this.props
        const {getFieldDecorator} = this.props.form
        return <div className="send-login">
            <Form>
                <FormItem label="发帖账号" {...formItemLayout}>
                    {getFieldDecorator('name', {
                        rules: [{
                            required: true, message: '请输入发帖账号！'
                        }],
                        initialValue: !info.name ? '' : info.name
                    })(<Input />)}
                </FormItem>
                <FormItem label="密码" {...formItemLayout}>
                    {getFieldDecorator('pwd', {
                        rules: [{
                            required: true, message: '请输入密码！'
                        }],
                        initialValue: !info.pwd ? '' : info.pwd
                    })(<Input type="password" />)}
                </FormItem>
                <div className="btns">
                    <Button type="primary" htmlType="submit" onClick={(e) => this.login(e)}><Icon type="login" />登录</Button>
                </div>
            </Form>
        </div>
    }
}

export default Form.create()(PostSendLogin)
