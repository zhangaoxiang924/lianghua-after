/**
 * Author：zhoushuanglong
 * Time：2017/7/31
 * Description：login
 */

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import {hashHistory} from 'react-router'
import { connect } from 'react-redux'
import Cookies from 'js-cookie'
import { Form, Icon, Input, Modal } from 'antd'
import './index.scss'
import { alertLogin, login } from '../../actions/index'
import { deleteCookies } from '../../public/index'
const FormItem = Form.Item
class AlertLogin extends Component {
    constructor (props) {
        super(props)
        this.state = {
            value: '',
            verifyCodeImg: null,
            iconLoading: false,
            code: ''
        }
    }
    handleSubmit = (e) => {
        e.preventDefault()
        const _this = this
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values.loginType = 'alert'
                _this.setState({ iconLoading: true })
                _this.props.actions.login(values, (data) => {
                    if (data.code !== 1 || !data.code) {
                        _this.props.actions.alertLogin(false)
                        _this.setState({
                            iconLoading: false
                        })
                    }
                })
            }
        })
    }

    hideModal = () => {
        deleteCookies()
        Cookies.set('loginStatus', false)
        this.props.actions.alertLogin(false)
        hashHistory.push('/login')
    }

    accountChange = (e) => {
        this.setState({
            value: e.target.value
        })
    }

    render () {
        const {getFieldDecorator} = this.props.form
        return <Modal
            title="重新登陆"
            visible={this.props.alertStatus}
            onOk={this.handleSubmit}
            onCancel={this.hideModal}
            okText="确认"
            cancelText="取消"
            confirmLoading={this.state.iconLoading}
        >
            <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem>
                    {getFieldDecorator('nickNameOrphoneNum', {
                        rules: [{required: true, message: '请输入账号'}],
                        initialValue: this.state.value
                    })(
                        <Input onChange={(e) => { this.accountChange(e) }} prefix={<Icon type="user"/>} type="text" placeholder="请输入账号"/>
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('password', {
                        rules: [{required: true, message: '请输入密码'}],
                        initialValue: ''
                    })(
                        <Input prefix={
                            <Icon type="lock"/>
                        } type="password" placeholder="请输入密码"/>
                    )}
                </FormItem>
            </Form>
        </Modal>
    }
}

const mapStateToProps = (state) => {
    return {
        loginInfo: state.loginInfo,
        alertStatus: state.publicInfo.alertOrNot
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({login, alertLogin}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(AlertLogin))
