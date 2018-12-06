/**
 * Author：zhoushuanglong
 * Time：2017/7/31
 * Description：login
 */

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Form, Icon, Input, Button } from 'antd'
import './index.scss'
import { login } from '../../actions/index'
import {encodePsd} from '../../public/index'

// const confirm = Modal.confirm
const FormItem = Form.Item
class Login extends Component {
    constructor (props) {
        super(props)
        this.state = {
            value: '',
            verifyCodeImg: null,
            iconLoading: false,
            code: ''
        }
    }

    getCode = (e) => {
        this.setState({
            code: e.target.value
        })
    }

    enterIconLoading = () => {
        this.setState({ iconLoading: true })
    }

    handleSubmit = (e) => {
        // let random = (Math.random() * 30).toString(32)
        // let src = `//${location.host}/mgr/account/getGraphCode?random=${random}`
        e.preventDefault()
        const _this = this
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.enterIconLoading()
                values.password = encodePsd(values.password)
                _this.props.actions.login(values, (data) => {
                    if (data.code !== 1 || !data.code) {
                        _this.setState({
                            iconLoading: false
                        })
                    }
                })
                // confirm({
                //     title: '提示',
                //     content: <div>
                //         <p>请输入验证码：</p>
                //         <Input style={{width: 100, verticalAlign: 'middle', marginRight: 10}} autoFocus onChange={_this.getCode}/>
                //         <img src={src} style={{width: 100, verticalAlign: 'middle'}} alt="验证码"/>
                //     </div>,
                //     onOk () {
                //         values.graphCode = _this.state.code
                //         _this.props.actions.login(values, (data) => {
                //             if (data.code !== 1 || !data.code) {
                //                 _this.setState({
                //                     iconLoading: false
                //                 })
                //             }
                //         })
                //         _this.enterIconLoading()
                //     }
                // })
            }
        })
    }

    accountChange = (e) => {
        this.setState({
            value: e.target.value
        })
    }

    render () {
        const {getFieldDecorator} = this.props.form
        return <div className="login-wrap">
            <header className="clearfix"><div className="logo">{/* <img src={logo}/> */}</div><h3>火星财经管理后台</h3></header>
            <div className="login-main">
                <div className="login-contain">
                    <div className="login-icon"></div>
                    <h3>用户登录</h3>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <FormItem>
                            {getFieldDecorator('userName', {
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
                        <FormItem>
                            {/* <a className="login-form-forgot" href="">忘记密码</a> */}
                            <Button type="primary" htmlType="submit" loading={this.state.iconLoading} className="login-form-button">登录</Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        loginInfo: state.loginInfo
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({login}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Login))
