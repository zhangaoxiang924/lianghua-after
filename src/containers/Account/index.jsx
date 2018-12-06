/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Row, Col, Modal, message, Spin, Select, Input, Button, Form } from 'antd'
import './index.scss'
import Cookies from 'js-cookie'
import {getAccountList, setSearchQuery, setPageData, setFilterData, addAccount, selectData} from '../../actions/account/index'
import {axiosAjax, cutString, channelIdOptions, encodePsd, formatDate} from '../../public/index'
import UpdatePsw from './updatepsw'
const confirm = Modal.confirm
const Option = Select.Option
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
let columns = []
const FormItem = Form.Item
class AccountIndex extends Component {
    constructor () {
        super()
        this.state = {
            loading: true,
            newsStatus: null,
            editNewsId: '',
            visible: false,
            passwordModal: false,
            confirmDirty: false
        }
    }

    channelName (id) {
        let name = ''
        channelIdOptions.map((item, index) => {
            if (parseInt(item.value) === id) {
                name = item.label
            }
        })
        return name
    }

    componentWillMount () {
        const {search, filter, dispatch} = this.props
        this.doSearch('init', {...filter, value: search.value})
        columns = [{
            title: '用户名 ',
            dataIndex: 'userName',
            key: 'userName'
        }, {
            title: '昵称',
            key: 'nickName',
            render: (text, record) => (record && <div className="account-info clearfix">
                <div>
                    <h4 title={record.title} dangerouslySetInnerHTML={this.createMarkup(cutString(record.nickName, 30))} />
                </div>
            </div>)
        }, {
            title: '账号 ID ',
            dataIndex: 'id',
            key: 'id'
        }, {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            render: record => formatDate(record)
        }, {
            title: '账号状态',
            key: 'status',
            render: (record) => {
                if (record && record.status === 1) {
                    return <span className="news-status">正常</span>
                } if (record && record.status === -1) {
                    return <span className="news-status cont-publish">封禁</span>
                } else {
                    return <span className="news-status pre-publish">暂无</span>
                }
            }
        }, {
            title: '操作',
            key: 'action',
            render: (item) => (<div className="btns">
                {/*
                <p>
                    <a className="mr10 opt-btn" onClick={() => { this.updateAccount(item) }} style={{background: '#108ee9'}}>编辑</a>
                </p>
                 <p>
                 <a onClick={() => this.delAccount(item)} className="mr10 opt-btn" href="javascript:void(0)" style={{background: '#d73435'}}>删除</a>
                 </p>
                */}
                <p>
                    <a className="mr10 opt-btn" href="javascript:void(0)" onClick={() => this._isPublish(item)} style={{background: '#00a854'}}>
                        {(() => {
                            if (item.status === 1) {
                                return '停用'
                            } else if (item.status === -1) {
                                return '启用'
                            }
                        })()}
                    </a>
                </p>
                <p>
                    <a
                        onClick={() => {
                            this.setState({passwordModal: true})
                            dispatch(selectData(item))
                        }}
                        className="mr10 opt-btn"
                        href="javascript:void(0)"
                        style={{background: '#64a5f8'}}
                    >修改密码</a>
                </p>
            </div>)
        }]
    }
    componentWillUnmount () {
        const {dispatch} = this.props
        dispatch(setPageData({'pageSize': 20, 'totalCount': 0}))
    }

    createMarkup (str) { return {__html: str} }

    submitAccount () {
        const {dispatch, form, selectedData} = this.props
        const This = this
        form.validateFields((err, values) => {
            if (err) {
                return false
            }
            delete values.confirm
            values.password = encodePsd(values.password)
            values.superUserName = Cookies.get('hx_userName')
            values.superUserToken = Cookies.get('hx_token')
            if (selectedData.userName) {
                axiosAjax('post', '/account/add', {
                    passportId: selectedData.passportId,
                    phoneNum: values.phoneNum,
                    nickName: values.nickName,
                    introduce: '',
                    role: values.role
                }, (data) => {
                    if (data.code === 1) {
                        message.success('操作成功!')
                        this.setState({ visible: false })
                        form.resetFields()
                        This.doSearch('init')
                    } else {
                        message.success(data.msg)
                    }
                })
            } else {
                dispatch(addAccount(values, () => {
                    this.setState({ visible: false })
                    form.resetFields()
                    this.doSearch('init')
                }))
            }
        })
    }

    updateAccount (item) {
        this.props.dispatch(selectData(item))
        this.setState({
            visible: true
        })
    }

    doSearch (type, data) {
        const {dispatch} = this.props
        let sendData = {
            superUserName: Cookies.get('hx_userName'),
            superUserToken: Cookies.get('hx_token')
        }
        sendData = {...sendData, ...data}
        dispatch(getAccountList(type, sendData, () => {
            this.setState({
                loading: false
            })
        }))
    }

    _search () {
        const {dispatch} = this.props
        let type = 'init'
        this.doSearch(type, {'currentPage': 1})
        dispatch(setSearchQuery({'type': type}))
        dispatch(setPageData({'currPage': 1}))
    }

    changePage (page) {
        this.setState({
            loading: true
        })
        const {dispatch, search, filter} = this.props
        // this.setState({'currPage': page})
        dispatch(setPageData({'currPage': page}))
        this.doSearch(search.type, {'currentPage': page, ...filter})
    }

    // 删除
    delAccount (item) {
        const {dispatch} = this.props
        const _this = this
        confirm({
            title: '提示',
            content: `确认要删除吗 ?`,
            onOk () {
                let sendData = {
                    passportId: item.passportId
                }
                axiosAjax('POST', '/liveaccount/delete', {...sendData}, (res) => {
                    if (res.code === 1) {
                        message.success('删除成功')
                        _this.doSearch('init')
                        dispatch(setSearchQuery({'type': 'init'}))
                    } else {
                        message.error(res.msg)
                    }
                })
            }
        })
    }

    // 封禁/解封
    _isPublish (item) {
        const {dispatch} = this.props
        const _this = this

        confirm({
            title: '提示',
            content: `确认要${item.status === 1 ? '停用' : '启用'}用户吗 ?`,
            onOk () {
                let sendData = {
                    superUserName: Cookies.get('hx_userName'),
                    superUserToken: Cookies.get('hx_token'),
                    userName: item.userName,
                    status: item.status === 1 ? -1 : 1
                }
                axiosAjax('POST', '/account/update_status', {...sendData}, (res) => {
                    if (res.code === 1) {
                        message.success('操作成功')
                        _this.doSearch('init')
                        dispatch(setSearchQuery({'type': 'init'}))
                    } else {
                        message.error(res.msg)
                    }
                })
            }
        })
    }

    // 筛选状态
    handleChange = (value) => {
        const {dispatch} = this.props
        dispatch(setFilterData({'status': value}))
        this.setState({
            newsStatus: value
        })
        this.doSearch('init', {'currentPage': 1, status: value})
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

    cancelModal = () => {
        const {form} = this.props
        this.setState({visible: false})
        form.resetFields()
    }

    changePassword = () => {
        const This = this
        const {selectedData, dispatch} = this.props
        const form = this.passwordForm.props.form
        form.validateFields((err, values) => {
            if (err) {
                return false
            }
            axiosAjax('post', '/account/set_password', {
                superUserName: Cookies.get('hx_userName'),
                superUserToken: Cookies.get('hx_token'),
                userName: selectedData.userName,
                password: encodePsd(values.password)
            }, (data) => {
                if (data.code === 1) {
                    message.success('操作成功!')
                    this.setState({ passwordModal: false })
                    form.resetFields()
                    This.doSearch('init')
                    dispatch(selectData({}))
                } else {
                    message.success(data.msg)
                }
            })
        })
    }

    cancelPasswordModal = () => {
        const {dispatch} = this.props
        const form = this.passwordForm.props.form
        this.setState({passwordModal: false})
        form.resetFields()
        dispatch(selectData({}))
    }

    render () {
        const {list, filter, search, dispatch, form, selectedData} = this.props
        const { getFieldDecorator } = form
        return <div className="account-index">
            <Row>
                <Col>
                    <span>账号状态：</span>
                    <Select defaultValue={`${filter.status}`} style={{ width: 100 }} onChange={this.handleChange}>
                        <Option value="">全部</Option>
                        <Option value="1">正常</Option>
                        <Option value="-1">封禁</Option>
                    </Select>
                    <span style={{marginLeft: 15}}>账号昵称：</span>
                    <Input
                        value={search.value}
                        style={{width: 150, marginRight: 15}}
                        onChange={(e) => dispatch(setSearchQuery({value: e.target.value}))}
                        placeholder="输入昵称/手机号搜索"
                    />
                    <span>
                        <Button type="primary" onClick={() => { this._search() }}>搜索</Button>
                        <Button type="primary" style={{margin: '0 0 0 15px'}} onClick={() => {
                            this.setState({visible: true})
                            dispatch(selectData({}))
                        }}>新增账号</Button>
                    </span>
                </Col>
            </Row>
            <div className="mt30">
                <Spin spinning={this.state.loading} size="large">
                    <Table dataSource={list.map((item, index) => ({...item, key: index}))} columns={columns} bordered />
                </Spin>
            </div>
            <Modal
                title="添加/修改账号"
                visible={this.state.visible}
                onOk={() => this.submitAccount()}
                onCancel={ this.cancelModal }
            >
                <Form>
                    <FormItem {...formItemLayout} label="用户名">
                        {getFieldDecorator('userName', {
                            rules: [{
                                required: true, message: '请输入用户名!'
                            }],
                            initialValue: selectedData.userName === '' ? '' : selectedData.userName
                        })(
                            <Input placeholder="请输入用户名, 可以为手机号"/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="用户昵称">
                        {getFieldDecorator('nickName', {
                            rules: [{
                                required: true, message: '请输入昵称!'
                            }],
                            initialValue: selectedData.nickName === '' ? '' : selectedData.nickName
                        })(
                            <Input />
                        )}
                    </FormItem>
                    {/*
                    <FormItem {...formItemLayout} label="手机号">
                        {getFieldDecorator('phoneNum', {
                            rules: [{
                                required: true, message: '请输入手机号!'
                            }, {
                                pattern: /^1[3|4|5|8][0-9]\d{8}$/, message: '请输入正确的手机号!'
                            }],
                            initialValue: selectedData.phoneNum === '' ? '' : selectedData.phoneNum
                        })(
                            <Input />
                        )}
                    </FormItem>
                    */}
                    {!selectedData.passportId && <div>
                        <FormItem {...formItemLayout} label="账号密码">
                            {getFieldDecorator('password', {
                                rules: [{
                                    required: !selectedData.passportId && selectedData.passportId !== '', message: '请输入密码!'
                                }, {
                                    validator: this.validateToNextPassword
                                }],
                                initialValue: selectedData.password === '' ? '' : selectedData.password
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="确认密码">
                            {getFieldDecorator('confirm', {
                                rules: [{
                                    required: !selectedData.passportId && selectedData.passportId !== '', message: '请确认密码!'
                                }, {
                                    validator: this.compareToFirstPassword
                                }],
                                initialValue: selectedData.password === '' ? '' : selectedData.password
                            })(
                                <Input type="password" onBlur={this.handleConfirmBlur} />
                            )}
                        </FormItem>
                    </div>}
                    {/*
                    <FormItem
                        {...formItemLayout}
                        label="发表权限"
                    >
                        {getFieldDecorator('role', {
                            initialValue: selectedData.role ? `${selectedData.role}` : '1'
                        })(
                            <RadioGroup>
                                <Radio value="1">需要审核</Radio>
                                <Radio value="2">无需审核</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                    */}
                </Form>
            </Modal>
            <UpdatePsw
                wrappedComponentRef={(passwordForm) => { this.passwordForm = passwordForm }}
                visible={this.state.passwordModal}
                onCreate={this.changePassword}
                onCancel={ this.cancelPasswordModal }
            />
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        accountInfo: state.accountInfo,
        list: state.accountInfo.list,
        search: state.accountInfo.search,
        filter: state.accountInfo.filter,
        pageData: state.accountInfo.pageData,
        selectedData: state.accountInfo.selectedData
    }
}

export default connect(mapStateToProps)(Form.create()(AccountIndex))
