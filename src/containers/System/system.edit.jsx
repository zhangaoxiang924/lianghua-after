/**
 * Author：tantingting
 * Time：2017/9/22
 * Description：Description
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import { Input, Modal, Form, Radio, Checkbox, Row, Col } from 'antd'
// import defaultImgLarge from '../../public/img/default-large.png'
// import './img.scss'
const FormItem = Form.Item
const RadioGroup = Radio.Group
const CheckboxGroup = Checkbox.Group
const formItemLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 15}
}
const formItem = {
    span: 24,
    offset: 2
}
let gameList = [
    {
        'lk_game_id': 163,
        'lk_game_name': '黎明之光',
        'lk_game_file': '/theme/upload/2017-09-21/u=3253165404,785455444&fm=27&gp=0.jpg',
        'lk_game_datime': '2017-09-21 02:30:37'
    },
    {
        'lk_game_id': 252,
        'lk_game_name': '芈月传',
        'lk_game_file': '/theme/upload/2017-09-20/miyue2_icon.png',
        'lk_game_datime': '2017-09-20 08:44:22'
    }
]
class SystemEdit extends Component {
    submitForm = () => {
        const {form, submitEdit} = this.props
        form.validateFields((err, values) => {
            if (err) {
                return
            }
            let sendData = {...values}
            submitEdit(sendData)
            // form.resetFields()
        })
    }

    render () {
        const {isShow, type, onClose} = this.props
        const {getFieldDecorator} = this.props.form
        return <div>
            <Modal className="system-edit" title={type === 'edit' ? '编辑项目权限' : '新增用户'} visible={isShow} onOk={() => this.submitForm()} onCancel={() => onClose()} okText="确认" cancelText="取消">
                <Form>
                    <FormItem label="邮箱账号" {...formItemLayout}>
                        {getFieldDecorator('email', {
                            rules: [{
                                type: 'email', message: '请输入正确的邮箱账号'
                            }, {
                                required: true, message: '请输入邮箱账号'
                            }],
                            initialValue: ''
                        })(<Input />)}
                    </FormItem>
                    <FormItem {...formItemLayout} label="角色">
                        {getFieldDecorator('role', {
                            rules: [{
                                required: true, message: '请选择角色'
                            }],
                            initialValue: ''
                        })(
                            <RadioGroup>
                                <Radio value="0">用户</Radio>
                                <Radio value="1">管理员</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                    <FormItem label="项目权限" {...formItemLayout}>
                        {getFieldDecorator('lk_game_id', {
                            rules: [{
                                required: true, message: '请选择游戏'
                            }],
                            initialValue: []
                        })(
                            <CheckboxGroup className="check-items">
                                <Row>
                                    {gameList.map((item, i) => {
                                        return <Col key={i} {...formItem}><Checkbox value={`${item.lk_game_id}`}>{item.lk_game_name}</Checkbox></Col>
                                    })}
                                </Row>
                            </CheckboxGroup>
                        )}
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

export default connect(mapStateToProps)(Form.create()(SystemEdit))
