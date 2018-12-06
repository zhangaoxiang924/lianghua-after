/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'

import {
    Form,
    Input,
    Modal,
    Button,
    message,
    Row,
    Col,
    Spin
} from 'antd'
import {getTeamItemInfo, getExchangeInfo} from '../../actions/team/team.action'
import {axiosAjax, encodeStr} from '../../public/index'
import './index.scss'
import CollectionCreateForm from './ModalForm/index'
const FormItem = Form.Item
const {TextArea} = Input
const {confirm} = Modal

class TeamSend extends Component {
    constructor (props) {
        super(props)
        this.state = {
            confirmLoading: false,
            updateOrNot: true,
            loading: true,
            visible: false,
            noPassReason: '',
            iconLoading: false
        }
    }

    enterIconLoading = () => {
        this.setState({ iconLoading: true })
    }

    componentDidMount () {
        const {dispatch, location} = this.props
        dispatch(getExchangeInfo({
            'teamId': location.query.id,
            'passportId': location.query.passportId
        }))
        dispatch(getTeamItemInfo({'teamId': location.query.id}, (res) => {
            this.setState({
                loading: false
            })
        }))
        this.input.focus()
    }

    saveFormRef = (form) => {
        this.modalForm = form
    }

    // 取消
    handleCancel = () => {
        this.setState({
            visible: false
        })
    }

    getReason = (e) => {
        this.setState({
            noPassReason: e.target.value
        })
    }

    // 绑定交易所
    handleCreate = () => {
        const form = this.modalForm
        const {teamInfo, dispatch} = this.props
        let id = {
            teamId: teamInfo.id,
            passportId: teamInfo.passportId
        }
        form.validateFields((err, values) => {
            if (err) {
                return
            }
            this.setState({
                confirmLoading: true
            })
            console.log({...values, ...id})
            const data = encodeStr({...values, ...id})
            axiosAjax('POST', '/api_key/bind', {data}, (res) => {
                this.setState({
                    confirmLoading: false
                })
                if (res.code === 1) {
                    message.success('绑定成功！')
                    form.resetFields()
                    this.setState({ visible: false })
                    dispatch(getExchangeInfo({...id}))
                } else {
                    message.error(res.msg)
                }
            })
        })
    }

    // 取消绑定
    unBound = (e) => {
        const {teamInfo, dispatch} = this.props
        let id = {
            teamId: teamInfo.id,
            passportId: teamInfo.passportId
        }
        let exChange = e.target.getAttribute('data-id')
        confirm({
            title: '提示',
            content: `确认要取消绑定吗 ?`,
            onOk () {
                let sendData = {
                    ...id,
                    market: exChange
                }
                axiosAjax('post', '/api_key/unbind', sendData, (res) => {
                    if (res.code === 1) {
                        dispatch(getExchangeInfo({...id}))
                        message.success('操作成功')
                    } else {
                        message.error(res.msg)
                    }
                })
            }
        })
    }

    // 提交函数
    ajaxFn = (data, cb) => {
        const {teamInfo} = this.props
        data.tournamentId = teamInfo.tournamentId || ''
        data.passportId = teamInfo.passportId || ''
        axiosAjax('post', '/team/update_info', data, (res) => {
            cb && cb(res)
            this.setState({
                loading: false,
                iconLoading: false
            })
            if (res.code && res.code === 1) {
                message.success('内容更新成功!')
            } else {
                this.setState({
                    iconLoading: false
                })
                message.error('内容更新失败! ' + res.msg)
            }
        })
    }

    // 修改提交
    handleSubmit = (e) => {
        e.preventDefault()
        this.enterIconLoading()
        let status = parseInt(e.target.getAttribute('data-status'))
        const {teamInfo} = this.props
        let id = teamInfo.id
        this.props.form.validateFieldsAndScroll((err, values) => {
            values.id = id
            if (!err) {
                confirm({
                    title: '修改团队信息',
                    content: '确定执行该操作吗?',
                    onOk: () => {
                        if (status === -1) {
                            // 如果是驳回, 弹出框填写原因
                            confirm({
                                title: '提示',
                                content: <div className="modal-input">
                                    <span style={{marginRight: 10}}>请填写驳回原因：</span>
                                    <TextArea rows={3} autoFocus onChange={(e) => {
                                        this.getReason(e)
                                    }}/>
                                </div>,
                                onOk: () => {
                                    if (this.state.noPassReason.trim() !== '') {
                                        this.setState({
                                            loading: true
                                        })
                                        this.ajaxFn(values, (resData) => {
                                            let sendData = {
                                                id: id,
                                                status: status,
                                                jsonText: JSON.stringify({
                                                    noPassReason: this.state.noPassReason
                                                })
                                            }
                                            // 更新成功后进行修改状态请求
                                            if (resData.code === 1) {
                                                axiosAjax('POST', '/team/update', sendData, (res) => {
                                                    this.setState({
                                                        loading: false
                                                    })
                                                    if (res.code === 1) {
                                                        message.success(`状态修改成功!`)
                                                        hashHistory.push('/team-list')
                                                    } else {
                                                        message.error('状态修改失败! ' + res.msg)
                                                    }
                                                })
                                            }
                                        })
                                    } else {
                                        message.error('请填写驳回原因!')
                                    }
                                }
                            })
                        } else if (status === 1) {
                            // 如果是通过
                            this.ajaxFn(values, (resData) => {
                                let sendData = {
                                    id: id,
                                    status: status,
                                    jsonText: JSON.stringify({})
                                }
                                // 更新成功后进行修改状态请求
                                if (resData.code === 1) {
                                    axiosAjax('POST', '/team/update', sendData, (res) => {
                                        this.setState({
                                            loading: false
                                        })
                                        if (res.code === 1) {
                                            message.success(`状态修改成功!`)
                                            hashHistory.push('/team-list')
                                        } else {
                                            message.error('状态修改失败! ' + res.msg)
                                        }
                                    })
                                }
                            })
                        } else {
                            this.ajaxFn(values, (res) => {
                                if (res.code === 1) {
                                    hashHistory.push('/team-list')
                                }
                            })
                        }
                    }
                })
            } else {
                this.setState({
                    iconLoading: false
                })
            }
        })
    }

    render () {
        const {getFieldDecorator} = this.props.form
        const {teamInfo, apiList} = this.props
        const {updateOrNot} = this.state
        const formItemLayout = {
            labelCol: {span: 1},
            wrapperCol: {span: 18, offset: 1}
        }
        const notBound = <a className="notBound status" onClick={() => {
            this.setState({
                visible: true
            })
        }}>[未绑定]</a>
        return <div className="team-send">
            <Spin spinning={this.state.loading} size='large'>
                <Form onSubmit={this.handleSubmit} ref={(form) => { this.mainForm = form }}>
                    <Row>
                        <Col className="col-title">个人信息: </Col>
                    </Row>
                    <Row>
                        <Col span={11}>
                            <FormItem
                                {...formItemLayout}
                                label="姓名：">
                                {getFieldDecorator('leaderName', {
                                    initialValue: (updateOrNot && teamInfo) ? `${teamInfo.leaderName}` : '',
                                    rules: [{required: true, message: '请输入领队姓名！'}]
                                })(
                                    <Input ref={(input) => { this.input = input }} className="team-author" placeholder="请输入领队姓名"/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={11}>
                            <FormItem
                                {...formItemLayout}
                                label="邮箱： ">
                                {getFieldDecorator('leaderMail', {
                                    initialValue: (updateOrNot && teamInfo) ? `${teamInfo.leaderMail}` : '',
                                    rules: [{required: true, message: '请输入领队邮箱！'}]
                                })(
                                    <Input className="team-author" placeholder="请输入领队邮箱"/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={11}>
                            <FormItem
                                {...formItemLayout}
                                label="电话： ">
                                {getFieldDecorator('leaderPhone', {
                                    initialValue: (updateOrNot && teamInfo) ? `${teamInfo.leaderPhone}` : '',
                                    rules: [{required: true, message: '请输入领队电话！'}]
                                })(
                                    <Input className="team-author" placeholder="请输入领队电话"/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={11}>
                            <FormItem
                                {...formItemLayout}
                                label="公司： ">
                                {getFieldDecorator('companyName', {
                                    initialValue: (updateOrNot && teamInfo) ? `${teamInfo.companyName}` : '',
                                    rules: [{required: true, message: '请输入公司名！'}]
                                })(
                                    <Input className="team-author" placeholder="请输入公司名"/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={11}>
                            <FormItem
                                {...formItemLayout}
                                label="职务： ">
                                {getFieldDecorator('leaderTitle', {
                                    initialValue: (updateOrNot && teamInfo) ? `${teamInfo.leaderTitle}` : '',
                                    rules: [{required: true, message: '请输入领队职务！'}]
                                })(
                                    <Input className="team-author" placeholder="请输入领队职务"/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="col-title">团队信息: </Col>
                    </Row>
                    <Row>
                        <Col span={11}>
                            <FormItem
                                {...formItemLayout}
                                label="名称： ">
                                {getFieldDecorator('name', {
                                    initialValue: (updateOrNot && teamInfo) ? `${teamInfo.name}` : '',
                                    rules: [{required: true, message: '请输入队伍名称！'}]
                                })(
                                    <Input className="team-author" placeholder="请输入队伍名称"/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={11}>
                            <FormItem
                                {...formItemLayout}
                                label="人数： ">
                                {getFieldDecorator('memberCount', {
                                    initialValue: (updateOrNot && teamInfo) ? `${teamInfo.memberCount}` : 0,
                                    rules: [{required: true, message: '请输入团队人数！'}]
                                })(
                                    <Input className="team-author" placeholder="请输入团队人数"/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={11}>
                            <FormItem
                                {...formItemLayout}
                                label="简介： ">
                                {getFieldDecorator('description', {
                                    initialValue: (updateOrNot && teamInfo) ? `${teamInfo.description}` : '',
                                    rules: [{required: true, message: '请输入团队简介！'}]
                                })(
                                    <TextArea className="team-summary" rows={4} placeholder="请输入团队简介"/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={11}>
                            <FormItem
                                {...formItemLayout}
                                label="推荐机构： ">
                                {getFieldDecorator('recommendType', {
                                    initialValue: (updateOrNot && teamInfo) ? `${teamInfo.recommendType}` : '无',
                                    rules: [{required: false, message: '请输入推荐机构！'}]
                                })(
                                    <Input className="team-author" placeholder="请输入推荐机构"/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>

                    <Row className="apiContent">
                        <Col className="col-title">绑定API Key： </Col>
                        <Col offset={1} className="col-item">
                            <span className="account">账号1： </span>
                            {!apiList[0] ? notBound : <span>
                                <font className="exchangeName">{apiList[0]}</font>
                                <a data-id={apiList[0]} className="retire status" onClick={(e) => { this.unBound(e) }}>[解除绑定]</a>
                            </span>}
                        </Col>
                        <Col offset={1} className="col-item">
                            <span className="account">账号2： </span>
                            {!apiList[1] ? notBound : <span>
                                <font className="exchangeName">{apiList[1]}</font>
                                <a data-id={apiList[1] || ''} className="retire status" onClick={(e) => { this.unBound(e) }}>[解除绑定]</a>
                            </span>}
                        </Col>
                        <Col offset={1} className="col-item">
                            <span className="account">账号3： </span>
                            {!apiList[2] ? notBound : <span>
                                <font className="exchangeName">{apiList[2]}</font>
                                <a data-id={apiList[2] || ''} className="retire status" onClick={(e) => { this.unBound(e) }}>[解除绑定]</a>
                            </span>}
                        </Col>
                    </Row>

                    <FormItem
                        wrapperCol={{span: 12, offset: 1}}
                    >
                        <Button
                            loading={this.state.iconLoading}
                            type="primary" data-status='1' onClick={this.handleSubmit}
                            style={{marginRight: '10px'}}>审核通过</Button>
                        <Button
                            type="primary" data-status='-1' onClick={this.handleSubmit}
                            style={{marginRight: '10px'}}>审核驳回</Button>
                        <Button
                            type="primary" data-status='0' onClick={this.handleSubmit}
                            style={{marginRight: '10px'}}>确定修改</Button>
                        <Button
                            type="primary" className="cancel"
                            onClick={() => {
                                hashHistory.goBack()
                            }}>取消</Button>
                    </FormItem>
                </Form>
            </Spin>
            {this.state.visible && <CollectionCreateForm
                loading={this.state.confirmLoading}
                ref={this.saveFormRef}
                visible={this.state.visible}
                onCancel={this.handleCancel}
                onCreate={this.handleCreate}
            />}
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        teamInfo: state.teamInfo.info,
        apiList: state.teamInfo.apiList
    }
}

export default connect(mapStateToProps)(Form.create()(TeamSend))
